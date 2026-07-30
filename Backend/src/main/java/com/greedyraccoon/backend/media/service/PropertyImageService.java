package com.greedyraccoon.backend.media.service;

import com.greedyraccoon.backend.exceptionHandler.ResourceNotFoundException;
import com.greedyraccoon.backend.property.model.Property;
import com.greedyraccoon.backend.property.model.PropertyImage;
import com.greedyraccoon.backend.property.repository.PropertyImageRepository;
import com.greedyraccoon.backend.property.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyImageService {

    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final ImageStorageService imageStorageService;

    public List<String> uploadImages(Long propertyId, List<MultipartFile> files) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found"));

        List<String> uploadedKeys = new ArrayList<>();
        int order = 0;

        for (MultipartFile file : files) {
            try {
                String key = imageStorageService.uploadImage(file);
                PropertyImage image = new PropertyImage();
                image.setProperty(property);
                image.setImageKey(key);
                image.setDisplayOrder(order++);
                image.setPrimary(order == 1);
                propertyImageRepository.save(image);
                uploadedKeys.add(key);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image: " + file.getOriginalFilename(), e);
            }
        }
        return uploadedKeys;
    }
}