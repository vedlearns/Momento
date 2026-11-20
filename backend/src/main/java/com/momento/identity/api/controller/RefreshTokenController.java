package com.momento.identity.api.controller;

import com.momento.identity.api.request.RefreshTokenRequest;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.application.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class RefreshTokenController {
    private final RefreshTokenService refreshTokenService;
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request
    ){
        return ResponseEntity.ok(refreshTokenService.refresh(request.refreshToken()));
    }
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @Valid @RequestBody RefreshTokenRequest request
    ){
        refreshTokenService.logout(request.refreshToken());
        return ResponseEntity.noContent().build();
    }
}
