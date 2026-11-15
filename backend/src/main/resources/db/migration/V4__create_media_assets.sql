-- =========================================================
-- V4: Create media_assets table
--
-- Physical files stored in AWS S3 for a media item: the original,
-- a thumbnail, a poster frame and (for video) HLS playlists/segments.
-- PostgreSQL stores only the bucket and object key.
-- =========================================================

CREATE TABLE media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    media_item_id UUID NOT NULL,

    -- ORIGINAL, THUMBNAIL, POSTER, HLS_MASTER_PLAYLIST,
    -- HLS_MEDIA_PLAYLIST, HLS_SEGMENT.
    asset_type VARCHAR(30) NOT NULL,

    storage_provider VARCHAR(20) NOT NULL DEFAULT 'AWS_S3',
    bucket_name VARCHAR(255) NOT NULL,

    -- Path of the file inside the bucket,
    -- e.g. users/<user-id>/media/<media-id>/original.jpg
    object_key VARCHAR(1024) NOT NULL,

    -- e.g. image/jpeg, video/mp4, application/vnd.apple.mpegurl
    mime_type VARCHAR(150) NOT NULL,

    file_size_bytes BIGINT NOT NULL,

    -- Only when applicable (images / videos).
    width_px INTEGER,
    height_px INTEGER,
    duration_ms BIGINT,

    -- Optional SHA-256 of the file, as 64 hex characters.
    checksum_sha256 VARCHAR(64),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_media_assets_media_item
        FOREIGN KEY (media_item_id) REFERENCES media_items(id),

    CONSTRAINT chk_media_assets_type
        CHECK (asset_type IN (
            'ORIGINAL', 'THUMBNAIL', 'POSTER',
            'HLS_MASTER_PLAYLIST', 'HLS_MEDIA_PLAYLIST', 'HLS_SEGMENT'
        )),

    CONSTRAINT chk_media_assets_provider
        CHECK (storage_provider IN ('AWS_S3')),

    -- Two rows can never point at the same S3 object.
    CONSTRAINT uq_media_assets_storage_object
        UNIQUE (storage_provider, bucket_name, object_key),

    CONSTRAINT chk_media_assets_file_size
        CHECK (file_size_bytes >= 0),

    CONSTRAINT chk_media_assets_width
        CHECK (width_px IS NULL OR width_px > 0),

    CONSTRAINT chk_media_assets_height
        CHECK (height_px IS NULL OR height_px > 0),

    CONSTRAINT chk_media_assets_duration
        CHECK (duration_ms IS NULL OR duration_ms >= 0),

    CONSTRAINT chk_media_assets_checksum
        CHECK (checksum_sha256 IS NULL OR checksum_sha256 ~ '^[0-9a-fA-F]{64}$')
);

CREATE INDEX idx_media_assets_media_item_id
    ON media_assets(media_item_id);

CREATE INDEX idx_media_assets_item_type
    ON media_assets(media_item_id, asset_type);

-- At most one ORIGINAL, THUMBNAIL, POSTER and HLS master playlist per
-- media item. HLS media playlists and segments legitimately repeat.
-- (For several thumbnail sizes, add a variant column and include it here.)
-- This creates a partial unique index to prevent duplicate asset types for the same media item.
CREATE UNIQUE INDEX uq_media_assets_singleton_type
    ON media_assets(media_item_id, asset_type)
    WHERE asset_type IN (
        'ORIGINAL', 'THUMBNAIL', 'POSTER', 'HLS_MASTER_PLAYLIST'
    );

