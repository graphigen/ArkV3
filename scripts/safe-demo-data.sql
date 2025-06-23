-- Güvenli demo data ekleme scripti
-- Önce mevcut demo verilerini temizleyelim (güvenli şekilde)

-- Menu items temizle
DELETE FROM menu_items WHERE id BETWEEN 1 AND 20;

-- Blog verilerini temizle
DELETE FROM blog_posts WHERE id BETWEEN 1 AND 10;
DELETE FROM blog_categories WHERE id BETWEEN 1 AND 10;

-- Form verilerini temizle
DELETE FROM form_fields WHERE form_id BETWEEN 1 AND 10;
DELETE FROM forms WHERE id BETWEEN 1 AND 10;

-- Pages temizle (sadece demo sayfalar)
DELETE FROM pages WHERE id BETWEEN 1 AND 20;

-- Site settings güncelle (UPDATE kullan, INSERT değil)
UPDATE site_settings SET 
    site_name = 'ARK KONTROL',
    site_description = 'Endüstriyel Otomasyon ve Robotik Çözümler',
    site_url = 'https://arkkontrol.com',
    admin_email = 'admin@arkkontrol.com',
    contact_email = 'info@arkkontrol.com',
    phone = '+90 212 555 0123',
    address = 'İstanbul, Türkiye',
    timezone = 'Europe/Istanbul',
    language = 'tr',
    maintenance_mode = false,
    updated_at = CURRENT_TIMESTAMP
WHERE id = 1;

-- Eğer site_settings boşsa, INSERT et
INSERT INTO site_settings (
    site_name, site_description, site_url, admin_email, contact_email,
    phone, address, timezone, language, maintenance_mode,
    allow_registration, require_email_verification, enable_comments, enable_newsletter
)
SELECT 
    'ARK KONTROL', 'Endüstriyel Otomasyon ve Robotik Çözümler', 
    'https://arkkontrol.com', 'admin@arkkontrol.com', 'info@arkkontrol.com',
    '+90 212 555 0123', 'İstanbul, Türkiye', 'Europe/Istanbul', 'tr', false,
    false, true, true, true
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

-- Pages ekle (sadece temel sütunlar)
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views) VALUES 
('Ana Sayfa', '', 'ARK KONTROL ana sayfa içeriği', 'Ana sayfa', 'published', 'tr', 'home', 1, 1250),
('Hakkımızda', 'hakkimizda', 'Hakkımızda sayfa içeriği', 'Hakkımızda', 'published', 'tr', 'page', 2, 420),
('İletişim', 'iletisim', 'İletişim sayfa içeriği', 'İletişim', 'published', 'tr', 'contact', 3, 280),
('Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc', 'Tiger Torch içerik', 'Tiger Torch', 'published', 'tr', 'product', 4, 180),
('Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf', 'Plazma sarf içerik', 'Plazma sarf', 'published', 'tr', 'product', 5, 150),
('ABB Robot Servis ve Bakım', 'urunler/abb-servis', 'ABB servis içerik', 'ABB servis', 'published', 'tr', 'service', 6, 200),
('Fronius Kaynak Makina Servis', 'urunler/fronius-servis', 'Fronius servis içerik', 'Fronius servis', 'published', 'tr', 'service', 7, 160),
('Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Pozisyoner içerik', 'Pozisyoner', 'published', 'tr', 'project', 8, 120),
('Robotik Slider Sistemleri', 'projeler/slider', 'Slider içerik', 'Slider', 'published', 'tr', 'project', 9, 95),
('Mekanize Çözümler', 'projeler/mekanize', 'Mekanize içerik', 'Mekanize', 'published', 'tr', 'project', 10, 140),
('Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak', 'Robotik kaynak içerik', 'Robotik kaynak', 'published', 'tr', 'project', 11, 220),
('Lazer Kesim Tezgahları', 'projeler/lazer-kesim', 'Lazer kesim içerik', 'Lazer kesim', 'published', 'tr', 'project', 12, 180),
('Fikstur Sistemleri', 'projeler/fikstur', 'Fikstur içerik', 'Fikstur', 'published', 'tr', 'project', 13, 110),
('Blog', 'blog', 'Blog sayfa içeriği', 'Blog', 'published', 'tr', 'blog', 14, 95);

-- Menu Items ekle (sadece temel sütunlar)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target) VALUES 
-- Ana menü
('header', 'Anasayfa', '/', (SELECT id FROM pages WHERE slug = ''), NULL, 1, '_self'),
('header', 'Ürün ve Çözümler', '#', NULL, NULL, 2, '_self'),
('header', 'Projelerimiz', '#', NULL, NULL, 3, '_self'),
('header', 'Blog', '/blog', (SELECT id FROM pages WHERE slug = 'blog'), NULL, 4, '_self'),
('header', 'Hakkımızda', '/hakkimizda', (SELECT id FROM pages WHERE slug = 'hakkimizda'), NULL, 5, '_self'),
('header', 'İletişim', '/iletisim', (SELECT id FROM pages WHERE slug = 'iletisim'), NULL, 6, '_self');

-- Alt menüler (parent_id ile)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target) VALUES 
-- Ürün alt menüleri
('header', 'Tiger Torch Temizleme', '/urunler/tiger-torc', 
 (SELECT id FROM pages WHERE slug = 'urunler/tiger-torc'), 
 (SELECT id FROM menu_items WHERE title = 'Ürün ve Çözümler' AND menu_location = 'header'), 1, '_self'),
('header', 'Plazma Sarf Malzemeleri', '/urunler/plazma-sarf', 
 (SELECT id FROM pages WHERE slug = 'urunler/plazma-sarf'), 
 (SELECT id FROM menu_items WHERE title = 'Ürün ve Çözümler' AND menu_location = 'header'), 2, '_self'),
('header', 'ABB Robot Servis', '/urunler/abb-servis', 
 (SELECT id FROM pages WHERE slug = 'urunler/abb-servis'), 
 (SELECT id FROM menu_items WHERE title = 'Ürün ve Çözümler' AND menu_location = 'header'), 3, '_self'),
('header', 'Fronius Servis', '/urunler/fronius-servis', 
 (SELECT id FROM pages WHERE slug = 'urunler/fronius-servis'), 
 (SELECT id FROM menu_items WHERE title = 'Ürün ve Çözümler' AND menu_location = 'header'), 4, '_self'),

-- Proje alt menüleri
('header', 'Robotik Kaynak', '/projeler/robotik-kaynak', 
 (SELECT id FROM pages WHERE slug = 'projeler/robotik-kaynak'), 
 (SELECT id FROM menu_items WHERE title = 'Projelerimiz' AND menu_location = 'header'), 1, '_self'),
('header', 'Fikstur Sistemleri', '/projeler/fikstur', 
 (SELECT id FROM pages WHERE slug = 'projeler/fikstur'), 
 (SELECT id FROM menu_items WHERE title = 'Projelerimiz' AND menu_location = 'header'), 2, '_self'),
('header', 'Pozisyoner Sistemleri', '/projeler/pozisyoner', 
 (SELECT id FROM pages WHERE slug = 'projeler/pozisyoner'), 
 (SELECT id FROM menu_items WHERE title = 'Projelerimiz' AND menu_location = 'header'), 3, '_self'),
('header', 'Slider Sistemleri', '/projeler/slider', 
 (SELECT id FROM pages WHERE slug = 'projeler/slider'), 
 (SELECT id FROM menu_items WHERE title = 'Projelerimiz' AND menu_location = 'header'), 4, '_self'),
('header', 'Mekanize Çözümler', '/projeler/mekanize', 
 (SELECT id FROM pages WHERE slug = 'projeler/mekanize'), 
 (SELECT id FROM menu_items WHERE title = 'Projelerimiz' AND menu_location = 'header'), 5, '_self'),
('header', 'Lazer Kesim', '/projeler/lazer-kesim', 
 (SELECT id FROM pages WHERE slug = 'projeler/lazer-kesim'), 
 (SELECT id FROM menu_items WHERE title = 'Projelerimiz' AND menu_location = 'header'), 6, '_self');

-- Blog Categories (sadece temel sütunlar)
INSERT INTO blog_categories (name, slug, description) VALUES 
('Otomasyon', 'otomasyon', 'Endüstriyel otomasyon haberleri'),
('Robotik', 'robotik', 'Robotik teknolojiler'),
('Kaynak Teknolojileri', 'kaynak-teknolojileri', 'Kaynak teknolojileri'),
('Lazer Kesim', 'lazer-kesim', 'Lazer kesim teknolojileri'),
('Sektör Haberleri', 'sektor-haberleri', 'Sektör haberleri');

-- Blog Posts (sadece temel sütunlar)
INSERT INTO blog_posts (title, slug, content, excerpt, status, category_id) VALUES 
('Endüstriyel Otomasyonun Geleceği', 'otomasyon-gelecegi', 
 'Otomasyon teknolojilerinin gelişimi...', 'Otomasyon geleceği', 'published', 1),
('Robotik Kaynak Yenilikleri', 'robotik-kaynak-yenilikleri', 
 'Robotik kaynak sistemleri...', 'Robotik kaynak', 'published', 2),
('Lazer Kesim Avantajları', 'lazer-kesim-avantajlari', 
 'Lazer kesim teknolojisi...', 'Lazer kesim', 'published', 4);

-- Forms (sadece temel sütunlar)
INSERT INTO forms (name, title, description, slug, status) VALUES 
('contact', 'İletişim Formu', 'Genel iletişim', 'iletisim', 'active'),
('quote', 'Teklif Formu', 'Proje teklifi', 'teklif', 'active'),
('service', 'Servis Formu', 'Servis talebi', 'servis', 'active');

-- Form Fields (sadece temel sütunlar)
INSERT INTO form_fields (form_id, name, type, label, required, order_index) VALUES 
-- İletişim formu
(1, 'name', 'text', 'Ad Soyad', true, 1),
(1, 'email', 'email', 'E-posta', true, 2),
(1, 'phone', 'tel', 'Telefon', false, 3),
(1, 'message', 'textarea', 'Mesaj', true, 4),

-- Teklif formu
(2, 'company', 'text', 'Şirket', true, 1),
(2, 'name', 'text', 'İletişim Kişisi', true, 2),
(2, 'email', 'email', 'E-posta', true, 3),
(2, 'phone', 'tel', 'Telefon', true, 4),
(2, 'project_type', 'select', 'Proje Türü', true, 5),
(2, 'description', 'textarea', 'Açıklama', true, 6);

-- Languages (eğer tablo varsa)
INSERT INTO languages (code, name, native_name, is_active, is_default, sort_order) 
SELECT 'tr', 'Turkish', 'Türkçe', true, true, 1
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'tr');

INSERT INTO languages (code, name, native_name, is_active, is_default, sort_order) 
SELECT 'en', 'English', 'English', false, false, 2
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en');

-- Analytics data (eğer tablolar varsa)
INSERT INTO site_stats (date, page_views, unique_visitors, bounce_rate, avg_session_duration) 
SELECT '2024-06-23', 320, 240, 0.28, 220
WHERE EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_stats');

INSERT INTO traffic_sources (date, source, visitors, percentage) VALUES 
('2024-06-23', 'Organic Search', 120, 0.55),
('2024-06-23', 'Direct', 65, 0.30),
('2024-06-23', 'Social Media', 20, 0.09),
('2024-06-23', 'Referral', 15, 0.06);

-- Sequence'ları güncelle
SELECT setval(pg_get_serial_sequence('pages', 'id'), (SELECT COALESCE(MAX(id), 1) FROM pages));
SELECT setval(pg_get_serial_sequence('menu_items', 'id'), (SELECT COALESCE(MAX(id), 1) FROM menu_items));
SELECT setval(pg_get_serial_sequence('blog_categories', 'id'), (SELECT COALESCE(MAX(id), 1) FROM blog_categories));
SELECT setval(pg_get_serial_sequence('blog_posts', 'id'), (SELECT COALESCE(MAX(id), 1) FROM blog_posts));
SELECT setval(pg_get_serial_sequence('forms', 'id'), (SELECT COALESCE(MAX(id), 1) FROM forms));
