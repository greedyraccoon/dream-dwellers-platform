package com.greedyraccoon.backend.repository;

import com.greedyraccoon.backend.model.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    // Fetch all deals managed by a specific agent
    List<Deal> findByAgentId(Long agentId);
}
