package com.greedyraccoon.backend.service;

import com.greedyraccoon.backend.dto.PropertyRequest;
import com.greedyraccoon.backend.dto.PropertyResponse;
import com.greedyraccoon.backend.model.Property;
import com.greedyraccoon.backend.model.User;
import com.greedyraccoon.backend.repository.PropertyRepository;
import com.greedyraccoon.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final UserRepository userRepository;

    public PropertyResponse createProperty(PropertyRequest request, String agentEmail) {
        User agent = userRepository.findByEmail(agentEmail)
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        Property property = new Property();
        property.setTitle(request.title());
        property.setDescription(request.description());
        property.setType(Property.PropertyType.valueOf(request.type().toUpperCase()));
        property.setStatus(Property.PropertyStatus.valueOf(request.status().toUpperCase()));
        property.setPrice(request.price());
        property.setLocation(request.location());
        property.setBedrooms(request.bedrooms());
        property.setArea(request.area());
        property.setImageUrl(request.imageUrl());

        property.setAgent(agent);

        Property savedProperty = propertyRepository.save(property);

        return mapToResponse(savedProperty);
    }

    public List<PropertyResponse> getAllProperties() {
        return propertyRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private PropertyResponse mapToResponse(Property property) {
        return new PropertyResponse(
                property.getId(),
                property.getTitle(),
                property.getType().name(),
                property.getStatus().name(),
                property.getPrice(),
                property.getLocation(),
                property.getAgent().getName(),
                property.getImageUrl(),
                property.getBedrooms(),
                property.getArea()
        );
    }


    public PropertyResponse updateProperty(Long id, PropertyRequest request, String agentEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));


        if (!property.getAgent().getEmail().equals(agentEmail)) {
            throw new RuntimeException("Unauthorized: You can only update your own properties");
        }

        property.setTitle(request.title());
        property.setDescription(request.description());
        property.setType(Property.PropertyType.valueOf(request.type().toUpperCase()));
        property.setStatus(Property.PropertyStatus.valueOf(request.status().toUpperCase()));
        property.setPrice(request.price());
        property.setLocation(request.location());
        property.setBedrooms(request.bedrooms());
        property.setArea(request.area());
        property.setImageUrl(request.imageUrl());

        Property updatedProperty = propertyRepository.save(property);
        return mapToResponse(updatedProperty);
    }


    public void deleteProperty(Long id, String agentEmail) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        // Security check: Only the agent who created it can delete it
        if (!property.getAgent().getEmail().equals(agentEmail)) {
            throw new RuntimeException("Unauthorized: You can only delete your own properties");
        }

        propertyRepository.delete(property);
    }

    // --- SEARCH, FILTER, AND SORT PROPERTIES ---
    public List<PropertyResponse> searchProperties(String location, BigDecimal minPrice, BigDecimal maxPrice,
                                                   Integer bedrooms, Property.PropertyStatus status,
                                                   Property.PropertyType type, String sortBy, String sortDir) {

        // 1. Build the Sort object
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        // 2. Build the JPA Specification for dynamic filtering
        Specification<Property> spec = (root, query, cb) -> cb.conjunction();
        
        if (location != null && !location.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
        }
        if (minPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("price"), minPrice));
        }
        if (maxPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("price"), maxPrice));
        }
        if (bedrooms != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("bedrooms"), bedrooms));
        }
        if (status != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status));
        }
        if (type != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("type"), type));
        }

        // 3. Execute query and map to response
        return propertyRepository.findAll(spec, sort)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public PropertyResponse getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return mapToResponse(property);
    }
}