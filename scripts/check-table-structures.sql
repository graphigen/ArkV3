-- Tüm tabloların sütun yapılarını kontrol edelim
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN (
        'site_settings', 'pages', 'menu_items', 'blog_categories', 
        'blog_posts', 'forms', 'form_fields', 'seo_settings',
        'languages', 'site_stats', 'traffic_sources'
    )
ORDER BY table_name, ordinal_position;
