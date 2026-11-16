-- =========================================================
-- V3: Create media_items table
--
-- One row per photo or video (the logical item). The physical
-- files in S3 are described in media_assets (V4).
-- =========================================================

CREATE TABLE media_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL,

    -- Name of the file as uploaded, e.g. vacation.jpg
    original_filename VARCHAR(255) NOT NULL,

    -- Optional display title (can differ from the filename).
    title VARCHAR(255),
    description TEXT,

    -- IMAGE or VIDEO.
    media_type VARCHAR(20) NOT NULL,

    -- PENDING_UPLOAD -> PROCESSING -> READY, or FAILED.
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_UPLOAD',

    -- When the photo/video was taken (EXIF or file metadata).
    -- NULL when unknown. created_at is the upload time.
    captured_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Soft delete: NULL = not deleted.
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_media_items_owner
        FOREIGN KEY (owner_id) REFERENCES users(id),

    -- Target for composite foreign keys that must also match the owner
    -- (album cover, album_media, shares).
    CONSTRAINT uq_media_items_id_owner
        UNIQUE (id, owner_id),

    CONSTRAINT chk_media_items_type
        CHECK (media_type IN ('IMAGE', 'VIDEO')),

    CONSTRAINT chk_media_items_status
        CHECK (status IN ('PENDING_UPLOAD', 'PROCESSING', 'READY', 'FAILED')),

    CONSTRAINT chk_media_items_filename
        CHECK (LENGTH(TRIM(original_filename)) > 0)
);

CREATE INDEX idx_media_items_owner_id
    ON media_items(owner_id);

CREATE INDEX idx_media_items_owner_created
    ON media_items(owner_id, created_at DESC);

CREATE INDEX idx_media_items_status
    ON media_items(status);

CREATE INDEX idx_media_items_active_owner
    ON media_items(owner_id)
    WHERE deleted_at IS NULL;

-- Timeline: newest first by date taken, falling back to upload time.
-- Queries must use exactly COALESCE(captured_at, created_at) to hit this index.
-- Helps show a user's active photos/videos newest first, using the taken date or upload date.
CREATE INDEX idx_media_items_owner_timeline
    ON media_items(owner_id, (COALESCE(captured_at, created_at)) DESC)
    WHERE deleted_at IS NULL;

CREATE TRIGGER trg_media_items_updated_at
    BEFORE UPDATE ON media_items
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
