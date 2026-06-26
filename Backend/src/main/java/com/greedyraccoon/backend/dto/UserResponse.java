package com.greedyraccoon.backend.dto;

// We use this so we NEVER send the password back to React
public record UserResponse(
        Long id,
        String name,
        String email,
        String role
) {}