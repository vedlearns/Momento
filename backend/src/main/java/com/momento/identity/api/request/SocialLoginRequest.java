package com.momento.identity.api.request;

import com.momento.identity.domain.entity.AuthProvider;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SocialLoginRequest(

        @NotNull
        AuthProvider provider,

        @NotBlank
        String idToken,

        @NotBlank
        String nonce

) {
}