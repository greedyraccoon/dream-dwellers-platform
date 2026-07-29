package com.greedyraccoon.backend.blog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BlogRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 255)
        String title,

        @NotBlank(message = "Slug is required")
        String slug,

        @NotBlank(message = "Content cannot be empty")
        String content, // HTML / Markdown text string

        String coverImageUrl
) {}