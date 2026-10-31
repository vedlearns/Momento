package com.momento.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

//Code	Purpose
//@Configuration	Tells Spring this class defines application configuration.
//@Bean	Registers the returned object in Spring's application context.
//S3Client	Performs operations such as listing, reading, and uploading S3 objects.
//S3Presigner	Generates temporary signed URLs for controlled file access.
//@Value("${aws.region}")	Reads the AWS region from application.yml.

@Configuration
public class S3Config {

    @Bean
    S3Client s3Client(
            @Value("${aws.region}") String region) {

        return S3Client.builder()
                .region(Region.of(region))
                .build();
    }
    
    @Bean
     S3Presigner s3Presigner(
            @Value("${aws.region}") String region) {

        return S3Presigner.builder()
                .region(Region.of(region))
                .build();
    }
}


