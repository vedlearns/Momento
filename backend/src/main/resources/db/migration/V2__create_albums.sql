-- =========================================================
-- V2: Create albums table
--
-- Albums are owned by a user and can be nested through
-- parent_album_id. The cover_media_id foreign key is added in V5,
-- after media_items exists.
-- =========================================================

CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    owner_id UUID NOT NULL,

    -- NULL = top-level album, otherwise the album this one is nested in.
    parent_album_id UUID,

    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Optional cover. Foreign key added in V5.
    cover_media_id UUID,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Soft delete: NULL = not deleted.
    deleted_at TIMESTAMPTZ,

    CONSTRAINT fk_albums_owner
        FOREIGN KEY (owner_id) REFERENCES users(id),

    -- Target for composite foreign keys that must also match the owner
    -- (parent album here; cover, album_media and shares later).
    CONSTRAINT uq_albums_id_owner
        UNIQUE (id, owner_id),

    -- A parent album must belong to the same user.
    CONSTRAINT fk_albums_parent
        FOREIGN KEY (parent_album_id, owner_id)
        REFERENCES albums(id, owner_id),

    CONSTRAINT chk_albums_not_own_parent
        CHECK (parent_album_id IS NULL OR parent_album_id <> id),

    CONSTRAINT chk_album_name
        CHECK (LENGTH(TRIM(name)) > 0)
);

CREATE INDEX idx_albums_owner_id
    ON albums(owner_id);

CREATE INDEX idx_albums_parent_album_id
    ON albums(parent_album_id);

CREATE TRIGGER trg_albums_updated_at
    BEFORE UPDATE ON albums
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ---------------------------------------------------------
-- Prevent cycles (A -> B -> A, A -> B -> C -> A ...)
-- ---------------------------------------------------------
-- chk_albums_not_own_parent only blocks A -> A. This trigger walks
-- up from the new parent and rejects the move if it reaches the
-- album being moved.
--
-- It fires only when parent_album_id changes on an existing row:
-- a brand-new album cannot already be anyone's ancestor.
--
-- The advisory lock serialises tree changes per owner, so two
-- concurrent moves cannot each look safe alone and still form a
-- cycle together.


CREATE OR REPLACE FUNCTION prevent_album_cycle()

-- This function will be called by a trigger.
RETURNS TRIGGER AS $$
BEGIN

    -- Lock this owner's album tree during the current transaction.
    -- This prevents two simultaneous moves from creating a cycle.
    PERFORM pg_advisory_xact_lock(

        -- Generate a unique lock key using the owner's ID.
        hashtextextended('albums_tree:' || NEW.owner_id::text, 0)
    );

    -- Check whether moving this album would create a cycle.
    IF EXISTS (

        -- Recursively find all ancestors of the proposed parent album.
        WITH RECURSIVE ancestors AS (

            -- Start with the new parent album.
            SELECT id, parent_album_id
            FROM albums
            WHERE id = NEW.parent_album_id

            UNION

            -- Keep finding the parent of each discovered album.
            SELECT a.id, a.parent_album_id
            FROM albums a
            JOIN ancestors anc ON a.id = anc.parent_album_id
        )

        -- Check if the album being moved appears in its new parent's ancestors. return 1 if true
        SELECT 1 FROM ancestors WHERE id = NEW.id

    ) THEN

        -- If found, reject the update because it creates a cycle.
        RAISE EXCEPTION
            'Album % cannot be placed inside album %: this would create a cycle',

            -- First value: ID of the album being moved.
            NEW.id,

            -- Second value: ID of the proposed parent album.
            NEW.parent_album_id

            -- Use PostgreSQL's check-violation error code.
            USING ERRCODE = '23514';
    END IF;

    -- If no cycle is found, allow the update.
    RETURN NEW;

-- End the function.
END;

-- Specify that the function uses PostgreSQL's PL/pgSQL language.
$$ LANGUAGE plpgsql;


-- Create a trigger to prevent circular album relationships.
CREATE TRIGGER trg_albums_prevent_cycle

    -- Run before updating the parent_album_id column.
    BEFORE UPDATE OF parent_album_id ON albums

    -- Check each updated row separately.
    FOR EACH ROW

    -- Run only when both conditions are true.
    WHEN (

        -- The new parent must not be NULL.
        NEW.parent_album_id IS NOT NULL

        -- The parent ID must actually change.
        AND NEW.parent_album_id IS DISTINCT FROM OLD.parent_album_id
    )

    -- Execute the cycle-prevention function.
    EXECUTE FUNCTION prevent_album_cycle();
