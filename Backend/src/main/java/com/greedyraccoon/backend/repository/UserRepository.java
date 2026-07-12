package com.greedyraccoon.backend.repository;

import com.greedyraccoon.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query method for Spring Security login
    Optional<User> findByEmail(String email);

    // Checks if an email exists before creating a new account
    boolean existsByEmail(String email);
}