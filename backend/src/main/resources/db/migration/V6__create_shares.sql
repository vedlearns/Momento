-- =========================================================
-- V6: Create shares table
--
-- A share targets exactly one album OR one media item, and is
-- granted either to a registered user (USER) or through a private
-- link (LINK).
-- =========================================================

CREATE TABLE shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- User who created the share (must own the shared content).
    owner_id UUID NOT NULL,

    -- Registered recipient. NULL for LINK shares.
    recipient_user_id UUID,

    -- Exactly one of these two is set.
    media_item_id UUID,
    album_id UUID,

    -- USER or LINK.
    share_type VARCHAR(20) NOT NULL,

    -- VIEW, or DOWNLOAD (view + download).
    permission VARCHAR(20) NOT NULL DEFAULT 'VIEW',

    -- LINK shares only: lowercase hex SHA-256 of the secret token.
    -- The raw token is shown to the owner once (inside the link) and is
    -- never stored, so a database leak does not expose working links.
    --
    -- Application contract:
    --   * generate >= 128 bits of random data per token;
    --   * to validate a link, compute lower(hex(sha256(token UTF-8 bytes)))
    --     and look the share up by token_hash.
    token_hash VARCHAR(64),

    -- NULL = never expires.
    expires_at TIMESTAMPTZ,

    -- Set to revoke the share.
    revoked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

-- Ensures that the same sharing link token hash cannot be used for two different shares.
    CONSTRAINT uq_shares_token_hash
        UNIQUE (token_hash),

-- Ensures that the person creating the share actually exists in the users table.
    CONSTRAINT fk_shares_owner
        FOREIGN KEY (owner_id) REFERENCES users(id),

-- Ensures that the person receiving the share exists in the users table.
    CONSTRAINT fk_shares_recipient
        FOREIGN KEY (recipient_user_id) REFERENCES users(id),

    -- Composite keys: only the owner of an album / media item can share it.
-- This checks whether the media item belongs to the same user who is creating the share.
    CONSTRAINT fk_shares_media_item
        FOREIGN KEY (media_item_id, owner_id)
        REFERENCES media_items(id, owner_id),

-- It checks whether the album belongs to the user creating the share.
    CONSTRAINT fk_shares_album
        FOREIGN KEY (album_id, owner_id)
        REFERENCES albums(id, owner_id),

    -- Exactly one target: an album or a media item, never both.
    CONSTRAINT chk_shares_single_target
        CHECK (
            (media_item_id IS NOT NULL AND album_id IS NULL)
            OR
            (media_item_id IS NULL AND album_id IS NOT NULL)
        ),

    CONSTRAINT chk_shares_type
        CHECK (share_type IN ('USER', 'LINK')),

    -- USER = recipient and no token. LINK = token and no recipient.
-- This constraint ensures that the sharing method is correctly configured.
    CONSTRAINT chk_shares_type_method
        CHECK (
            (share_type = 'USER'
                AND recipient_user_id IS NOT NULL
                AND token_hash IS NULL)
            OR
            (share_type = 'LINK'
                AND recipient_user_id IS NULL
                AND token_hash IS NOT NULL)
        ),

-- Ensures the token hash contains exactly 64 lowercase hexadecimal characters (or is NULL).
    CONSTRAINT chk_shares_token_hash_format
        CHECK (token_hash IS NULL OR token_hash ~ '^[0-9a-f]{64}$'),

--  Allows only VIEW or DOWNLOAD permissions.
    CONSTRAINT chk_shares_permission
        CHECK (permission IN ('VIEW', 'DOWNLOAD')),

-- Prevents users from sharing with themselves.
    CONSTRAINT chk_shares_not_self
        CHECK (recipient_user_id IS NULL OR recipient_user_id <> owner_id),

-- Ensures the expiry date is later than the share creation date (or is NULL for no expiry).
    CONSTRAINT chk_shares_expiration
        CHECK (expires_at IS NULL OR expires_at > created_at)
);

-- Helps quickly find all shares created by a particular user.
CREATE INDEX idx_shares_owner_id
    ON shares(owner_id);

-- Helps quickly find all shares received by a particular user, ignoring NULL recipients.
CREATE INDEX idx_shares_recipient_user_id
    ON shares(recipient_user_id)
    WHERE recipient_user_id IS NOT NULL;

-- Helps quickly find shares associated with a particular photo or video.
CREATE INDEX idx_shares_media_item_id
    ON shares(media_item_id)
    WHERE media_item_id IS NOT NULL;

-- Helps quickly find shares associated with a particular album.
CREATE INDEX idx_shares_album_id
    ON shares(album_id)
    WHERE album_id IS NOT NULL;

--  Helps quickly find shares that haven't been revoked, using their expiry dates.
CREATE INDEX idx_shares_active_expiration
    ON shares(expires_at)
    WHERE revoked_at IS NULL;

-- One active (non-revoked) share per recipient and target.
-- LINK shares are unaffected: they have no recipient.
-- Note: an expired share that was never revoked still counts as active,
-- so set revoked_at before sharing the same thing again.
CREATE UNIQUE INDEX uq_shares_active_user_album
    ON shares(recipient_user_id, album_id)
    WHERE revoked_at IS NULL
      AND recipient_user_id IS NOT NULL
      AND album_id IS NOT NULL;

CREATE UNIQUE INDEX uq_shares_active_user_media
    ON shares(recipient_user_id, media_item_id)
    WHERE revoked_at IS NULL
      AND recipient_user_id IS NOT NULL
      AND media_item_id IS NOT NULL;
