
package com.momento.identity.application.service;

import com.momento.common.security.JwtService;
import com.momento.identity.api.request.SocialLoginRequest;
import com.momento.identity.api.response.LoginResponse;
import com.momento.identity.application.dto.VerifiedSocialUser;
import com.momento.identity.application.security.SocialTokenVerifier;
import com.momento.identity.application.service.RefreshTokenService;
import com.momento.identity.domain.entity.AuthProvider;
import com.momento.identity.domain.entity.SocialAccount;
import com.momento.identity.domain.User;
import com.momento.identity.domain.repository.SocialAccountRepository;
import com.momento.identity.infrastructure.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SocialAuthServiceTest {

    @Mock
    private SocialTokenVerifier socialTokenVerifier;

    @Mock
    private SocialAccountRepository socialAccountRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private SocialAuthService socialAuthService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(
                socialAuthService,
                "expirationMs",
                360000L
        );
    }

    // 1. New social user registration

    @Test
    void shouldCreateNewUserWhenSocialAccountDoesNotExist() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                "test@example.com",
                "Test User",
                true
        );

        mockTokenVerification(verifiedUser);

        when(socialAccountRepository.findByProviderAndProviderSubject(
                AuthProvider.GOOGLE,
                "google-user-123"
        )).thenReturn(Optional.empty());

        when(userRepository.existsByEmailIgnoreCase("test@example.com"))
                .thenReturn(false);

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(jwtService.generateToken("test@example.com"))
                .thenReturn("momento-access-token");
        when(refreshTokenService.createRefreshToken(any(User.class)))
                .thenReturn("momento-refresh-token");

        LoginResponse response = socialAuthService.login(request);

        assertNotNull(response);
        assertEquals("momento-access-token", response.getAccessToken());
        assertEquals("momento-refresh-token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());
        assertEquals(360L, response.getExpiresIn());

        verify(userRepository).save(any(User.class));
        verify(socialAccountRepository).save(any(SocialAccount.class));
        verify(jwtService).generateToken("test@example.com");
        verify(refreshTokenService).createRefreshToken(any(User.class));
    }

    // 2. Existing social user login

    @Test
    void shouldLoginExistingSocialUser() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                "test@example.com",
                "Test User",
                true
        );

        User existingUser = createExistingUser(true);

        SocialAccount existingAccount = new SocialAccount();
        existingAccount.setUser(existingUser);

        mockTokenVerification(verifiedUser);

        when(socialAccountRepository.findByProviderAndProviderSubject(
                AuthProvider.GOOGLE,
                "google-user-123"
        )).thenReturn(Optional.of(existingAccount));

        when(jwtService.generateToken("test@example.com"))
                .thenReturn("existing-user-jwt");
        when(refreshTokenService.createRefreshToken(any(User.class)))
                .thenReturn("existing-user-refresh-token");

        LoginResponse response = socialAuthService.login(request);

        assertNotNull(response);
        assertEquals("existing-user-jwt", response.getAccessToken());
        assertEquals("existing-user-refresh-token", response.getRefreshToken());
        assertEquals("Bearer", response.getTokenType());

        verify(userRepository, never()).save(any(User.class));
        verify(socialAccountRepository, never()).save(any(SocialAccount.class));
        verify(jwtService).generateToken("test@example.com");
        verify(refreshTokenService).createRefreshToken(any(User.class));
    }

    // 3. Reject unverified email

    @Test
    void shouldRejectSocialLoginWhenEmailIsNotVerified() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                "test@example.com",
                "Test User",
                false
        );

        mockTokenVerification(verifiedUser);

        assertThrows(
                BadCredentialsException.class,
                () -> socialAuthService.login(request)
        );

        verifyNoInteractions(userRepository);
        verifyNoInteractions(socialAccountRepository);
        verifyNoInteractions(jwtService);
    }

    // 4. Reject blank email

    @Test
    void shouldRejectSocialLoginWhenEmailIsBlank() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                " ",
                "Test User",
                true
        );

        mockTokenVerification(verifiedUser);

        assertThrows(
                BadCredentialsException.class,
                () -> socialAuthService.login(request)
        );

        verifyNoInteractions(userRepository);
        verifyNoInteractions(socialAccountRepository);
        verifyNoInteractions(jwtService);
    }

    // 5. Reject existing email conflict

    @Test
    void shouldRejectWhenEmailAlreadyExists() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                "test@example.com",
                "Test User",
                true
        );

        mockTokenVerification(verifiedUser);

        when(socialAccountRepository.findByProviderAndProviderSubject(
                AuthProvider.GOOGLE,
                "google-user-123"
        )).thenReturn(Optional.empty());

        when(userRepository.existsByEmailIgnoreCase("test@example.com"))
                .thenReturn(true);

        assertThrows(
                BadCredentialsException.class,
                () -> socialAuthService.login(request)
        );

        verify(userRepository, never()).save(any(User.class));
        verify(socialAccountRepository, never()).save(any(SocialAccount.class));
        verifyNoInteractions(jwtService);
    }

    // 6. Reject disabled user

    @Test
    void shouldRejectLoginWhenExistingUserIsDisabled() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                "test@example.com",
                "Test User",
                true
        );

        User disabledUser = createExistingUser(false);

        SocialAccount existingAccount = new SocialAccount();
        existingAccount.setUser(disabledUser);

        mockTokenVerification(verifiedUser);

        when(socialAccountRepository.findByProviderAndProviderSubject(
                AuthProvider.GOOGLE,
                "google-user-123"
        )).thenReturn(Optional.of(existingAccount));

        assertThrows(
                BadCredentialsException.class,
                () -> socialAuthService.login(request)
        );

        verify(userRepository, never()).save(any(User.class));
        verify(socialAccountRepository, never()).save(any(SocialAccount.class));
        verifyNoInteractions(jwtService);
    }

    // 7. Fallback name from email

    @Test
    void shouldUseEmailPrefixWhenSocialNameIsMissing() {

        SocialLoginRequest request = createRequest();

        VerifiedSocialUser verifiedUser = createVerifiedUser(
                "shaurya@example.com",
                null,
                true
        );

        mockTokenVerification(verifiedUser);

        when(socialAccountRepository.findByProviderAndProviderSubject(
                AuthProvider.GOOGLE,
                "google-user-123"
        )).thenReturn(Optional.empty());

        when(userRepository.existsByEmailIgnoreCase("shaurya@example.com"))
                .thenReturn(false);

        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        when(jwtService.generateToken("shaurya@example.com"))
                .thenReturn("fallback-name-jwt");

        LoginResponse response = socialAuthService.login(request);

        ArgumentCaptor<User> userCaptor =
                ArgumentCaptor.forClass(User.class);

        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();

        assertEquals("shaurya", savedUser.getDisplayName());
        assertEquals("shaurya@example.com", savedUser.getEmail());

        assertNotNull(response);
        assertEquals("fallback-name-jwt", response.getAccessToken());

        verify(socialAccountRepository).save(any(SocialAccount.class));
    }

    // Helper methods

    private SocialLoginRequest createRequest() {
        return new SocialLoginRequest(
                AuthProvider.GOOGLE,
                "test-id-token",
                "test-nonce"
        );
    }

    private VerifiedSocialUser createVerifiedUser(
            String email,
            String name,
            boolean emailVerified
    ) {
        return new VerifiedSocialUser(
                AuthProvider.GOOGLE,
                "google-user-123",
                email,
                name,
                emailVerified
        );
    }

    private User createExistingUser(boolean enabled) {
        User user = new User("test@example.com", "password-hash", "Test User");
        if (!enabled) {
            user.suspend();
        }
        return user;
    }

    private void mockTokenVerification(
            VerifiedSocialUser verifiedUser
    ) {
        when(socialTokenVerifier.verify(
                AuthProvider.GOOGLE,
                "test-id-token",
                "test-nonce"
        )).thenReturn(verifiedUser);
    }
}
