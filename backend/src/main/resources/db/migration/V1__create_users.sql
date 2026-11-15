-- =========================================================
-- V1: Create users table (+ shared updated_at trigger function)
-- =========================================================

-- Reusable trigger function. DEFAULT CURRENT_TIMESTAMP only fills
-- updated_at on INSERT, so every table with an updated_at column
-- attaches this trigger to refresh it on every UPDATE.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Uniqueness is enforced case-insensitively by the index below.
    email VARCHAR(320) NOT NULL,

    -- NULL allows accounts created through social login.
    password_hash VARCHAR(255),

    display_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_users_status
        CHECK (status IN ('ACTIVE', 'SUSPENDED'))
);

-- "A@x.com" and "a@x.com" are the same account.
-- Application lookups should use lower(email).
CREATE UNIQUE INDEX uq_users_email_lower
    ON users (lower(email));

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
