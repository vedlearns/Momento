package com.momento.identity.application.service;

import com.momento.identity.application.exception.EmailAlreadyExistsException;
import com.momento.identity.domain.User;
import com.momento.identity.infrastructure.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {
    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @InjectMocks private RegistrationService registrationService;

    @Test
    void registrationNormalizesEmailAndStoresOnlyEncodedPassword() {
        when(userRepository.existsByEmailIgnoreCase("person@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret-pass")).thenReturn("bcrypt-hash");
        when(userRepository.save(any(User.class))).thenAnswer(call -> call.getArgument(0));

        User result = registrationService.register("  Person  ", " Person@Example.com ", "secret-pass");

        assertEquals("person@example.com", result.getEmail());
        assertEquals("Person", result.getDisplayName());
        assertEquals("bcrypt-hash", result.getPasswordHash());
        verify(passwordEncoder).encode("secret-pass");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void duplicateEmailIsRejectedBeforePasswordEncoding() {
        when(userRepository.existsByEmailIgnoreCase("person@example.com")).thenReturn(true);

        assertThrows(EmailAlreadyExistsException.class,
                () -> registrationService.register("Person", "Person@example.com", "secret-pass"));

        verifyNoInteractions(passwordEncoder);
        verify(userRepository, never()).save(any(User.class));
    }
}