package com.momento.identity.domain.repository;

import com.momento.identity.domain.entity.AuthProvider;
import com.momento.identity.domain.entity.SocialAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SocialAccountRepository
extends JpaRepository<SocialAccount, UUID> {
    Optional<SocialAccount> findByProviderAndProviderSubject(
            AuthProvider provider,
            String providerSubject
    );//google/apple account ko provider or uski unique id se identify krega

    boolean existsByProviderAndProviderSubject(AuthProvider provider,
                                               String providerSubject);
    //pehle se register YES/NO
}
