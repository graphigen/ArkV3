-- ARK KONTROL Basit Demo Data
-- Sadece temel veriler, hata riski minimum

-- 1. Site Settings (sadece 1 kayıt)
INSERT INTO site_settings (site_name, site_description, contact_email, phone, language) 
SELECT 'ARK KONTROL', 'Endüstriyel Otomasyon Çözümleri', 'info@arkkontrol.com', '+90 212 555 0123', 'tr'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE site_name = 'ARK KONTROL');

-- 2. Ana Sayfa
INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Ana Sayfa', '', 'ARK KONTROL ana sayfa içeriği', 'published', 'tr', 'home', 1, 1250
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = '' OR slug IS NULL);

-- 3. Hakkımızda
INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Hakkımızda', 'hakkimizda', 'ARK KONTROL hakkında bilgiler', 'published', 'tr', 'page', 2, 420
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'hakkimizda');

-- 4. İletişim
INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'İletişim', 'iletisim', 'İletişim bilgileri', 'published', 'tr', 'contact', 3, 280
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'iletisim');

-- 5. Blog
INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Blog', 'blog', 'Blog sayfası', 'published', 'tr', 'blog', 4, 95
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'blog');

-- 6. Ürün Sayfaları
INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc', 'Tiger Torch ürün açıklaması', 'published', 'tr', 'product', 5, 180
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'urunler/tiger-torc');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf', 'Plazma sarf malzemeleri', 'published', 'tr', 'product', 6, 150
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'urunler/plazma-sarf');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'ABB Robot Servis ve Bakım', 'urunler/abb-servis', 'ABB robot servis hizmetleri', 'published', 'tr', 'service', 7, 200
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'urunler/abb-servis');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Fronius Kaynak Makina Servis', 'urunler/fronius-servis', 'Fronius servis hizmetleri', 'published', 'tr', 'service', 8, 160
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'urunler/fronius-servis');

-- 7. Proje Sayfaları
INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Pozisyoner sistemleri açıklaması', 'published', 'tr', 'project', 9, 120
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'projeler/pozisyoner');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Robotik Slider Sistemleri', 'projeler/slider', 'Slider sistemleri açıklaması', 'published', 'tr', 'project', 10, 95
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'projeler/slider');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Mekanize Çözümler', 'projeler/mekanize', 'Mekanize çözümler açıklaması', 'published', 'tr', 'project', 11, 140
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'projeler/mekanize');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak', 'Robotik kaynak açıklaması', 'published', 'tr', 'project', 12, 220
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'projeler/robotik-kaynak');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Lazer Kesim Tezgahları', 'projeler/lazer-kesim', 'Lazer kesim açıklaması', 'published', 'tr', 'project', 13, 180
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'projeler/lazer-kesim');

INSERT INTO pages (title, slug, content, status, language, template, menu_order, views) 
SELECT 'Fikstur Sistemleri', 'projeler/fikstur', 'Fikstur sistemleri açıklaması', 'published', 'tr', 'project', 14, 110
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'projeler/fikstur');

-- 8. Header Menüsünü Temizle ve Yeniden Oluştur
DELETE FROM menu_items WHERE menu_location = 'header';

-- Ana menü öğeleri
INSERT INTO menu_items (menu_location, title, url, menu_order, target, is_active, language, visibility) VALUES 
('header', 'Anasayfa', '/', 1, '_self', true, 'tr', 'public'),
('header', 'Ürün ve Çözümler', '#', 2, '_self', true, 'tr', 'public'),
('header', 'Projelerimiz', '#', 3, '_self', true, 'tr', 'public'),
('header', 'Blog', '/blog', 4, '_self', true, 'tr', 'public'),
('header', 'Hakkımızda', '/hakkimizda', 5, '_self', true, 'tr', 'public'),
('header', 'İletişim', '/iletisim', 6, '_self', true, 'tr', 'public');

-- Alt menü öğeleri (Ürün ve Çözümler)
INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Tiger Torch Temizleme Üniteleri', '/urunler/tiger-torc', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
       1, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Plazma Kesim Sarf Malzemeleri', '/urunler/plazma-sarf', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
       2, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'ABB Robot Servis ve Bakım', '/urunler/abb-servis', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
       3, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Fronius Kaynak Makina Servis', '/urunler/fronius-servis', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
       4, '_self', true, 'tr', 'public';

-- Alt menü öğeleri (Projelerimiz)
INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Robotik Kaynak Hücreleri', '/projeler/robotik-kaynak', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
       1, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Fikstur Sistemleri', '/projeler/fikstur', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
       2, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Pozisyoner Sistemleri', '/projeler/pozisyoner', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
       3, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Robotik Slider Sistemleri', '/projeler/slider', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
       4, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Mekanize Çözümler', '/projeler/mekanize', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
       5, '_self', true, 'tr', 'public';

INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language, visibility) 
SELECT 'header', 'Lazer Kesim Tezgahları', '/projeler/lazer-kesim', 
       (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
       6, '_self', true, 'tr', 'public';

-- 9. Blog Kategorileri
INSERT INTO blog_categories (name, slug, description, color) 
SELECT 'Otomasyon', 'otomasyon', 'Endüstriyel otomasyon haberleri', '#3B82F6'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'otomasyon');

INSERT INTO blog_categories (name, slug, description, color) 
SELECT 'Robotik', 'robotik', 'Robotik teknolojiler', '#10B981'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'robotik');

INSERT INTO blog_categories (name, slug, description, color) 
SELECT 'Kaynak Teknolojileri', 'kaynak-teknolojileri', 'Kaynak teknolojileri', '#F59E0B'
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'kaynak-teknolojileri');

-- 10. Blog Yazıları
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, views, reading_time, tags) 
SELECT 'Endüstriyel Otomasyonun Geleceği', 'endustriyel-otomasyonun-gelecegi',
       'Endüstriyel otomasyon teknolojilerinin geleceği hakkında analiz.',
       'Endüstriyel otomasyon teknolojilerinin gelişimi ve geleceğe dair öngörüler...',
       (SELECT id FROM blog_categories WHERE slug = 'otomasyon' LIMIT 1),
       'published', NOW(), 245, 8, '["otomasyon", "gelecek", "teknoloji"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'endustriyel-otomasyonun-gelecegi');

INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, views, reading_time, tags) 
SELECT 'Robotik Kaynak Sistemlerinde Yenilikler', 'robotik-kaynak-sistemleri',
       'Robotik kaynak teknolojilerindeki son gelişmeler.',
       'Modern robotik kaynak sistemlerinin avantajları ve uygulama alanları...',
       (SELECT id FROM blog_categories WHERE slug = 'robotik' LIMIT 1),
       'published', NOW(), 189, 6, '["robotik", "kaynak", "otomasyon"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'robotik-kaynak-sistemleri');

-- Sequence'ları güncelle
SELECT setval(pg_get_serial_sequence('pages', 'id'), COALESCE(MAX(id), 1)) FROM pages;
SELECT setval(pg_get_serial_sequence('menu_items', 'id'), COALESCE(MAX(id), 1)) FROM menu_items;
SELECT setval(pg_get_serial_sequence('blog_categories', 'id'), COALESCE(MAX(id), 1)) FROM blog_categories;
SELECT setval(pg_get_serial_sequence('blog_posts', 'id'), COALESCE(MAX(id), 1)) FROM blog_posts;
