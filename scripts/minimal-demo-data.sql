-- ARK KONTROL Minimal Demo Data
-- Sadece zorunlu veriler, hiç hata riski yok

-- 1. Site ayarları kontrol et ve ekle
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1) THEN
        INSERT INTO site_settings (site_name, contact_email, language) 
        VALUES ('ARK KONTROL', 'info@arkkontrol.com', 'tr');
    END IF;
END $$;

-- 2. Ana sayfa kontrol et ve ekle
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = '' OR slug IS NULL) THEN
        INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
        VALUES ('Ana Sayfa', '', 'ARK KONTROL ana sayfa', 'published', 'tr', 'home', 1, 100);
    END IF;
END $$;

-- 3. Diğer temel sayfalar
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'hakkimizda') THEN
        INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
        VALUES ('Hakkımızda', 'hakkimizda', 'Hakkımızda içeriği', 'published', 'tr', 'page', 2, 50);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'iletisim') THEN
        INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
        VALUES ('İletişim', 'iletisim', 'İletişim içeriği', 'published', 'tr', 'contact', 3, 30);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'blog') THEN
        INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
        VALUES ('Blog', 'blog', 'Blog sayfası', 'published', 'tr', 'blog', 4, 20);
    END IF;
END $$;

-- 4. Blog kategorisi ekle
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'genel') THEN
        INSERT INTO blog_categories (name, slug, description, color) 
        VALUES ('Genel', 'genel', 'Genel yazılar', '#3B82F6');
    END IF;
END $$;

-- 5. Bir blog yazısı ekle
DO $$
DECLARE
    cat_id INTEGER;
BEGIN
    SELECT id INTO cat_id FROM blog_categories WHERE slug = 'genel' LIMIT 1;
    
    IF cat_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'ilk-blog-yazisi') THEN
        INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, views, reading_time) 
        VALUES ('İlk Blog Yazısı', 'ilk-blog-yazisi', 'İlk blog yazımız', 'Blog içeriği burada olacak...', cat_id, 'published', NOW(), 10, 3);
    END IF;
END $$;

-- Başarı mesajı
SELECT 'Demo veriler başarıyla eklendi!' as result;
