package com.shiptrack.auth.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shiptrack.auth.dto.AuthResponse;
import com.shiptrack.auth.dto.LoginRequest;
import com.shiptrack.auth.dto.RegisterRequest;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.repository.UserRepository;

@Service
public class AuthService 
{
    private final UserRepository userRepository;                            //Save User
    private final PasswordEncoder passwordEncoder;                  //Encode Password

    private final JwtService jwtService;                                        //Generate JWT Token

    public AuthService(UserRepository userRepository,       
                                PasswordEncoder passwordEncoder, 
                                JwtService jwtService)                                          //Constructor Injection
    {
        this.userRepository = userRepository;                   
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request)               //method called when user registers, takes RegisterRequest as input and returns AuthResponse
    {

        if (userRepository.existsByUsername(request.getUsername())) 
        {
            throw new RuntimeException("Username already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();                                                   //Create a new User object using the builder pattern, setting the username, encoded password, and role from the RegisterRequest


                userRepository.save(user);

                return AuthResponse.builder()
                        .message("User Registered Successfully")
                        .token(null)
                        .build();
    }

    public AuthResponse login(LoginRequest request) {       

        Optional<User> optionalUser =
                userRepository.findByUsername(request.getUsername());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Invalid Username");
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getUsername());

        return AuthResponse.builder()
                .message("Login Successful")
                .token(token)
                .build();
    }
}
