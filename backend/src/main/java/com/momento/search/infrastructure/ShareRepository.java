package com.momento.search.infrastructure;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.momento.search.domain.Share;

public interface ShareRepository extends JpaRepository<Share, UUID> {

    /** Validate a private link: hash the raw token with SHA-256 (lowercase hex), then call this. */
    @Query("""
            select s from Share s
            where s.tokenHash = :tokenHash
              and s.revokedAt is null
              and (s.expiresAt is null or s.expiresAt > :now)
            """)
    Optional<Share> findActiveByTokenHash(@Param("tokenHash") String tokenHash, @Param("now") Instant now);

    /** "Shared with me" list. */
    @Query("""
            select s from Share s
            where s.recipientUserId = :userId
              and s.revokedAt is null
              and (s.expiresAt is null or s.expiresAt > :now)
            order by s.createdAt desc
            """)
    Slice<Share> findActiveSharedWithUser(@Param("userId") UUID userId, @Param("now") Instant now, Pageable pageable);

    /** Shares the owner has created and not revoked (the "manage sharing" screen). */
    List<Share> findByOwnerIdAndRevokedAtIsNullOrderByCreatedAtDesc(UUID ownerId);

    /** Existing active shares of one target (for the owner's sharing dialog). */
    List<Share> findByOwnerIdAndMediaItemIdAndRevokedAtIsNull(UUID ownerId, UUID mediaItemId);

    List<Share> findByOwnerIdAndAlbumIdAndRevokedAtIsNull(UUID ownerId, UUID albumId);

    /**
     * Can this registered user access this media item through a share? True when the
     * item itself is shared with them, or any album containing it is shared with them.
     * The caller must still check that the media item is not soft-deleted.
     *
     * Open question: should sharing an album also cover its nested child albums?
     * This query says no. Decide, and extend it if the answer is yes.
     */
    @Query("""
            select count(s) > 0 from Share s
            where s.recipientUserId = :userId
              and s.revokedAt is null
              and (s.expiresAt is null or s.expiresAt > :now)
              and (
                    s.mediaItemId = :mediaItemId
                    or s.albumId in (
                        select am.id.albumId from AlbumMedia am
                        where am.id.mediaItemId = :mediaItemId
                    )
              )
            """)
    boolean hasActiveAccessToMedia(@Param("userId") UUID userId,
                                   @Param("mediaItemId") UUID mediaItemId,
                                   @Param("now") Instant now);
}