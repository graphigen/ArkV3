-- Veri özeti - sadece temel sorgular
SELECT 'DATA SUMMARY' as report_type;

-- Admin kullanıcıları
SELECT 
    'Admin Users' as category,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active,
    COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
FROM admin_users;

-- Sayfalar
SELECT 
    'Pages' as category,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as drafts
FROM pages;

-- Menü öğeleri
SELECT 
    'Menu Items' as category,
    COUNT(*) as total,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active,
    COUNT(DISTINCT menu_location) as locations
FROM menu_items;

-- Blog yazıları
SELECT 
    'Blog Posts' as category,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'published' THEN 1 END) as published,
    AVG(views) as avg_views
FROM blog_posts;

-- Formlar
SELECT 
    'Forms' as category,
    COUNT(*) as total,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active
FROM forms;

SELECT 'Data summary completed!' as final_status;
