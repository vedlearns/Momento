
package com.momento.identity.application.security;

import com.momento.identity.application.dto.VerifiedSocialUser;
import com.momento.identity.domain.entity.AuthProvider;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@Component
public class SocialTokenVerifierImpl implements SocialTokenVerifier {

    private final JwtDecoder googleDecoder;
    private final JwtDecoder appleDecoder;

    private final List<String> googleClientIds;
    private final List<String> appleClientIds;

    public SocialTokenVerifierImpl(
            @Value("${app.social.google.client-ids}")
            List<String> googleClientIds,

            @Value("${app.social.apple.client-ids}")
            List<String> appleClientIds
    ) {

        this.googleClientIds = clean(googleClientIds);
        this.appleClientIds = clean(appleClientIds);

        this.googleDecoder = createDecoder(
                "https://www.googleapis.com/oauth2/v3/certs",
                "https://accounts.google.com",
                this.googleClientIds
        );

        this.appleDecoder = createDecoder(
                "https://appleid.apple.com/auth/keys",
                "https://appleid.apple.com",
                this.appleClientIds
        );
    }

    @Override
    public VerifiedSocialUser verify(
            AuthProvider provider,
            String idToken,
            String expectedNonce
    ) {

        JwtDecoder decoder;
        List<String> allowedClientIds;

        if (provider == AuthProvider.GOOGLE) {

            decoder = googleDecoder;
            allowedClientIds = googleClientIds;

        } else if (provider == AuthProvider.APPLE) {

            decoder = appleDecoder;
            allowedClientIds = appleClientIds;

        } else {

            throw new IllegalArgumentException(
                    "Unsupported social provider"
            );
        }

        if (idToken == null || idToken.isBlank()) {
            throw new JwtException("ID token is missing");
        }

        if (expectedNonce == null || expectedNonce.isBlank()) {
            throw new JwtException("Nonce is missing");
        }

        if (allowedClientIds.isEmpty()) {
            throw new IllegalStateException(
                    "Social login client IDs are not configured"
            );
        }

        // 1. Verify token signature, issuer, audience and expiration.
        Jwt jwt = decoder.decode(idToken);

        // 2. Verify nonce according to provider.
        String tokenNonce = jwt.getClaimAsString("nonce");

        if (!isValidNonce(provider, tokenNonce, expectedNonce)) {
            throw new JwtException("Invalid social login nonce");
        }

        // 3. Extract provider identity.
        String subject = jwt.getSubject();

        String email = jwt.getClaimAsString("email");

        String name = jwt.getClaimAsString("name");

        Object emailVerifiedClaim =
                jwt.getClaims().get("email_verified");

        boolean emailVerified =
                Boolean.TRUE.equals(emailVerifiedClaim)
                        || "true".equalsIgnoreCase(
                        String.valueOf(emailVerifiedClaim)
                );

        if (subject == null || subject.isBlank()) {
            throw new JwtException(
                    "Provider subject is missing"
            );
        }

        if (email == null || email.isBlank()) {
            throw new JwtException(
                    "Provider email is missing"
            );
        }

        // 4. Return verified identity.
        return new VerifiedSocialUser(
                provider,
                subject,
                email,
                name,
                emailVerified
        );
    }

    private boolean isValidNonce(
            AuthProvider provider,
            String tokenNonce,
            String expectedNonce
    ) {

        if (tokenNonce == null || tokenNonce.isBlank()) {
            return false;
        }

        String nonceToCompare;

        if (provider == AuthProvider.GOOGLE) {

            // Google: compare the nonce claim with the original nonce.
            nonceToCompare = expectedNonce;

        } else {

            // Apple: compare the token nonce with SHA-256 of raw nonce.
            nonceToCompare = sha256(expectedNonce);
        }

        return MessageDigest.isEqual(
                tokenNonce.getBytes(StandardCharsets.UTF_8),
                nonceToCompare.getBytes(StandardCharsets.UTF_8)
        );
    }

    private String sha256(String value) {

        try {

            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    value.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {

            throw new IllegalStateException(
                    "SHA-256 algorithm is not available",
                    exception
            );
        }
    }

    private JwtDecoder createDecoder(
            String jwkSetUri,
            String issuer,
            List<String> clientIds
    ) {

        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withJwkSetUri(jwkSetUri)
                .build();

        // Issuer + timestamp validation.
        OAuth2TokenValidator<Jwt> issuerAndTimeValidator =
                JwtValidators.createDefaultWithIssuer(issuer);

        // Audience validation.
        OAuth2TokenValidator<Jwt> audienceValidator = jwt -> {

            boolean validAudience = jwt.getAudience()
                    .stream()
                    .anyMatch(clientIds::contains);

            if (validAudience) {
                return OAuth2TokenValidatorResult.success();
            }

            return OAuth2TokenValidatorResult.failure(
                    new OAuth2Error(
                            "invalid_token",
                            "Invalid token audience",
                            null
                    )
            );
        };

        // Apply both validators.
        decoder.setJwtValidator(
                new DelegatingOAuth2TokenValidator<>(
                        issuerAndTimeValidator,
                        audienceValidator
                )
        );

        return decoder;
    }

    private List<String> clean(List<String> clientIds) {

        return clientIds.stream()
                .filter(id -> id != null && !id.isBlank())
                .map(String::trim)
                .toList();
    }
}
