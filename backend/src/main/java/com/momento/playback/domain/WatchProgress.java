package com.momento.playback.domain;

import java.time.Instant;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Table(name = "watch_progress")
public class WatchProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false, updatable = false)
    private UUID userId;

    @Column(name = "media_item_id", nullable = false, updatable = false)
    private UUID mediaItemId;

    /** Last playback position in milliseconds. */
    @Column(name = "position_ms", nullable = false)
    private long positionMs;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "last_watched_at", nullable = false)
    private Instant lastWatchedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    /** Maintained by the set_updated_at() trigger. */
    @Column(name = "updated_at", insertable = false, updatable = false)
    private Instant updatedAt;

    public WatchProgress(UUID userId, UUID mediaItemId, long positionMs, boolean completed) {
        if (positionMs < 0) {
            throw new IllegalArgumentException("Playback position cannot be negative");
        }

        this.userId = userId;
        this.mediaItemId = mediaItemId;
        this.positionMs = positionMs;
        this.completed = completed;
        this.lastWatchedAt = Instant.now();
    }

}
