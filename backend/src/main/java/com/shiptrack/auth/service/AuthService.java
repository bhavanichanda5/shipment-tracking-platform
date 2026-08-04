package com.shiptrack.auth.service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

//import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shiptrack.activity.service.ActivityService;
import com.shiptrack.auth.dto.AuthResponse;
import com.shiptrack.auth.dto.GoogleTokenInfoResponse;
import com.shiptrack.auth.dto.Googleauthrequest;
import com.shiptrack.auth.dto.LoginRequest;
import com.shiptrack.auth.dto.RegisterRequest;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.repository.UserRepository;
import com.shiptrack.auth.entity.Role;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ActivityService activityService;
    private final GoogleTokenVerifierService googleTokenVerifierService;
    private final SecureRandom secureRandom = new SecureRandom();

    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            ActivityService activityService,
            GoogleTokenVerifierService googleTokenVerifierService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.activityService = activityService;
        this.googleTokenVerifierService = googleTokenVerifierService;
    }

    // Register

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .name(request.getName())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER) // by default role customer
                .build();

        userRepository.save(user);
        try {
            activityService.save(user.getUsername(), "USER_REGISTERED", "User registered: " + user.getUsername());
        } catch (Exception ignored) {
        }

        return AuthResponse.builder()
                .message("User Registered Successfully")
                .name(user.getName())
                .token(null)
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }

    // Login

    public AuthResponse login(LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid Username");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName()) // <-- VERY IMPORTANT
                .username(user.getUsername())
                .role(user.getRole())
                .message("Login Successful")
                .build();
    }

    // Google Sign-In
    //
    // Flow:
    // 1. verify the ID token server-side (never trust it unverified)
    // 2. an account already linked to this Google id -> log them in
    // 3. no linked account, but a password account exists with this email
    // (as username) -> link Google to it, so the same account works
    // either way going forward
    // 4. neither exists -> create a new CUSTOMER account (registration
    // already forces new sign-ups to CUSTOMER; Google sign-up matches
    // that same policy rather than trusting a role from the client)
    public AuthResponse googleAuth(Googleauthrequest request) {

        GoogleTokenInfoResponse googleUser = googleTokenVerifierService.verify(request.getIdToken());

        if (googleUser == null) {
            throw new RuntimeException("Google sign-in could not be verified. Please try again.");
        }

        User user = userRepository.findByGoogleId(googleUser.getSub())
                .or(() -> linkExistingAccountByEmail(googleUser))
                .orElseGet(() -> createGoogleUser(googleUser));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .username(user.getUsername())
                .role(user.getRole())
                .message("Login Successful")
                .build();
    }

    private Optional<User> linkExistingAccountByEmail(GoogleTokenInfoResponse googleUser) {
        return userRepository.findByUsername(googleUser.getEmail())
                .map(existing -> {
                    existing.setGoogleId(googleUser.getSub());
                    if (existing.getName() == null || existing.getName().isBlank()) {
                        existing.setName(googleUser.getName());
                    }
                    userRepository.save(existing);
                    try {
                        activityService.save(existing.getUsername(), "GOOGLE_ACCOUNT_LINKED",
                                "Linked Google sign-in to existing account: " + existing.getUsername());
                    } catch (Exception ignored) {
                    }
                    return existing;
                });
    }

    private User createGoogleUser(GoogleTokenInfoResponse googleUser) {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        String unusablePassword = Base64.getEncoder().encodeToString(randomBytes);

        User user = User.builder()
                .name(googleUser.getName())
                .username(googleUser.getEmail())
                .password(passwordEncoder.encode(unusablePassword))
                .role(Role.CUSTOMER) // matches register(): new sign-ups always start as CUSTOMER
                .googleId(googleUser.getSub())
                .build();

        userRepository.save(user);
        try {
            activityService.save(user.getUsername(), "USER_REGISTERED",
                    "User registered via Google: " + user.getUsername());
        } catch (Exception ignored) {
        }

        return user;
    }
}