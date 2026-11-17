package com.momento.identity.domain;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "id", columnDefinition = "uuid")
	private UUID id;

	// @Column(unique = true) , we dont have to apply this , cuz we have applied a
	// constraint for this in DB migration
	@Column(name = "email", length = 320, nullable = false)
	private String email;

	@Setter
	@Column(name = "password_hash", length = 255, nullable = true)
	private String passwordHash;

	@Setter
	@Column(name = "display_name", length = 100, nullable = false)
	private String displayName;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private UserStatus status = UserStatus.ACTIVE;

	// Instant stores an exact moment in UTC;
	//	@CreationTimestamp assign the Timestamp to the entity on the moment when it is created.
	// updatable=false prevents changes during subsequent updates.
	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	/** Maintained by the set_updated_at() trigger, so Hibernate never writes it. */
	// `insertable = false` tells Hibernate not to include this column in SQL INSERT
	// statements, allowing the database to set its value automatically.
	// Because the database trigger `set_updated_at()` is responsible for managing
	// `updated_at`, so Hibernate should not insert its own value and interfere with
	// database management.
	@Column(name = "updated_at", insertable = false ,updatable = false)
	private Instant updatedAt;

	// Parameterized Constructor for creating a new user
	public User(String email, String passwordHash, String displayName) {
		this.email = email;
		this.passwordHash = passwordHash;
		this.displayName = displayName;
	}
	
	
	// Business Logic
	
	public void suspend()
	{
		this.status=UserStatus.SUSPENDED;
	}
	
	public void activate()
	{
		this.status=UserStatus.ACTIVE;
	}
}
