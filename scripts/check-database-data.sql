-- Veritabanındaki mevcut verileri kontrol et
SELECT 'SITE SETTINGS' as table_name, COUNT(*) as record_count FROM site_settings
UNION ALL
SELECT 'PAGES', COUNT(*) FROM pages
UNION ALL
SELECT 'MENU ITEMS', COUNT(*) FROM menu_items
UNION ALL
SELECT 'BLOG POSTS', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'BLOG CATEGORIES', COUNT(*) FROM blog_categories
UNION ALL
SELECT 'FORMS', COUNT(*) FROM forms
ORDER BY table_name;

-- Detaylı sayfa bilgileri
SELECT 'PAGES DETAIL' as info;
SELECT id, title, slug, status, language, views, created_at FROM pages ORDER BY menu_order;

-- Menü öğeleri
SELECT 'MENU ITEMS DETAIL' as info;
SELECT id, title, url, menu_location, menu_order, is_active FROM menu_items WHERE is_active = true ORDER BY menu_order;

-- Blog kategorileri
SELECT 'BLOG CATEGORIES DETAIL' as info;
SELECT id, name, slug FROM blog_categories;
