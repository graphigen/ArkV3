-- Basit bakım işlemleri - transaction-safe
-- Sadece temel PostgreSQL komutları

-- Tablo istatistiklerini güncelle (transaction-safe)
ANALYZE admin_users;
ANALYZE pages;
ANALYZE menu_items;
ANALYZE site_settings;
ANALYZE blog_posts;
ANALYZE forms;

-- Basit tablo bilgileri
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Kolon bilgileri
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public'
AND table_name IN ('admin_users', 'pages', 'menu_items')
ORDER BY table_name, ordinal_position;

SELECT 'Basic maintenance completed!' as status;
