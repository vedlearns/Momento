-- =========================================================
-- V7: Create watch_progress table
--
-- Lets a user resume a video where they stopped. One row per
-- user and video: update it (upsert), do not insert new rows.
-- =========================================================

CREATE TABLE watch_progress (

    -- Unique ID for each watch progress record.
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- ID of the user watching the media.
    user_id UUID NOT NULL,

    -- ID of the photo/video being watched.
    media_item_id UUID NOT NULL,

    -- Last playback position in milliseconds (1475000 = 24 min 35 sec).
    -- Starts at 0 if the user hasn't started watching.
    position_ms BIGINT NOT NULL DEFAULT 0,

    -- TRUE if the user has finished watching the video.
    -- Otherwise, FALSE.
    completed BOOLEAN NOT NULL DEFAULT FALSE,

    -- Date and time when the user last watched this media.
    last_watched_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Date and time when this progress record was created.
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Date and time when this progress record was last updated.
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,


    -- Ensure the user exists in the users table.
    CONSTRAINT fk_watch_progress_user
        FOREIGN KEY (user_id) REFERENCES users(id),

    -- Ensure the media item exists in the media_items table.
    CONSTRAINT fk_watch_progress_media
        FOREIGN KEY (media_item_id) REFERENCES media_items(id),

    -- A user can have only one progress record per media item.
    CONSTRAINT uq_watch_progress_user_media
        UNIQUE (user_id, media_item_id),

    -- Prevent negative video playback positions.
    CONSTRAINT chk_watch_progress_position
        CHECK (position_ms >= 0)
);


-- Helps quickly find a user's watch history,
-- showing the most recently watched videos first.
CREATE INDEX idx_watch_progress_user
    ON watch_progress(user_id, last_watched_at DESC);


-- Helps quickly find which users have watch progress
-- for a particular media item.
CREATE INDEX idx_watch_progress_media_item
    ON watch_progress(media_item_id);


-- Automatically update updated_at whenever a watch progress record changes.
CREATE TRIGGER trg_watch_progress_updated_at
    BEFORE UPDATE ON watch_progress
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
