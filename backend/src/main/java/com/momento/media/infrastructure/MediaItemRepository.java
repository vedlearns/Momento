package com.momento.media.infrastructure;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.momento.media.domain.MediaItem;

public interface MediaItemRepository extends JpaRepository<MediaItem, UUID> {

	/**
	 * Finds media by ID only if it belongs to the given user
	 * and has not been deleted.
	 *
	 * Returns Optional.empty() if media doesn't exist,
	 * belongs to another user, or is deleted.
	 *
	 * This prevents unauthorized access to other users' media.
	 */
	Optional<MediaItem> findByIdAndOwnerIdAndDeletedAtIsNull(UUID id, UUID ownerId);
	
	/**
	 * Fetches the user's READY and non-deleted media for the timeline.
	 *
	 * Sorting:
	 * - COALESCE(capturedAt, createdAt) uses capturedAt if available,
	 *   otherwise createdAt.
	 * - DESC means newest media appears first.
	 * - id DESC ensures consistent ordering when dates are equal.
	 *
	 * IMPORTANT:
	 * Keep the ORDER BY exactly as written to use the
	 * idx_media_items_owner_timeline database index.
	 *
	 * Pageable:
	 * It tells Spring Data which page to fetch and how many records to fetch.
	 * Pass an unsorted Pageable (PageRequest.of(page, size)).
	 *
	 * Slice:
	 * Fetches media in chunks and tells us if more records exist
	 * without executing an additional COUNT query.
	 * Ideal for infinite scrolling.
	 */
	@Query("""
            select m from MediaItem m
            where m.ownerId = :ownerId
              and m.deletedAt is null
              and m.status = com.momento.media.domain.MediaStatus.READY
            order by coalesce(m.capturedAt, m.createdAt) desc, m.id desc
            """)
	Slice<MediaItem> findTimeline(@Param("ownerId") UUID ownerId, Pageable pageable);
	
}
