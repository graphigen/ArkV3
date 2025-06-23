-- ARK KONTROL Tam Site Verileri
-- Tüm eksik verileri ekle

-- 1. Site ayarları
INSERT INTO site_settings (
    site_name, site_description, site_url, admin_email, contact_email, 
    phone, address, timezone, language, maintenance_mode, 
    allow_registration, require_email_verification, enable_comments, enable_newsletter
) VALUES (
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
    true
) ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    site_description = EXCLUDED.site_description,
    updated_at = CURRENT_TIMESTAMP;

-- 2. Ana sayfalar
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description) VALUES
('Ana Sayfa', '', 'ARK KONTROL - Robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı. Modern teknoloji ile üretim süreçlerinizi optimize edin.', 'Robotik kaynak, lazer kesim ve otomasyon çözümleri', 'published', 'tr', 'home', 1, 2850, 'ARK KONTROL - Robotik ve Otomasyon Çözümleri', 'Türkiye''nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı.'),

('Hakkımızda', 'hakkimizda', 'ARK KONTROL olarak endüstriyel otomasyon alanında uzman ekibimizle hizmet veriyoruz. Robotik kaynak sistemleri, lazer kesim teknolojileri ve otomasyon çözümleri konularında deneyimli kadromuzla müşterilerimize en iyi hizmeti sunmaktayız.', 'Endüstriyel otomasyon uzmanı', 'published', 'tr', 'page', 2, 1890, 'Hakkımızda - ARK KONTROL', 'ARK KONTROL olarak endüstriyel otomasyon alanında uzman ekibimizle hizmet veriyoruz.'),

('İletişim', 'iletisim', 'Robotik otomasyon çözümleri için bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümü sunmak için hazır.', 'İletişim bilgileri ve form', 'published', 'tr', 'contact', 13, 2650, 'İletişim - ARK KONTROL', 'Robotik otomasyon çözümleri için bizimle iletişime geçin.'),

('Blog', 'blog', 'Endüstriyel otomasyon, robotik kaynak ve teknoloji hakkında güncel makaleler ve haberler.', 'Teknoloji ve otomasyon blog yazıları', 'published', 'tr', 'blog', 14, 3250, 'Blog - ARK KONTROL', 'Endüstriyel otomasyon, robotik kaynak ve teknoloji hakkında güncel makaleler.')

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- 3. Ürün sayfaları
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description) VALUES
('Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc', 'Tiger Torch plazma kesim torçları için profesyonel temizleme sistemleri. Yüksek kaliteli temizleme çözümleri ile torçlarınızın ömrünü uzatın.', 'Plazma kesim torçları için temizleme sistemleri', 'published', 'tr', 'product', 3, 1240, 'Tiger Torch Temizleme Üniteleri - ARK KONTROL', 'Plazma kesim torçları için profesyonel Tiger Torch temizleme sistemleri.'),

('Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf', 'Plazma kesim makineleri için yedek parçalar ve sarf malzemeleri. Kaliteli elektrotlar, nozullar ve diğer sarf malzemeleri.', 'Yedek parçalar ve sarf malzemeleri', 'published', 'tr', 'product', 4, 890, 'Plazma Kesim Sarf Malzemeleri - ARK KONTROL', 'Plazma kesim makineleri için kaliteli yedek parçalar ve sarf malzemeleri.'),

('ABB Robot Servis ve Bakım', 'urunler/abb-servis', 'Resmi ABB servis partneri olarak robot bakım ve onarım hizmetleri. Uzman teknisyenlerimizle profesyonel servis.', 'Resmi ABB servis partneri hizmetleri', 'published', 'tr', 'service', 5, 1650, 'ABB Robot Servis ve Bakım - ARK KONTROL', 'Resmi ABB servis partneri olarak profesyonel robot bakım ve onarım hizmetleri.'),

('Fronius Kaynak Makina Servis', 'urunler/fronius-servis', 'Fronius kaynak makineleri için profesyonel bakım ve onarım hizmetleri. Uzman servis ekibimizle güvenilir çözümler.', 'Fronius kaynak makineleri bakım ve onarım', 'published', 'tr', 'service', 6, 1120, 'Fronius Kaynak Makina Servis - ARK KONTROL', 'Fronius kaynak makineleri için uzman bakım ve onarım hizmetleri.')

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- 4. Proje sayfaları
INSERT INTO pages (title, slug, content, excerpt, status, language, template, menu_order, views, seo_title, seo_description) VALUES
('Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak', 'ABB ve KUKA robotları ile entegre kaynak sistemleri ve hücreleri. Otomatik kaynak çözümleri ile üretim verimliliğinizi artırın.', 'ABB ve KUKA robotları ile kaynak sistemleri', 'published', 'tr', 'project', 7, 1980, 'Robotik Kaynak Hücreleri - ARK KONTROL', 'ABB ve KUKA robotları ile profesyonel robotik kaynak hücreleri.'),

('Fikstur Sistemleri', 'projeler/fikstur', 'Özel tasarım sabitleme ve fikstur çözümleri. İhtiyaçlarınıza özel tasarlanan hassas sabitleme sistemleri.', 'Özel tasarım sabitleme ve fikstur çözümleri', 'published', 'tr', 'project', 8, 750, 'Fikstur Sistemleri - ARK KONTROL', 'Endüstriyel üretim için özel tasarım sabitleme ve fikstur sistemleri.'),

('Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Hassas döndürme ve konumlandırma sistemleri. Kaynak işlemleri için optimize edilmiş pozisyoner çözümleri.', 'Hassas döndürme ve konumlandırma sistemleri', 'published', 'tr', 'project', 9, 920, 'Pozisyoner Sistemleri - ARK KONTROL', 'Endüstriyel uygulamalar için hassas döndürme ve konumlandırma sistemleri.'),

('Robotik Slider Sistemleri', 'projeler/slider', 'Lineer hareket ve genişletme sistemleri. Robot çalışma alanını genişleten slider çözümleri.', 'Lineer hareket ve genişletme sistemleri', 'published', 'tr', 'project', 10, 680, 'Robotik Slider Sistemleri - ARK KONTROL', 'Robotik uygulamalar için lineer hareket ve genişletme sistemleri.'),

('Mekanize Çözümler', 'projeler/mekanize', 'Endüstriyel otomasyon ve mekanizasyon çözümleri. Üretim süreçlerinizi otomatikleştiren sistemler.', 'Endüstriyel otomasyon ve mekanizasyon', 'published', 'tr', 'project', 11, 1340, 'Mekanize Çözümler - ARK KONTROL', 'Endüstriyel üretim için otomasyon ve mekanizasyon çözümleri.'),

('Lazer Kesim Tezgahları', 'projeler/lazer-kesim', 'Fiber lazer kesim makineleri ve sistemleri. Hassas kesim için en son teknoloji lazer sistemleri.', 'Fiber lazer kesim makineleri', 'published', 'tr', 'project', 12, 2150, 'Lazer Kesim Tezgahları - ARK KONTROL', 'Endüstriyel üretim için fiber lazer kesim makineleri ve sistemleri.')

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- 5. Menü öğeleri
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language) VALUES
('header', 'Ana Sayfa', '/', (SELECT id FROM pages WHERE slug = ''), NULL, 1, '_self', true, 'tr'),
('header', 'Hakkımızda', '/hakkimizda', (SELECT id FROM pages WHERE slug = 'hakkimizda'), NULL, 2, '_self', true, 'tr'),
('header', 'Ürünler', '#', NULL, NULL, 3, '_self', true, 'tr'),
('header', 'Tiger Torch', '/urunler/tiger-torc', (SELECT id FROM pages WHERE slug = 'urunler/tiger-torc'), (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 1, '_self', true, 'tr'),
('header', 'Plazma Sarf', '/urunler/plazma-sarf', (SELECT id FROM pages WHERE slug = 'urunler/plazma-sarf'), (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 2, '_self', true, 'tr'),
('header', 'ABB Servis', '/urunler/abb-servis', (SELECT id FROM pages WHERE slug = 'urunler/abb-servis'), (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 3, '_self', true, 'tr'),
('header', 'Fronius Servis', '/urunler/fronius-servis', (SELECT id FROM pages WHERE slug = 'urunler/fronius-servis'), (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 4, '_self', true, 'tr'),
('header', 'Projeler', '#', NULL, NULL, 4, '_self', true, 'tr'),
('header', 'Robotik Kaynak', '/projeler/robotik-kaynak', (SELECT id FROM pages WHERE slug = 'projeler/robotik-kaynak'), (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 1, '_self', true, 'tr'),
('header', 'Fikstur', '/projeler/fikstur', (SELECT id FROM pages WHERE slug = 'projeler/fikstur'), (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 2, '_self', true, 'tr'),
('header', 'Pozisyoner', '/projeler/pozisyoner', (SELECT id FROM pages WHERE slug = 'projeler/pozisyoner'), (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 3, '_self', true, 'tr'),
('header', 'Slider', '/projeler/slider', (SELECT id FROM pages WHERE slug = 'projeler/slider'), (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 4, '_self', true, 'tr'),
('header', 'Mekanize', '/projeler/mekanize', (SELECT id FROM pages WHERE slug = 'projeler/mekanize'), (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 5, '_self', true, 'tr'),
('header', 'Lazer Kesim', '/projeler/lazer-kesim', (SELECT id FROM pages WHERE slug = 'projeler/lazer-kesim'), (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 6, '_self', true, 'tr'),
('header', 'Blog', '/blog', (SELECT id FROM pages WHERE slug = 'blog'), NULL, 5, '_self', true, 'tr'),
('header', 'İletişim', '/iletisim', (SELECT id FROM pages WHERE slug = 'iletisim'), NULL, 6, '_self', true, 'tr')

ON CONFLICT (menu_location, title, menu_order) DO UPDATE SET
    url = EXCLUDED.url,
    page_id = EXCLUDED.page_id,
    updated_at = CURRENT_TIMESTAMP;

-- 6. Blog kategorileri
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Robotik Sistemler', 'robotik-sistemler', 'Robotik kaynak ve otomasyon sistemleri', '#3B82F6'),
('Lazer Teknolojileri', 'lazer-teknolojileri', 'Lazer kesim ve işleme teknolojileri', '#EF4444'),
('Otomasyon', 'otomasyon', 'Endüstriyel otomasyon çözümleri', '#10B981'),
('Genel', 'genel', 'Genel teknoloji haberleri', '#6B7280')

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    updated_at = CURRENT_TIMESTAMP;

-- 7. Blog yazıları
INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, views, reading_time, tags) VALUES
('Robotik Kaynak Teknolojileri', 'robotik-kaynak-teknolojileri', 'Modern endüstride robotik kaynak sistemlerinin önemi ve avantajları', 'Robotik kaynak sistemleri, modern üretim süreçlerinde vazgeçilmez hale gelmiştir. ABB ve KUKA robotları ile entegre edilmiş kaynak hücreleri, üretim verimliliğini önemli ölçüde artırmaktadır.', (SELECT id FROM blog_categories WHERE slug = 'robotik-sistemler'), 'published', CURRENT_TIMESTAMP, 245, 5, '["robotik", "kaynak", "otomasyon"]'),

('Lazer Kesim Sistemleri', 'lazer-kesim-sistemleri', 'Hassas kesim için lazer teknolojisi kullanımı', 'Lazer kesim teknolojisi, metal işleme endüstrisinde devrim yaratmıştır. Fiber lazer sistemleri ile elde edilen hassasiyet ve hız, geleneksel kesim yöntemlerini geride bırakmıştır.', (SELECT id FROM blog_categories WHERE slug = 'lazer-teknolojileri'), 'published', CURRENT_TIMESTAMP, 128, 4, '["lazer", "kesim", "metal"]'),

('Endüstriyel Otomasyon Çözümleri', 'endustriyel-otomasyon-cozumleri', 'Fabrika otomasyonu için kapsamlı çözümler', 'Endüstriyel otomasyon, üretim verimliliğini artıran en önemli faktörlerden biridir. Modern otomasyon sistemleri ile maliyetleri düşürürken kaliteyi artırmak mümkündür.', (SELECT id FROM blog_categories WHERE slug = 'otomasyon'), 'published', CURRENT_TIMESTAMP, 189, 6, '["otomasyon", "endüstri", "verimlilik"]')

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- 8. İletişim formu
INSERT INTO forms (name, title, description, slug, status, submit_message, email_notifications, notification_emails, store_submissions) VALUES
('İletişim Formu', 'Bizimle İletişime Geçin', 'Sorularınız için bizimle iletişime geçin', 'iletisim-formu', 'active', 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.', true, '["info@arkkontrol.com"]', true)

ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    title = EXCLUDED.title,
    updated_at = CURRENT_TIMESTAMP;

-- Başarı mesajı
SELECT 'Tüm site verileri başarıyla eklendi!' as result;
