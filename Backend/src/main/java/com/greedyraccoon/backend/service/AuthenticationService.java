package com.greedyraccoon.backend.service;

import com.greedyraccoon.backend.dto.AuthenticationResponse;
import com.greedyraccoon.backend.dto.LoginRequest;
import com.greedyraccoon.backend.dto.RegisterRequest;
import com.greedyraccoon.backend.model.User;
import com.greedyraccoon.backend.repository.UserRepository;
import com.greedyraccoon.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(User.Role.valueOf(request.role().toUpperCase()));

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse(
                jwtToken,
                user.getId(),
                user.getName(),
                user.getRole().name()
        );
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwtToken = jwtService.generateToken(user);

        return new AuthenticationResponse(
                jwtToken,
                user.getId(),
                user.getName(),
                user.getRole().name()
        );
    }
}