-- Detaylı sistem durumu
SELECT 
    'Database Status' as category,
    'Connected' as status,
    CURRENT_TIMESTAMP as checked_at;

-- Tablo durumları
SELECT 
    'Table Counts' as category,
    json_build_object(
        'site_settings', (SELECT COUNT(*) FROM site_settings),
        'admin_users', (SELECT COUNT(*) FROM admin_users),
        'pages', (SELECT COUNT(*) FROM pages),
        'menu_items', (SELECT COUNT(*) FROM menu_items),
        'blog_posts', (SELECT COUNT(*) FROM blog_posts),
        'forms', (SELECT COUNT(*) FROM forms),
        'languages', (SELECT COUNT(*) FROM languages)
    ) as counts;

-- Sistem sağlığı
SELECT 
    'System Health' as category,
    CASE 
        WHEN (SELECT COUNT(*) FROM admin_users WHERE is_active = true) > 0 THEN 'OK'
        ELSE 'WARNING: No active admin users'
    END as admin_status,
    CASE 
        WHEN (SELECT COUNT(*) FROM site_settings) > 0 THEN 'OK'
        ELSE 'WARNING: No site settings'
    END as settings_status;
