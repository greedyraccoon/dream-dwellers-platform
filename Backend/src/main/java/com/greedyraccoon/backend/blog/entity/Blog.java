package com.greedyraccoon.backend.blog.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "blogs")
public class Blog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // e.g., "top-10-apartments" (used for clean frontend URLs)
    @Column(unique = true, nullable = false)
    private String slug;

    // This stores your rich-text HTML string
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private String coverImageUrl;

    @CreationTimestamp
    private LocalDateTime createdAt;
}