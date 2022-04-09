CREATE VIEW user_view AS
    SELECT 
        users.id,
        users.first_name,
        users.last_name,
        users.birthday,
        users.email,
        users.mobile,
        users.role,
        users.created,
        COALESCE((SELECT COUNT(*) FROM images WHERE user_id = users.id),0)::INTEGER AS images_count,
        COALESCE((SELECT COUNT(*) FROM thumbs WHERE image_id IN (SELECT id FROM images WHERE user_id = users.id)),0)::INTEGER AS thumbs_count,
        0 AS total_visit,
        0 AS process_duration
        FROM users;
