package com.greedyraccoon.backend.dto;

import java.math.BigDecimal;

public record PropertyRequest(
        String title,
        String description,
        String type,
        String status,
        BigDecimal price,
        String location,
        Integer bedrooms,
        Double area,
        String imageUrl
) {}