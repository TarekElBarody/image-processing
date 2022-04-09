CREATE TABLE user_log(
    id SERIAL PRIMARY KEY,
    user_id uuid REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(200) NOT NULL,
    disc TEXT NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    duration INTEGER DEFAULT 0
);