package com.shiptrack.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.shiptrack.auth.dto.AuthResponse;
import com.shiptrack.auth.dto.RegisterRequest;
import com.shiptrack.auth.entity.User;
import com.shiptrack.auth.repository.UserRepository;

@Service
public class AuthService 
{
    private final UserRepository userRepository;                            //Save User
    private final PasswordEncoder passwordEncoder;                  //Encode Password

    public AuthService(UserRepository userRepository,       
                                PasswordEncoder passwordEncoder)                        //Constructor Injection
    {
        this.userRepository = userRepository;                   
        this.passwordEncoder = passwordEncoder;
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
}
