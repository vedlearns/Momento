package com.momento.media.infrastructure;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.HeadBucketRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.S3Object;

@Service
public class S3StorageService {

	private final S3Client s3Client;
    private final String bucket;

    public S3StorageService(
            S3Client s3Client,
            @Value("${aws.s3.bucket}") String bucket) {

        this.s3Client = s3Client;
        this.bucket = bucket;
    }

    public List<String> listObjects() {

        return s3Client.listObjectsV2(
                ListObjectsV2Request.builder()
                        .bucket(bucket)
                        .build()
        ).contents()
         .stream()
         .map(S3Object::key)
         .toList();
    }

    public void checkBucket() {

        s3Client.headBucket(
                HeadBucketRequest.builder()
                        .bucket(bucket)
                        .build()
        );
    }
}
