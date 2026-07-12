package com.greedyraccoon.backend.repository;

import com.greedyraccoon.backend.model.Property;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findAll(Specification<Property> spec, Sort sort);

}