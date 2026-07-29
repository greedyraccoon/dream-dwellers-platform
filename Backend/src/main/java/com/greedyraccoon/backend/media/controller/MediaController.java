package com.greedyraccoon.backend.media.controller;

import com.greedyraccoon.backend.property.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/media")
public class MediaController {

    private final ImageStorageService imageStorageService;

    @Value("${aws.bucket-name}")
    private String bucketName;

    @Value("${aws.region}")
    private String region;

    public MediaController(ImageStorageService imageStorageService) {
        this.imageStorageService = imageStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        String key = imageStorageService.uploadImage(file);

        String fullUrl = String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, key);

        return ResponseEntity.ok(fullUrl);
    }
}