-- Basit veritabanı kontrolü - sadece temel PostgreSQL özellikleri
SELECT 'Database Connection: OK' as status;

-- Tablo sayıları
SELECT 
    'admin_users' as table_name,
    COUNT(*) as record_count
FROM admin_users
UNION ALL
SELECT 
    'pages' as table_name,
    COUNT(*) as record_count
FROM pages
UNION ALL
SELECT 
    'menu_items' as table_name,
    COUNT(*) as record_count
FROM menu_items
UNION ALL
SELECT 
    'site_settings' as table_name,
    COUNT(*) as record_count
FROM site_settings
UNION ALL
SELECT 
    'blog_posts' as table_name,
    COUNT(*) as record_count
FROM blog_posts
UNION ALL
SELECT 
    'forms' as table_name,
    COUNT(*) as record_count
FROM forms;

-- Basit sistem bilgisi
SELECT 
    current_database() as database_name,
    current_user as current_user,
    version() as postgresql_version;

SELECT 'Simple check completed successfully!' as final_status;
