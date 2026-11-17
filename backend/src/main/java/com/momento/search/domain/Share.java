package com.momento.search.domain;

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
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name="shares")
public class Share {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "owner_id", nullable = false, updatable = false)
    private UUID ownerId;

    /** NULL for LINK shares. */
    @Column(name = "recipient_user_id", updatable = false)
    private UUID recipientUserId;

    @Column(name = "media_item_id", updatable = false)
    private UUID mediaItemId;

    @Column(name = "album_id", updatable = false)
    private UUID albumId;

    @Enumerated(EnumType.STRING)
    @Column(name = "share_type", nullable = false, length = 20, updatable = false)
    private ShareType shareType;

 
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SharePermission permission = SharePermission.VIEW;

    /** Lowercase hex SHA-256 of the raw token (64 chars). LINK shares only. */
    @Column(name = "token_hash", length = 64, updatable = false)
    private String tokenHash;

    /** NULL = never expires. */
    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "revoked_at")
    private Instant revokedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;


    private Share(UUID ownerId, ShareType shareType, SharePermission permission, Instant expiresAt) {
        this.ownerId = ownerId;
        this.shareType = shareType;
        this.permission = permission;
        this.expiresAt = expiresAt;
    }

    public void updatePermission(SharePermission permission) {
    if (permission == null) {
        throw new IllegalArgumentException("Permission cannot be null");
    }

    this.permission = permission;
}

public void updateExpiration(Instant expiresAt) {
    if (expiresAt != null && !expiresAt.isAfter(Instant.now())) {
        throw new IllegalArgumentException("Expiration must be in the future");
    }

    this.expiresAt = expiresAt;
}

    /** Share a media item or album (exactly one of the two ids non-null) with a registered user. */
    public static Share forUser(UUID ownerId, UUID recipientUserId, UUID mediaItemId, UUID albumId,
                                SharePermission permission, Instant expiresAt) {
        Share s = new Share(ownerId, ShareType.USER, permission, expiresAt);
        s.recipientUserId = recipientUserId;
        s.mediaItemId = mediaItemId;
        s.albumId = albumId;
        return s;
    }

    /** Create a private link share. Pass the hash of the token, never the token itself. */
    public static Share forLink(UUID ownerId, UUID mediaItemId, UUID albumId,
                                SharePermission permission, String tokenHash, Instant expiresAt) {
        Share s = new Share(ownerId, ShareType.LINK, permission, expiresAt);
        s.mediaItemId = mediaItemId;
        s.albumId = albumId;
        s.tokenHash = tokenHash;
        return s;
    }

    public void revoke(Instant now) {
        if (this.revokedAt == null) {
            this.revokedAt = now;
        }
    }

    public boolean isActive(Instant now) {
        return revokedAt == null && (expiresAt == null || expiresAt.isAfter(now));
    }

    public boolean allowsDownload() {
        return permission == SharePermission.DOWNLOAD;
    }
	
}
