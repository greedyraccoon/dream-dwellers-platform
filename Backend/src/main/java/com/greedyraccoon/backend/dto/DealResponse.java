package com.greedyraccoon.backend.dto;

import java.math.BigDecimal;

public record DealResponse(
        Long id,
        String propertyTitle,
        String clientName,
        String agentName,
        BigDecimal finalPrice,
        String status
) {}
