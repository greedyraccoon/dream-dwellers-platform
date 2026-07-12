package com.greedyraccoon.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "deals")
public class Deal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The property being sold/rented
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    // The client buying/renting the property
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    // The agent managing the deal
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private User agent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DealStatus status;

    @Column(nullable = false)
    private BigDecimal finalPrice;

    @Column(nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime dealDate;


    public enum DealStatus {
        PENDING,
        CLOSED,
        CANCELLED
    }
}