-- ARK KONTROL Tam Site Verileri (Hatasız Versiyon)
-- WHERE NOT EXISTS kullanarak güvenli ekleme

-- 1. Site ayarları (sadece yoksa ekle)
INSERT INTO site_settings (
    site_name, site_description, site_url, admin_email, contact_email, 
    phone, address, timezone, language, maintenance_mode, 
    allow_registration, require_email_verification, enable_comments, enable_newsletter,
    created_at, updated_at
)
SELECT 
    'ARK KONTROL', 
    'Robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı',
    'https://arkkontrol.com',
    'admin@arkkontrol.com',
    'info@arkkontrol.com',
    '+90 212 XXX XX XX',
    'İstanbul, Türkiye',
    'Europe/Istanbul',
    'tr',
    false,
    false,
    false,
    true,
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- 2. Ana sayfalar (sadece yoksa ekle)
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description, created_at, updated_at)
SELECT * FROM (VALUES
    ('Ana Sayfa', '', 'ARK KONTROL - Robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı.', 'Robotik kaynak, lazer kesim ve otomasyon çözümleri', 'published', 'tr', 'home', 1, 2850, 'ARK KONTROL - Robotik ve Otomasyon Çözümleri', 'Türkiye''nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Hakkımızda', 'hakkimizda', 'ARK KONTROL olarak endüstriyel otomasyon alanında uzman ekibimizle hizmet veriyoruz.', 'Endüstriyel otomasyon uzmanı', 'published', 'tr', 'page', 2, 1890, 'Hakkımızda - ARK KONTROL', 'ARK KONTROL olarak endüstriyel otomasyon alanında uzman ekibimizle hizmet veriyoruz.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('İletişim', 'iletisim', 'Robotik otomasyon çözümleri için bizimle iletişime geçin.', 'İletişim bilgileri ve form', 'published', 'tr', 'contact', 13, 2650, 'İletişim - ARK KONTROL', 'Robotik otomasyon çözümleri için bizimle iletişime geçin.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Blog', 'blog', 'Endüstriyel otomasyon, robotik kaynak ve teknoloji hakkında güncel makaleler.', 'Teknoloji ve otomasyon blog yazıları', 'published', 'tr', 'blog', 14, 3250, 'Blog - ARK KONTROL', 'Endüstriyel otomasyon, robotik kaynak ve teknoloji hakkında güncel makaleler.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE pages.slug = v.slug);

-- 3. Ürün sayfaları
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description, created_at, updated_at)
SELECT * FROM (VALUES
    ('Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc', 'Tiger Torch plazma kesim torçları için profesyonel temizleme sistemleri.', 'Plazma kesim torçları için temizleme sistemleri', 'published', 'tr', 'product', 3, 1240, 'Tiger Torch Temizleme Üniteleri - ARK KONTROL', 'Plazma kesim torçları için profesyonel Tiger Torch temizleme sistemleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf', 'Plazma kesim makineleri için yedek parçalar ve sarf malzemeleri.', 'Yedek parçalar ve sarf malzemeleri', 'published', 'tr', 'product', 4, 890, 'Plazma Kesim Sarf Malzemeleri - ARK KONTROL', 'Plazma kesim makineleri için kaliteli yedek parçalar ve sarf malzemeleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('ABB Robot Servis ve Bakım', 'urunler/abb-servis', 'Resmi ABB servis partneri olarak robot bakım ve onarım hizmetleri.', 'Resmi ABB servis partneri hizmetleri', 'published', 'tr', 'service', 5, 1650, 'ABB Robot Servis ve Bakım - ARK KONTROL', 'Resmi ABB servis partneri olarak profesyonel robot bakım ve onarım hizmetleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Fronius Kaynak Makina Servis', 'urunler/fronius-servis', 'Fronius kaynak makineleri için profesyonel bakım ve onarım hizmetleri.', 'Fronius kaynak makineleri bakım ve onarım', 'published', 'tr', 'service', 6, 1120, 'Fronius Kaynak Makina Servis - ARK KONTROL', 'Fronius kaynak makineleri için uzman bakım ve onarım hizmetleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE pages.slug = v.slug);

-- 4. Proje sayfaları
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description, created_at, updated_at)
SELECT * FROM (VALUES
    ('Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak', 'ABB ve KUKA robotları ile entegre kaynak sistemleri ve hücreleri.', 'ABB ve KUKA robotları ile kaynak sistemleri', 'published', 'tr', 'project', 7, 1980, 'Robotik Kaynak Hücreleri - ARK KONTROL', 'ABB ve KUKA robotları ile profesyonel robotik kaynak hücreleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Fikstur Sistemleri', 'projeler/fikstur', 'Özel tasarım sabitleme ve fikstur çözümleri.', 'Özel tasarım sabitleme ve fikstur çözümleri', 'published', 'tr', 'project', 8, 750, 'Fikstur Sistemleri - ARK KONTROL', 'Endüstriyel üretim için özel tasarım sabitleme ve fikstur sistemleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Hassas döndürme ve konumlandırma sistemleri.', 'Hassas döndürme ve konumlandırma sistemleri', 'published', 'tr', 'project', 9, 920, 'Pozisyoner Sistemleri - ARK KONTROL', 'Endüstriyel uygulamalar için hassas döndürme ve konumlandırma sistemleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Robotik Slider Sistemleri', 'projeler/slider', 'Lineer hareket ve genişletme sistemleri.', 'Lineer hareket ve genişletme sistemleri', 'published', 'tr', 'project', 10, 680, 'Robotik Slider Sistemleri - ARK KONTROL', 'Robotik uygulamalar için lineer hareket ve genişletme sistemleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Mekanize Çözümler', 'projeler/mekanize', 'Endüstriyel otomasyon ve mekanizasyon çözümleri.', 'Endüstriyel otomasyon ve mekanizasyon', 'published', 'tr', 'project', 11, 1340, 'Mekanize Çözümler - ARK KONTROL', 'Endüstriyel üretim için otomasyon ve mekanizasyon çözümleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lazer Kesim Tezgahları', 'projeler/lazer-kesim', 'Fiber lazer kesim makineleri ve sistemleri.', 'Fiber lazer kesim makineleri', 'published', 'tr', 'project', 12, 2150, 'Lazer Kesim Tezgahları - ARK KONTROL', 'Endüstriyel üretim için fiber lazer kesim makineleri ve sistemleri.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE pages.slug = v.slug);

-- 5. Blog kategorileri
INSERT INTO blog_categories (name, slug, description, color, created_at, updated_at)
SELECT * FROM (VALUES
    ('Robotik Sistemler', 'robotik-sistemler', 'Robotik kaynak ve otomasyon sistemleri', '#3B82F6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lazer Teknolojileri', 'lazer-teknolojileri', 'Lazer kesim ve işleme teknolojileri', '#EF4444', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Otomasyon', 'otomasyon', 'Endüstriyel otomasyon çözümleri', '#10B981', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Genel', 'genel', 'Genel teknoloji haberleri', '#6B7280', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(name, slug, description, color, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE blog_categories.slug = v.slug);

-- 6. Blog yazıları
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, views, reading_time, tags, created_at, updated_at)
SELECT 
    v.title, v.slug, v.excerpt, v.content, 
    (SELECT id FROM blog_categories WHERE slug = v.category_slug),
    v.status, v.published_at, v.views, v.reading_time, v.tags, v.created_at, v.updated_at
FROM (VALUES
    ('Robotik Kaynak Teknolojileri', 'robotik-kaynak-teknolojileri', 'Modern endüstride robotik kaynak sistemlerinin önemi ve avantajları', 'Robotik kaynak sistemleri, modern üretim süreçlerinde vazgeçilmez hale gelmiştir.', 'robotik-sistemler', 'published', CURRENT_TIMESTAMP, 245, 5, '["robotik", "kaynak", "otomasyon"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Lazer Kesim Sistemleri', 'lazer-kesim-sistemleri', 'Hassas kesim için lazer teknolojisi kullanımı', 'Lazer kesim teknolojisi, metal işleme endüstrisinde devrim yaratmıştır.', 'lazer-teknolojileri', 'published', CURRENT_TIMESTAMP, 128, 4, '["lazer", "kesim", "metal"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('Endüstriyel Otomasyon Çözümleri', 'endustriyel-otomasyon-cozumleri', 'Fabrika otomasyonu için kapsamlı çözümler', 'Endüstriyel otomasyon, üretim verimliliğini artıran en önemli faktörlerden biridir.', 'otomasyon', 'published', CURRENT_TIMESTAMP, 189, 6, '["otomasyon", "endüstri", "verimlilik"]', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(title, slug, excerpt, content, category_slug, status, published_at, views, reading_time, tags, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.slug = v.slug);

-- 7. İletişim formu
INSERT INTO forms (name, title, description, slug, status, submit_message, email_notifications, notification_emails, store_submissions, created_at, updated_at)
SELECT 
    'İletişim Formu', 
    'Bizimle İletişime Geçin', 
    'Sorularınız için bizimle iletişime geçin', 
    'iletisim-formu', 
    'active', 
    'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.', 
    true, 
    '["info@arkkontrol.com"]', 
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM forms WHERE slug = 'iletisim-formu');

-- 8. Menü konumları
INSERT INTO menu_locations (location_key, location_name, description, is_active, created_at)
SELECT * FROM (VALUES
    ('header', 'Ana Menü', 'Site üst menüsü', true, CURRENT_TIMESTAMP),
    ('footer', 'Alt Menü', 'Site alt menüsü', true, CURRENT_TIMESTAMP)
) AS v(location_key, location_name, description, is_active, created_at)
WHERE NOT EXISTS (SELECT 1 FROM menu_locations WHERE menu_locations.location_key = v.location_key);

-- 9. Menü öğeleri (önce ana menüler)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, created_at, updated_at)
SELECT * FROM (VALUES
    ('header', 'Ana Sayfa', '/', NULL, NULL, 1, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('header', 'Hakkımızda', '/hakkimizda', NULL, NULL, 2, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('header', 'Ürünler', '#', NULL, NULL, 3, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('header', 'Projeler', '#', NULL, NULL, 4, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('header', 'Blog', '/blog', NULL, NULL, 5, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('header', 'İletişim', '/iletisim', NULL, NULL, 6, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
) AS v(menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, created_at, updated_at)
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_items.menu_location = v.menu_location AND menu_items.title = v.title);

-- 10. Alt menü öğeleri (ürünler)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, created_at, updated_at)
SELECT 
    'header', v.title, v.url, NULL, 
    (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header' LIMIT 1),
    v.menu_order, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (VALUES
    ('Tiger Torch', '/urunler/tiger-torc', 1),
    ('Plazma Sarf', '/urunler/plazma-sarf', 2),
    ('ABB Servis', '/urunler/abb-servis', 3),
    ('Fronius Servis', '/urunler/fronius-servis', 4)
) AS v(title, url, menu_order)
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_items.title = v.title AND menu_items.menu_location = 'header');

-- 11. Alt menü öğeleri (projeler)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, created_at, updated_at)
SELECT 
    'header', v.title, v.url, NULL, 
    (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header' LIMIT 1),
    v.menu_order, '_self', true, 'tr', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM (VALUES
    ('Robotik Kaynak', '/projeler/robotik-kaynak', 1),
    ('Fikstur', '/projeler/fikstur', 2),
    ('Pozisyoner', '/projeler/pozisyoner', 3),
    ('Slider', '/projeler/slider', 4),
    ('Mekanize', '/projeler/mekanize', 5),
    ('Lazer Kesim', '/projeler/lazer-kesim', 6)
) AS v(title, url, menu_order)
WHERE NOT EXISTS (SELECT 1 FROM menu_items WHERE menu_items.title = v.title AND menu_items.menu_location = 'header');

-- Başarı mesajı
SELECT 'Tüm site verileri başarıyla eklendi! 16 sayfa + menüler + blog verileri hazır.' as result;
