-- Schema Verification Script (Level 2 Specification)
-- Run this after executing 01_schema.sql and 02_seed.sql to verify setup

-- Check table existence and row counts
SELECT 
    schemaname,
    tablename,
    n_tup_ins as rows_inserted
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Verify foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public';

-- Sample data verification
SELECT 'Users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'Locations', COUNT(*) FROM locations
UNION ALL
SELECT 'Business Hours', COUNT(*) FROM business_hours
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Review Votes', COUNT(*) FROM review_votes
UNION ALL
SELECT 'Review Reports', COUNT(*) FROM review_reports;

-- Show sample location data with embedded details
SELECT 
    l.name,
    l.address,
    l.seating_type,
    l.purchase_required,
    l.has_public_restroom,
    l.has_wifi,
    l.has_outlets
FROM locations l
LIMIT 3;

-- Show sample business hours
SELECT 
    l.name as location_name,
    bh.day_of_week,
    bh.open_time,
    bh.close_time
FROM business_hours bh
JOIN locations l ON bh.location_id = l.location_id
ORDER BY l.name, bh.day_of_week
LIMIT 10;

-- Show sample reviews with all rating fields
SELECT 
    u.display_name,
    l.name as location_name,
    r.overall_rating,
    r.noise_level_value,
    r.outlet_availability_value,
    r.crowding_value,
    r.wifi_quality_value,
    r.study_type_value,
    r.time_of_day_visited,
    r.comment_text
FROM reviews r
JOIN users u ON r.user_id = u.user_id
JOIN locations l ON r.location_id = l.location_id
LIMIT 3;

-- Show sample review votes
SELECT 
    u.display_name as voter_name,
    l.name as location_name,
    rv.vote_type,
    rv.created_at
FROM review_votes rv
JOIN reviews r ON rv.review_id = r.review_id
JOIN users u ON rv.user_id = u.user_id
JOIN locations l ON r.location_id = l.location_id
LIMIT 3;
