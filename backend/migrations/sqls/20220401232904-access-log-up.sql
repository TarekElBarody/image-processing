CREATE TABLE access_log(
    id SERIAL PRIMARY KEY,
    remote_addr VARCHAR(20) DEFAULT NULL,
    visit_date TIMESTAMP DEFAULT NOW(),
    method VARCHAR(10) DEFAULT NULL,
    url TEXT DEFAULT NULL,
    status INTEGER DEFAULT 200,
    referrer TEXT DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    content_length INTEGER DEFAULT 0,
    response_time NUMERIC(18,3) DEFAULT 0
);