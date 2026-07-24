package com.greedyraccoon.backend.client.dto;

import java.math.BigDecimal;

public record ClientRequest(
        String name,
        String email,
        String phone,
        BigDecimal budget,
        String preferences
) {}