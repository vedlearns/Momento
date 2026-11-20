
package com.momento.identity.application.service;

import com.momento.identity.domain.User;
import com.momento.identity.domain.UserStatus;
import com.momento.identity.infrastructure.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        User user = userRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        if (user.getPasswordHash() == null ||
                user.getPasswordHash().isBlank()) {
            throw new UsernameNotFoundException(
                    "Email/password authentication is not available for this account"
            );
        }

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .disabled(user.getStatus() != UserStatus.ACTIVE)
                .authorities("ROLE_USER")
                .build();
    }
}
