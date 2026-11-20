package com.momento.identity.application.service;

import com.momento.common.security.JwtService;
import com.momento.identity.api.request.LoginRequest;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.domain.User;
import com.momento.identity.infrastructure.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LoginServiceTest {
    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtService jwtService;
    @Mock private UserRepository userRepository;
    @Mock private RefreshTokenService refreshTokenService;
    @InjectMocks private LoginService loginService;

    @BeforeEach
    void setExpiration() {
        ReflectionTestUtils.setField(loginService, "expirationMs", 360_000L);
    }

    @Test
    void validCredentialsReturnAccessAndRefreshTokens() {
        User user = new User("person@example.com", "bcrypt-hash", "Person");
        when(userRepository.findByEmailIgnoreCase("Person@Example.com"))
                .thenReturn(Optional.of(user));
        when(jwtService.generateToken("person@example.com")).thenReturn("access-token");
        when(refreshTokenService.createRefreshToken(user)).thenReturn("refresh-token");

        LoginResponse result = loginService.login(
                new LoginRequest("Person@Example.com", "secret-pass"));

        assertEquals("access-token", result.getAccessToken());
        assertEquals("refresh-token", result.getRefreshToken());
        assertEquals(360L, result.getExpiresIn());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void invalidCredentialsDoNotIssueTokens() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("invalid"));

        assertThrows(BadCredentialsException.class,
                () -> loginService.login(new LoginRequest("person@example.com", "wrong")));

        verifyNoInteractions(jwtService, userRepository, refreshTokenService);
    }
}