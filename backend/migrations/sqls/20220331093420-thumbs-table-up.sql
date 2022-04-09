CREATE TABLE thumbs(
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    image_id uuid REFERENCES images(id),
    filename VARCHAR(255) NOT NULL UNIQUE,
    width INTEGER DEFAULT 0,
    height INTEGER DEFAULT 0,
    format VARCHAR(10) NOT NULL DEFAULT 'jpeg',
    fit VARCHAR(10) NOT NULL DEFAULT 'cover',
    modified TIMESTAMP DEFAULT NOW(),
    bucket_key TEXT DEFAULT NULL,
    UNIQUE (image_id, width, height, format, fit)
    );