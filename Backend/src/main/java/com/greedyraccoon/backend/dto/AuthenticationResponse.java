package com.greedyraccoon.backend.dto;

public record AuthenticationResponse(
        String token,
        Long userId,
        String name,
        String role
) {}