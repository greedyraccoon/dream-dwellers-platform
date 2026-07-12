package com.greedyraccoon.backend.controller;

import com.greedyraccoon.backend.dto.PropertyRequest;
import com.greedyraccoon.backend.dto.PropertyResponse;
import com.greedyraccoon.backend.model.Property;
import com.greedyraccoon.backend.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@RestController
    @RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @RequestBody PropertyRequest request,
            Principal principal
    ) {
        // principal.getName() holds the email extracted from the JWT token
        return ResponseEntity.ok(propertyService.createProperty(request, principal.getName()));
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAllProperties() {
        return ResponseEntity.ok(propertyService.getAllProperties());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getPropertyById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getPropertyById(id));
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<PropertyResponse> updateProperty(
            @PathVariable Long id,
            @RequestBody PropertyRequest request,
            Principal principal) {
        return ResponseEntity.ok(propertyService.updateProperty(id, request, principal.getName()));
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProperty(
            @PathVariable Long id,
            Principal principal) {
        propertyService.deleteProperty(id, principal.getName());
        return ResponseEntity.noContent().build();
    }

    // Filter + Sort (replaces your getAllProperties or sits alongside it)
    @GetMapping("/search")
    public ResponseEntity<List<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer bedrooms,
            @RequestParam(required = false) Property.PropertyStatus status,
            @RequestParam(required = false) Property.PropertyType type,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(propertyService.searchProperties(
                location, minPrice, maxPrice, bedrooms, status, type, sortBy, sortDir));
    }


}