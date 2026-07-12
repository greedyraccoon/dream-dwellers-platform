package com.greedyraccoon.backend.dto;

import java.math.BigDecimal;

public record PropertyResponse(
        Long id,
        String title,
        String type,
        String status,
        BigDecimal price,
        String location,
        String agentName,
        String imageUrl,
        Integer bedrooms,
        Double area
) {}
