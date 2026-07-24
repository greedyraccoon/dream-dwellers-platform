package com.greedyraccoon.backend.auth.dto;

public record AuthenticationResponse(
        String token,
        Long userId,
        String name,
        String role
) {}