package com.greedyraccoon.backend.auth.dto;

public record RegisterRequest(
        String name,
        String email,
        String password,
        String role
) {}