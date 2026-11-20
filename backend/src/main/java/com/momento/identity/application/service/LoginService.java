
package com.momento.identity.application.service;

import com.momento.common.security.JwtService;
import com.momento.identity.api.request.LoginRequest;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.domain.User;
import com.momento.identity.infrastructure.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    @Transactional
    public LoginResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmailIgnoreCase(request.email().trim())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        String accessToken = jwtService.generateToken(user.getEmail());

        String refreshToken =
                refreshTokenService.createRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(expirationMs / 1000)
                .build();
    }
}
