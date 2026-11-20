package com.momento.identity.application.service;

import com.momento.common.security.JwtService;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.domain.User;
import com.momento.identity.domain.entity.RefreshToken;
import com.momento.identity.domain.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {
    @Mock private RefreshTokenRepository refreshTokenRepository;
    @Mock private JwtService jwtService;
    @InjectMocks private RefreshTokenService refreshTokenService;

    @BeforeEach
    void configureExpirations() {
        ReflectionTestUtils.setField(refreshTokenService, "refreshExpirationMs", 86_400_000L);
        ReflectionTestUtils.setField(refreshTokenService, "accessExpirationMs", 360_000L);
    }

    @Test
    void refreshTokenIsRandomAndOnlyItsHashIsStored() {
        User user = new User("person@example.com", "hash", "Person");
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(call -> call.getArgument(0));

        String rawToken = refreshTokenService.createRefreshToken(user);

        ArgumentCaptor<RefreshToken> saved = ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(saved.capture());
        assertNotEquals(rawToken, saved.getValue().getTokenHash());
        assertEquals(64, saved.getValue().getTokenHash().length());
        assertEquals(user, saved.getValue().getUser());
        assertTrue(saved.getValue().getExpiresAt().isAfter(LocalDateTime.now()));
    }

    @Test
    void refreshRotatesTokenAndReturnsNewAccessToken() {
        User user = new User("person@example.com", "hash", "Person");
        RefreshToken old = activeToken(user);
        when(refreshTokenRepository.findByTokenHashForUpdate(anyString()))
                .thenReturn(Optional.of(old));
        when(refreshTokenRepository.save(any(RefreshToken.class)))
                .thenAnswer(call -> call.getArgument(0));
        when(jwtService.generateToken(user.getEmail())).thenReturn("new-access-token");

        LoginResponse result = refreshTokenService.refresh("old-refresh-token");

        assertTrue(old.isRevoked());
        assertEquals("new-access-token", result.getAccessToken());
        assertNotNull(result.getRefreshToken());
        assertNotEquals("old-refresh-token", result.getRefreshToken());
        assertEquals(360L, result.getExpiresIn());
        verify(refreshTokenRepository, times(2)).save(any(RefreshToken.class));
    }

    @Test
    void revokedRefreshTokenIsRejected() {
        User user = new User("person@example.com", "hash", "Person");
        RefreshToken revoked = activeToken(user);
        revoked.setRevoked(true);
        when(refreshTokenRepository.findByTokenHashForUpdate(anyString()))
                .thenReturn(Optional.of(revoked));

        assertThrows(BadCredentialsException.class,
                () -> refreshTokenService.refresh("revoked-token"));
        verify(refreshTokenRepository, never()).save(any(RefreshToken.class));
    }

    private RefreshToken activeToken(User user) {
        RefreshToken token = new RefreshToken();
        token.setUser(user);
        token.setTokenHash("stored-hash");
        token.setExpiresAt(LocalDateTime.now().plusDays(1));
        return token;
    }
}