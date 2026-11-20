CREATE TABLE social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    provider VARCHAR(20) NOT NULL CHECK (provider IN ('GOOGLE', 'APPLE')),
    provider_subject VARCHAR(255) NOT NULL,
    email VARCHAR(320),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_social_provider_subject UNIQUE (provider, provider_subject)
);

CREATE INDEX idx_social_accounts_user_id ON social_accounts(user_id);