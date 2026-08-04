package com.greedyraccoon.backend.property.controller;

import com.greedyraccoon.backend.property.model.Property;
import com.greedyraccoon.backend.property.dto.PropertyRequest;
import com.greedyraccoon.backend.property.dto.PropertyResponse;
import com.greedyraccoon.backend.property.repository.PropertyRepository;
import com.greedyraccoon.backend.media.service.ImageStorageService;
import com.greedyraccoon.backend.media.service.PropertyImageService;
import com.greedyraccoon.backend.property.service.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;
    private final PropertyRepository propertyRepository;
    private final PropertyImageService propertyImageService;
    private final ImageStorageService imageStorageService;

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

    @PostMapping("/{id}/images")
    public ResponseEntity<List<String>> uploadImages(
            @PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        List<String> uploadedKeys = propertyImageService.uploadImages(id, files);
        return ResponseEntity.ok(uploadedKeys);
    }


}