
package com.momento.identity.application.service;

import com.momento.identity.domain.User;
import java.util.Locale;
import com.momento.identity.application.exception.EmailAlreadyExistsException;
import com.momento.identity.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(String name, String email, String password) {

        String normalizedEmail = email.trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new EmailAlreadyExistsException();
        }

        User user = new User(
                normalizedEmail,
                passwordEncoder.encode(password),
                name.trim()
        );

        return userRepository.save(user);
    }
}
