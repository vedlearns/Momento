
package com.momento.identity.application.service;

import com.momento.common.security.JwtService;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.domain.entity.RefreshToken;
import com.momento.identity.domain.User;
import com.momento.identity.domain.UserStatus;
import com.momento.identity.domain.repository.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    @Value("${app.jwt.expiration-ms}")
    private long accessExpirationMs;

    @Transactional
    public String createRefreshToken(User user) {

        String rawToken = generateSecureToken();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hashToken(rawToken));
        refreshToken.setExpiresAt(
                LocalDateTime.now().plusNanos(
                        refreshExpirationMs * 1_000_000
                )
        );
        refreshToken.setRevoked(false);

        refreshTokenRepository.save(refreshToken);

        return rawToken;
    }

    @Transactional
    public LoginResponse refresh(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new BadCredentialsException("Refresh token is required");
        }

        String tokenHash = hashToken(rawToken);

        RefreshToken oldToken = refreshTokenRepository
                .findByTokenHashForUpdate(tokenHash)
                .orElseThrow(() ->
                        new BadCredentialsException("Invalid refresh token"));

        if (oldToken.isRevoked()) {
            throw new BadCredentialsException("Refresh token has been revoked");
        }

        if (!oldToken.getExpiresAt().isAfter(LocalDateTime.now())) {
            oldToken.setRevoked(true);
            refreshTokenRepository.save(oldToken);

            throw new BadCredentialsException("Refresh token has expired");
        }

        User user = oldToken.getUser();

        if (user.getStatus() != UserStatus.ACTIVE) {
            oldToken.setRevoked(true);
            refreshTokenRepository.save(oldToken);

            throw new BadCredentialsException("User account is disabled");
        }

        // Rotate: invalidate the old refresh token.
        oldToken.setRevoked(true);
        refreshTokenRepository.save(oldToken);

        // Generate a new refresh token.
        String newRefreshToken = createRefreshToken(user);

        // Generate a new access token.
        String newAccessToken = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(accessExpirationMs / 1000)
                .build();
    }

    @Transactional
    public void logout(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new BadCredentialsException(
                    "Refresh token is required"
            );
        }

        RefreshToken token = refreshTokenRepository
                .findByTokenHashForUpdate(hashToken(rawToken))
                .orElseThrow(() ->
                        new BadCredentialsException(
                                "Invalid refresh token"
                        )
                );

        if (token.isRevoked()) {
            throw new BadCredentialsException(
                    "Refresh token already revoked"
            );
        }

        token.setRevoked(true);

        refreshTokenRepository.save(token);
    }

    private String generateSecureToken() {

        byte[] randomBytes = new byte[64];
        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomBytes);
    }

    private String hashToken(String token) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to hash refresh token", exception
            );
        }
    }

}
