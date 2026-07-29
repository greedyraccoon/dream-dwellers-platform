package com.greedyraccoon.backend.property.dto;

import java.math.BigDecimal;
import java.util.List;

public record PropertyResponse(
        Long id,
        String title,
        String description,
        String type,
        String status,
        BigDecimal price,
        String location,
        String agentName,
        List<String> imageUrls,
        Integer bedrooms,
        Double area,
        Integer bathrooms
) {}