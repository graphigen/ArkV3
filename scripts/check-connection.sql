-- Database connection test
SELECT 
    current_database() as database_name,
    current_user as user_name,
    version() as postgres_version,
    now() as current_time;

-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
