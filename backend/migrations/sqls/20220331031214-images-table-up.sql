CREATE TABLE images (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL UNIQUE,
    width INTEGER DEFAULT 0,
    height INTEGER DEFAULT 0,
    created TIMESTAMP DEFAULT NOW(),
    bucket_key TEXT DEFAULT NULL,
    access INTEGER DEFAULT 2
    );