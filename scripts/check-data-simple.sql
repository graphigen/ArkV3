-- Basit veri kontrolü
SELECT 'PAGES' as table_name, COUNT(*) as count FROM pages
UNION ALL
SELECT 'MENU_ITEMS', COUNT(*) FROM menu_items
UNION ALL
SELECT 'BLOG_POSTS', COUNT(*) FROM blog_posts
UNION ALL
SELECT 'BLOG_CATEGORIES', COUNT(*) FROM blog_categories
UNION ALL
SELECT 'FORMS', COUNT(*) FROM forms
ORDER BY table_name;
