package com.momento.media.domain;

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

@Entity
@Table(name = "media_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MediaItem {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(name = "owner_id", nullable = false, updatable = false)
	private UUID ownerId;

	@Column(name = "original_filename", length = 255, nullable = false)
	private String originalFileName;

	@Column(length = 255)
	private String title;

	@Column(columnDefinition = "text")
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(name = "media_type", length = 20, nullable = false)
	private MediaType mediaType;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 20)
	private MediaStatus status = MediaStatus.PENDING_UPLOAD;

	@Column(name = "captured_at")
	private Instant capturedAt;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false, updatable = false, insertable = false)
	private Instant updatedAt;

	@Column(name = "deleted_at")
	private Instant deletedAt;

	public MediaItem(UUID ownerId, String originalFileName, MediaType mediaType) {
		    if (originalFileName == null || originalFileName.isBlank()) {
        throw new IllegalArgumentException("Original filename cannot be empty");
    }

		this.ownerId = ownerId;
		this.originalFileName = originalFileName;
		this.mediaType = mediaType;
	}

	public boolean isDeleted() {
		return deletedAt != null;
	}

	public void updateDetails(String title, String description) {
		this.title = title;
		this.description = description;
	}

    public void setCapturedAt(Instant capturedAt) { this.capturedAt = capturedAt; }

    public void markProcessing() { this.status = MediaStatus.PROCESSING; }
    public void markReady() { this.status = MediaStatus.READY; }
    public void markFailed() { this.status = MediaStatus.FAILED; }

    public void softDelete(Instant now) {
        if (this.deletedAt == null) {
            this.deletedAt = now;
        }
    }
	
}
