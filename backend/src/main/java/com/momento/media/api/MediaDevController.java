package com.momento.media.api;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.momento.media.infrastructure.S3StorageService;

@RestController
public class MediaDevController {

    private final S3StorageService storageService;

    public MediaDevController(S3StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/api/dev/s3-check")
    public Map<String, Object> checkS3() {

        storageService.checkBucket();

        List<String> objects = storageService.listObjects();

        return Map.of(
                "status", "connected",
                "objects", objects
        );
    }
}