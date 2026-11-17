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
import lombok.Setter;

@Entity
@Table(name = "media_assets")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class MediaAsset {

	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	private UUID id;

	@Column(name = "media_item_id", nullable = false, updatable = false)
	private UUID mediaItemId;

	@Enumerated(EnumType.STRING)
	@Column(name = "asset_type", nullable = false, length = 30)
	private AssetType assetType;

	@Enumerated(EnumType.STRING)
	@Column(name = "storage_provider", nullable = false, length = 20)
	private StorageProvider storageProvider = StorageProvider.AWS_S3;

	@Column(name = "bucket_name", nullable = false, length = 255)
	private String bucketName;

	/** e.g. users/{userId}/media/{mediaId}/original.jpg */
	@Column(name = "object_key", nullable = false, length = 1024)
	private String objectKey;

	@Column(name = "mime_type", nullable = false, length = 150)
	private String mimeType;
	
	@Setter
	@Column(name = "file_size_bytes", nullable = false)
	private Long fileSizeBytes;

	@Column(name = "width_px")
	private Integer widthPx;

	@Column(name = "height_px")
	private Integer heightPx;

	@Setter
	@Column(name = "duration_ms")
	private Long durationMs;

	/** SHA-256 as 64 hex characters, optional. */
	@Setter
	@Column(name = "checksum_sha256", length = 64)
	private String checksumSha256;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	public MediaAsset(UUID mediaItemId, AssetType assetType, String bucketName, String objectKey, String mimeType,
			long fileSizeBytes) {
		this.mediaItemId = mediaItemId;
		this.assetType = assetType;
		this.bucketName = bucketName;
		this.objectKey = objectKey;
		this.mimeType = mimeType;
		this.fileSizeBytes = fileSizeBytes;
	}
	
	  public void setDimensions(Integer widthPx, Integer heightPx) {
		    if (widthPx != null && widthPx <= 0) {
        throw new IllegalArgumentException("Width must be positive");
    }

    if (heightPx != null && heightPx <= 0) {
        throw new IllegalArgumentException("Height must be positive");
    }
	        this.widthPx = widthPx;
	        this.heightPx = heightPx;
	    }

	public void updateFileSize(long fileSizeBytes) {
    if (fileSizeBytes < 0) {
        throw new IllegalArgumentException("File size cannot be negative");
    }
    this.fileSizeBytes = fileSizeBytes;
}

}
