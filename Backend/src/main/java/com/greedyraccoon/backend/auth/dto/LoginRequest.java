package com.greedyraccoon.backend.auth.dto;

public record LoginRequest(
        String email,
        String password
) {}