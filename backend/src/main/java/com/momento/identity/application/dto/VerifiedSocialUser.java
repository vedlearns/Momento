package com.momento.identity.application.dto;

import com.momento.identity.domain.entity.AuthProvider;

public record VerifiedSocialUser(
        AuthProvider provider,
        String providerSubject,
        String email,
        String name,
        boolean emailVerified
) {
}