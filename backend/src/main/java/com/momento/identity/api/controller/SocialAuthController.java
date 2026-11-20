package com.momento.identity.api.controller;

import com.momento.identity.api.request.SocialLoginRequest;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.application.service.SocialAuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class SocialAuthController {

    private final SocialAuthService socialAuthService;

    @PostMapping("/social")
    public ResponseEntity<LoginResponse> socialLogin(
            @Valid @RequestBody SocialLoginRequest request
    ) {
        return ResponseEntity.ok(
                socialAuthService.login(request)
        );
    }
}