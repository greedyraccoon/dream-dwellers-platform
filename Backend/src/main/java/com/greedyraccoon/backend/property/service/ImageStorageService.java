package com.greedyraccoon.backend.property.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageStorageService {

    private final S3Client s3Client;

    @Value("${oracle.bucket-name}") private String bucketName;
    @Value("${oracle.endpoint}") private String endpoint;

    public String uploadImage(MultipartFile file) throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();

        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(request, RequestBody.fromInputStream(
                file.getInputStream(), file.getSize()));

        return key;
    }

    public void deleteImage(String key) {
        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .build());
    }

    // Assuming bucket is public-read (simplest for real estate listing images)
    public String getPublicUrl(String key) {
        return endpoint.replace("https://", "https://" + bucketName + ".") + "/o/" + key;
        // verify exact public URL pattern in Oracle console — format varies slightly
    }
}