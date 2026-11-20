package com.momento.identity.application.service;

import com.momento.common.security.JwtService;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.application.dto.VerifiedSocialUser;
import com.momento.identity.application.security.SocialTokenVerifier;
import com.momento.identity.domain.entity.SocialAccount;
import com.momento.identity.domain.User;
import com.momento.identity.domain.UserStatus;
import com.momento.identity.domain.repository.SocialAccountRepository;
import com.momento.identity.infrastructure.UserRepository;
import com.momento.identity.api.request.SocialLoginRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SocialAuthService {

    private final SocialTokenVerifier socialTokenVerifier;
    private final SocialAccountRepository socialAccountRepository;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    @Transactional
    public LoginResponse login(SocialLoginRequest request) {

        VerifiedSocialUser socialUser = socialTokenVerifier.verify(
                request.provider(),
                request.idToken(),
                request.nonce()
        );

        String normalizedEmail = socialUser.email() == null ? null : socialUser.email().trim().toLowerCase(Locale.ROOT);

        if (!socialUser.emailVerified()
                || socialUser.email() == null
                || socialUser.email().isBlank()) {
            throw new BadCredentialsException(
                    "A verified email is required for social login"
            );
        }

        SocialAccount socialAccount = socialAccountRepository
                .findByProviderAndProviderSubject(
                        socialUser.provider(),
                        socialUser.providerSubject()
                )
                .orElse(null);

        User user;

        if (socialAccount != null) {
            user = socialAccount.getUser();

            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new BadCredentialsException("Account is disabled");
            }

        } else {

            if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
                throw new BadCredentialsException(
                        "An account with this email already exists. "
                                + "Please sign in using your existing method "
                                + "and link your social account securely."
                );
            }

            user = new User(normalizedEmail, null, resolveName(socialUser));

            user = userRepository.save(user);

            SocialAccount newSocialAccount = new SocialAccount();
            newSocialAccount.setUser(user);
            newSocialAccount.setProvider(socialUser.provider());
            newSocialAccount.setProviderSubject(
                    socialUser.providerSubject()
            );
            newSocialAccount.setEmail(normalizedEmail);

            socialAccountRepository.save(newSocialAccount);
        }

        String token = jwtService.generateToken(user.getEmail());
        String refreshToken = refreshTokenService.createRefreshToken(user);

        return LoginResponse.builder()
                .accessToken(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(expirationMs / 1000)
                .build();
    }

    private String resolveName(VerifiedSocialUser socialUser) {
        if (socialUser.name() != null && !socialUser.name().isBlank()) {
            return socialUser.name().trim();
        }

        return socialUser.email().split("@")[0];
    }
}