package com.greedyraccoon.backend.dto;

import java.math.BigDecimal;

public record DealRequest(
        Long propertyId,
        Long clientId,
        BigDecimal finalPrice,
        String status
) {}