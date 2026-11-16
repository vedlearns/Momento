-- =========================================================
-- V5: Create album_media table + album cover foreign key
--
-- Many-to-many link between albums and media items. The same
-- photo/video can appear in many albums without duplicate files.
--
-- owner_id is stored here so composite foreign keys can guarantee
-- that the album AND the media item belong to the same user.
-- =========================================================

CREATE TABLE album_media (
    album_id UUID NOT NULL,
    media_item_id UUID NOT NULL,

    -- Must match the owner of both the album and the media item.
    owner_id UUID NOT NULL,

    -- Display order inside the album (lower first).
    position INTEGER NOT NULL DEFAULT 0,

    added_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- The same item cannot be added to the same album twice.
    CONSTRAINT pk_album_media
        PRIMARY KEY (album_id, media_item_id),

    CONSTRAINT fk_album_media_album
        FOREIGN KEY (album_id, owner_id)
        REFERENCES albums(id, owner_id),

    CONSTRAINT fk_album_media_item
        FOREIGN KEY (media_item_id, owner_id)
        REFERENCES media_items(id, owner_id),

    CONSTRAINT chk_album_media_position
        CHECK (position >= 0)
);

CREATE INDEX idx_album_media_media_item_id
    ON album_media(media_item_id);

CREATE INDEX idx_album_media_album_position
    ON album_media(album_id, position);


-- ---------------------------------------------------------
-- Album cover: now that media_items exists.
-- ---------------------------------------------------------
-- Composite key: the cover must be a media item of the album's owner.
-- NULL cover_media_id skips the check, so albums without a cover are fine.
-- No ON DELETE rule: Momento uses soft deletes.
-- This Ensures that an album's cover photo belongs to the same user who owns the album.
ALTER TABLE albums
    ADD CONSTRAINT fk_albums_cover_media
    FOREIGN KEY (cover_media_id, owner_id)
    REFERENCES media_items(id, owner_id);