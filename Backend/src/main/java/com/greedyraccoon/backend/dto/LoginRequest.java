package com.greedyraccoon.backend.dto;

public record LoginRequest(
        String email,
        String password
) {}