package com.greedyraccoon.backend.repository;

import com.greedyraccoon.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    // Custom method to fetch clients managed by a specific agent
    List<Client> findByAgentId(Long agentId);
}