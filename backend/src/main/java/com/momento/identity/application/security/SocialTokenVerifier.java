package com.momento.identity.application.security;

import com.momento.identity.application.dto.VerifiedSocialUser;
import com.momento.identity.domain.entity.AuthProvider;

public interface SocialTokenVerifier {

    VerifiedSocialUser verify(
            AuthProvider provider,
            String idToken,
            String expectedNonce
    );
}