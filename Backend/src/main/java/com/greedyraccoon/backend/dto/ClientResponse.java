package com.greedyraccoon.backend.dto;

import java.math.BigDecimal;

public record ClientResponse(
        Long id,
        String name,
        String email,
        String phone,
        BigDecimal budget,
        String preferences,
        String agentName
) {}