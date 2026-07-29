package com.greedyraccoon.backend.blog.dto;

import java.time.LocalDateTime;

public record BlogResponse(
        Long id,
        String title,
        String slug,
        String content,
        String coverImageUrl,
        LocalDateTime createdAt
) {}
