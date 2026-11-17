package com.momento.identity.infrastructure;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.momento.identity.domain.User;

public interface UserRepository extends JpaRepository<User, UUID>{
	
	/** Hibernate generates lower(email) = lower(?), which uses the uq_users_email_lower index. */
	Optional<User> findByEmailIgnoreCase(String email);
	
	boolean existsByEmailIgnoreCase(String email);
	
}
