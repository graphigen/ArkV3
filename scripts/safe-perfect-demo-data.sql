-- Foreign key sorunlarını önlemek için DELETE yerine WHERE NOT EXISTS kullanıyoruz

-- Site Settings (Sadece yoksa ekle)
INSERT INTO site_settings (
    id, site_name, site_description, site_url, admin_email, contact_email, 
    phone, address, timezone, language, maintenance_mode, allow_registration,
    require_email_verification, enable_comments, enable_newsletter,
    logo_url, favicon_url, footer_logo_url, social_image_url
) 
SELECT 1, 'ARK KONTROL', 'Endüstriyel Otomasyon ve Robotik Çözümler', 
    'https://arkkontrol.com', 'admin@arkkontrol.com', 'info@arkkontrol.com',
    '+90 212 555 0123', 'İstanbul, Türkiye', 'Europe/Istanbul', 'tr',
    false, false, true, true, true,
    '/logo.png', '/favicon.ico', '/footer-logo.png', '/social-image.jpg'
WHERE NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1);

-- SEO Settings (Sadece yoksa ekle)
INSERT INTO seo_settings (
    id, site_title, site_description, site_keywords, default_og_image, 
    google_analytics_id, robots_txt
) 
SELECT 1, 'ARK KONTROL - Endüstriyel Otomasyon Çözümleri',
    'Robotik kaynak, lazer kesim ve endüstriyel otomasyon alanında uzman çözümler. ABB ve Fronius yetkili servisi.',
    'robotik kaynak, lazer kesim, endüstriyel otomasyon, ABB robot, Fronius kaynak, tiger torch',
    '/social-image.jpg', 'GA-XXXXXXXXX',
    'User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://arkkontrol.com/sitemap.xml'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings WHERE id = 1);

-- Languages (Sadece yoksa ekle)
INSERT INTO languages (id, code, name, native_name, flag_icon, is_default, is_active, direction) 
SELECT 1, 'tr', 'Turkish', 'Türkçe', '🇹🇷', true, true, 'ltr'
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'tr');

INSERT INTO languages (id, code, name, native_name, flag_icon, is_default, is_active, direction) 
SELECT 2, 'en', 'English', 'English', '🇺🇸', false, false, 'ltr'
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en');

-- Pages (Sadece yoksa ekle)
INSERT INTO pages (
    id, title, slug, content, excerpt, status, language, seo_title, seo_description, 
    seo_keywords, og_title, og_description, og_image, canonical_url, noindex, template, 
    custom_css, custom_js, featured_image, author_id, parent_id, menu_order, views, published_at
) 
SELECT * FROM (VALUES 
-- Ana Sayfa
(1, 'Ana Sayfa', '', 
 'ARK KONTROL olarak endüstriyel otomasyon ve robotik çözümler sunuyoruz.',
 'ARK KONTROL ana sayfası', 'published', 'tr',
 'ARK KONTROL - Endüstriyel Otomasyon ve Robotik Çözümler',
 'Endüstriyel otomasyon, robotik kaynak, lazer kesim ve plazma kesim çözümleri. ABB ve Fronius servis hizmetleri.',
 'otomasyon, robotik, endüstri, kaynak, lazer kesim, ABB, Fronius',
 'ARK KONTROL - Endüstriyel Otomasyon', 
 'Türkiye''nin önde gelen endüstriyel otomasyon şirketi',
 '/og-home.jpg', 'https://arkkontrol.com', false, 'home', 
 NULL, NULL, '/home-hero.jpg', NULL, NULL, 1, 1250, '2024-01-01'::timestamp),

-- Hakkımızda
(2, 'Hakkımızda', 'hakkimizda',
 'ARK KONTROL, 2010 yılından beri endüstriyel otomasyon alanında hizmet vermektedir.',
 'ARK KONTROL hakkında bilgiler', 'published', 'tr',
 'Hakkımızda - ARK KONTROL', 
 'ARK KONTROL şirketi hakkında detaylı bilgiler, misyon, vizyon ve değerlerimiz.',
 'hakkımızda, şirket, misyon, vizyon, endüstriyel otomasyon',
 'Hakkımızda - ARK KONTROL', 'ARK KONTROL şirketi hakkında',
 '/og-about.jpg', 'https://arkkontrol.com/hakkimizda', false, 'page', 
 NULL, NULL, '/about-team.jpg', NULL, NULL, 2, 420, '2024-01-01'::timestamp),

-- İletişim
(3, 'İletişim', 'iletisim',
 'Bizimle iletişime geçin. Projeleriniz için profesyonel destek alın.',
 'Bizimle iletişime geçin', 'published', 'tr',
 'İletişim - ARK KONTROL',
 'ARK KONTROL iletişim bilgileri, adres, telefon ve e-posta.',
 'iletişim, adres, telefon, e-posta, destek',
 'İletişim - ARK KONTROL', 'ARK KONTROL ile iletişime geçin',
 '/og-contact.jpg', 'https://arkkontrol.com/iletisim', false, 'contact', 
 NULL, NULL, '/contact-office.jpg', NULL, NULL, 3, 280, '2024-01-01'::timestamp),

-- Ürün Sayfaları
(4, 'Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc',
 'Tiger Torch temizleme üniteleri ile kaynak kalitesini artırın.',
 'Tiger Torch temizleme üniteleri', 'published', 'tr',
 'Tiger Torch Temizleme Üniteleri - ARK KONTROL',
 'Tiger Torch otomatik temizleme üniteleri ile kaynak kalitesini artırın ve üretkenliği yükseltin.',
 'tiger torch, temizleme, kaynak, otomasyon',
 'Tiger Torch Temizleme Üniteleri', 'Kaynak kalitesi için Tiger Torch',
 '/og-tiger-torch.jpg', 'https://arkkontrol.com/urunler/tiger-torc', false, 'product', 
 NULL, NULL, '/products/tiger-torch.jpg', NULL, NULL, 4, 180, '2024-01-01'::timestamp),

(5, 'Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf',
 'Yüksek kaliteli plazma kesim sarf malzemeleri ve yedek parçalar.',
 'Plazma kesim sarf malzemeleri', 'published', 'tr',
 'Plazma Kesim Sarf Malzemeleri - ARK KONTROL',
 'Plazma kesim makineleri için orijinal sarf malzemeleri ve yedek parçalar.',
 'plazma kesim, sarf malzeme, yedek parça',
 'Plazma Kesim Sarf Malzemeleri', 'Kaliteli plazma sarf malzemeleri',
 '/og-plasma.jpg', 'https://arkkontrol.com/urunler/plazma-sarf', false, 'product', 
 NULL, NULL, '/products/plasma-parts.jpg', NULL, NULL, 5, 150, '2024-01-01'::timestamp),

(6, 'ABB Robot Servis ve Bakım', 'urunler/abb-servis',
 'ABB robotları için profesyonel servis ve bakım hizmetleri.',
 'ABB robot servis hizmetleri', 'published', 'tr',
 'ABB Robot Servis ve Bakım - ARK KONTROL',
 'ABB endüstriyel robotları için uzman servis, bakım ve yedek parça hizmetleri.',
 'ABB robot, servis, bakım, endüstriyel robot',
 'ABB Robot Servis', 'ABB robotları için uzman servis',
 '/og-abb.jpg', 'https://arkkontrol.com/urunler/abb-servis', false, 'service', 
 NULL, NULL, '/services/abb-robot.jpg', NULL, NULL, 6, 200, '2024-01-01'::timestamp),

(7, 'Fronius Kaynak Makina Servis', 'urunler/fronius-servis',
 'Fronius kaynak makineleri için uzman servis ve yedek parça hizmetleri.',
 'Fronius servis hizmetleri', 'published', 'tr',
 'Fronius Kaynak Makina Servis - ARK KONTROL',
 'Fronius kaynak makineleri için profesyonel servis, bakım ve yedek parça hizmetleri.',
 'Fronius, kaynak makinesi, servis, bakım',
 'Fronius Servis', 'Fronius kaynak makineleri servisi',
 '/og-fronius.jpg', 'https://arkkontrol.com/urunler/fronius-servis', false, 'service', 
 NULL, NULL, '/services/fronius.jpg', NULL, NULL, 7, 160, '2024-01-01'::timestamp),

-- Proje Sayfaları
(8, 'Pozisyoner Sistemleri', 'projeler/pozisyoner',
 'Kaynak işlemleri için özel tasarım pozisyoner sistemleri.',
 'Pozisyoner sistemleri', 'published', 'tr',
 'Pozisyoner Sistemleri - ARK KONTROL',
 'Kaynak işlemleri için özel tasarım pozisyoner sistemleri ve döner tablalar.',
 'pozisyoner, kaynak, döner tabla, otomasyon',
 'Pozisyoner Sistemleri', 'Kaynak için pozisyoner çözümleri',
 '/og-positioner.jpg', 'https://arkkontrol.com/projeler/pozisyoner', false, 'project', 
 NULL, NULL, '/projects/positioner.jpg', NULL, NULL, 8, 120, '2024-01-01'::timestamp),

(9, 'Robotik Slider Sistemleri', 'projeler/slider',
 'Robot hareketliliği için lineer slider sistemleri.',
 'Robotik slider sistemleri', 'published', 'tr',
 'Robotik Slider Sistemleri - ARK KONTROL',
 'Endüstriyel robotlar için lineer hareket sağlayan slider sistemleri.',
 'robotik slider, lineer hareket, robot ray',
 'Robotik Slider Sistemleri', 'Robot hareketliliği için slider',
 '/og-slider.jpg', 'https://arkkontrol.com/projeler/slider', false, 'project', 
 NULL, NULL, '/projects/slider.jpg', NULL, NULL, 9, 95, '2024-01-01'::timestamp),

(10, 'Mekanize Çözümler', 'projeler/mekanize',
 'Endüstriyel üretim için özel mekanize çözümler.',
 'Mekanize çözümler', 'published', 'tr',
 'Mekanize Çözümler - ARK KONTROL',
 'Endüstriyel üretim süreçleri için özel tasarım mekanize çözümler.',
 'mekanize, otomasyon, üretim, endüstri',
 'Mekanize Çözümler', 'Endüstriyel mekanize sistemler',
 '/og-mechanized.jpg', 'https://arkkontrol.com/projeler/mekanize', false, 'project', 
 NULL, NULL, '/projects/mechanized.jpg', NULL, NULL, 10, 140, '2024-01-01'::timestamp),

(11, 'Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak',
 'Tam otomatik robotik kaynak hücreleri ve sistemleri.',
 'Robotik kaynak hücreleri', 'published', 'tr',
 'Robotik Kaynak Hücreleri - ARK KONTROL',
 'Tam otomatik robotik kaynak hücreleri, kaynak robotları ve otomasyon sistemleri.',
 'robotik kaynak, kaynak robotu, otomasyon, kaynak hücresi',
 'Robotik Kaynak Hücreleri', 'Otomatik kaynak çözümleri',
 '/og-robotic-welding.jpg', 'https://arkkontrol.com/projeler/robotik-kaynak', false, 'project', 
 NULL, NULL, '/projects/robotic-welding.jpg', NULL, NULL, 11, 220, '2024-01-01'::timestamp),

(12, 'Lazer Kesim Tezgahları', 'projeler/lazer-kesim',
 'Yüksek hassasiyetli lazer kesim tezgahları ve sistemleri.',
 'Lazer kesim tezgahları', 'published', 'tr',
 'Lazer Kesim Tezgahları - ARK KONTROL',
 'Endüstriyel lazer kesim tezgahları, fiber lazer sistemleri ve otomasyon çözümleri.',
 'lazer kesim, fiber lazer, kesim tezgahı',
 'Lazer Kesim Tezgahları', 'Hassas lazer kesim çözümleri',
 '/og-laser.jpg', 'https://arkkontrol.com/projeler/lazer-kesim', false, 'project', 
 NULL, NULL, '/projects/laser-cutting.jpg', NULL, NULL, 12, 180, '2024-01-01'::timestamp),

(13, 'Fikstur Sistemleri', 'projeler/fikstur',
 'Kaynak ve montaj işlemleri için özel fikstur sistemleri.',
 'Fikstur sistemleri', 'published', 'tr',
 'Fikstur Sistemleri - ARK KONTROL',
 'Kaynak ve montaj işlemleri için özel tasarım fikstur sistemleri ve aparatlar.',
 'fikstur, kaynak aparatı, montaj, otomasyon',
 'Fikstur Sistemleri', 'Kaynak için fikstur çözümleri',
 '/og-fixture.jpg', 'https://arkkontrol.com/projeler/fikstur', false, 'project', 
 NULL, NULL, '/projects/fixture.jpg', NULL, NULL, 13, 110, '2024-01-01'::timestamp),

-- Blog Sayfası
(14, 'Blog', 'blog',
 'Endüstriyel otomasyon ve teknoloji hakkında güncel yazılar.',
 'ARK KONTROL blog sayfası', 'published', 'tr',
 'Blog - ARK KONTROL',
 'Endüstriyel otomasyon, robotik teknolojiler ve sektör haberleri.',
 'blog, otomasyon, teknoloji, sektör haberleri',
 'ARK KONTROL Blog', 'Otomasyon ve teknoloji blog',
 '/og-blog.jpg', 'https://arkkontrol.com/blog', false, 'blog', 
 NULL, NULL, '/blog-hero.jpg', NULL, NULL, 14, 95, '2024-01-01'::timestamp)
) AS new_pages(id, title, slug, content, excerpt, status, language, seo_title, seo_description, 
    seo_keywords, og_title, og_description, og_image, canonical_url, noindex, template, 
    custom_css, custom_js, featured_image, author_id, parent_id, menu_order, views, published_at)
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE pages.id = new_pages.id);

-- Menu Items (Önce mevcut header menüsünü temizle)
DELETE FROM menu_items WHERE menu_location = 'header';

INSERT INTO menu_items (
    id, menu_location, title, url, page_id, parent_id, menu_order, 
    target, css_class, icon, is_active, language, visibility
) VALUES 
-- Ana Menü Öğeleri
(1, 'header', 'Anasayfa', '/', 1, NULL, 1, '_self', '', 'home', true, 'tr', 'public'),
(2, 'header', 'Ürün ve Çözümler', '#', NULL, NULL, 2, '_self', '', 'package', true, 'tr', 'public'),
(3, 'header', 'Projelerimiz', '#', NULL, NULL, 3, '_self', '', 'briefcase', true, 'tr', 'public'),
(4, 'header', 'Blog', '/blog', 14, NULL, 4, '_self', '', 'book-open', true, 'tr', 'public'),
(5, 'header', 'Hakkımızda', '/hakkimizda', 2, NULL, 5, '_self', '', 'users', true, 'tr', 'public'),
(6, 'header', 'İletişim', '/iletisim', 3, NULL, 6, '_self', '', 'phone', true, 'tr', 'public'),

-- Ürün ve Çözümler Alt Menüleri
(7, 'header', 'Tiger Torch Temizleme Üniteleri', '/urunler/tiger-torc', 4, 2, 1, '_self', '', '', true, 'tr', 'public'),
(8, 'header', 'Plazma Kesim Sarf Malzemeleri', '/urunler/plazma-sarf', 5, 2, 2, '_self', '', '', true, 'tr', 'public'),
(9, 'header', 'ABB Robot Servis ve Bakım', '/urunler/abb-servis', 6, 2, 3, '_self', '', '', true, 'tr', 'public'),
(10, 'header', 'Fronius Kaynak Makina Servis', '/urunler/fronius-servis', 7, 2, 4, '_self', '', '', true, 'tr', 'public'),

-- Projelerimiz Alt Menüleri
(11, 'header', 'Robotik Kaynak Hücreleri', '/projeler/robotik-kaynak', 11, 3, 1, '_self', '', '', true, 'tr', 'public'),
(12, 'header', 'Fikstur Sistemleri', '/projeler/fikstur', 13, 3, 2, '_self', '', '', true, 'tr', 'public'),
(13, 'header', 'Pozisyoner Sistemleri', '/projeler/pozisyoner', 8, 3, 3, '_self', '', '', true, 'tr', 'public'),
(14, 'header', 'Robotik Slider Sistemleri', '/projeler/slider', 9, 3, 4, '_self', '', '', true, 'tr', 'public'),
(15, 'header', 'Mekanize Çözümler', '/projeler/mekanize', 10, 3, 5, '_self', '', '', true, 'tr', 'public'),
(16, 'header', 'Lazer Kesim Tezgahları', '/projeler/lazer-kesim', 12, 3, 6, '_self', '', '', true, 'tr', 'public');

-- Blog Categories (Sadece yoksa ekle)
INSERT INTO blog_categories (id, name, slug, description, color) 
SELECT * FROM (VALUES 
(1, 'Otomasyon', 'otomasyon', 'Endüstriyel otomasyon haberleri ve gelişmeleri', '#3B82F6'),
(2, 'Robotik', 'robotik', 'Robotik teknolojiler ve uygulamalar', '#10B981'),
(3, 'Kaynak Teknolojileri', 'kaynak-teknolojileri', 'Kaynak teknolojileri ve yenilikler', '#F59E0B'),
(4, 'Lazer Kesim', 'lazer-kesim', 'Lazer kesim teknolojileri ve uygulamaları', '#EF4444'),
(5, 'Sektör Haberleri', 'sektor-haberleri', 'Endüstri sektör haberleri ve trendler', '#8B5CF6')
) AS new_categories(id, name, slug, description, color)
WHERE NOT EXISTS (SELECT 1 FROM blog_categories WHERE blog_categories.id = new_categories.id);

-- Blog Posts (Sadece yoksa ekle)
INSERT INTO blog_posts (
    id, title, slug, excerpt, content, featured_image, category_id, author_id, 
    status, published_at, views, reading_time, tags, meta_title, meta_description
) 
SELECT * FROM (VALUES 
(1, 'Endüstriyel Otomasyonun Geleceği', 'endustriyel-otomasyonun-gelecegi',
 'Endüstriyel otomasyonun gelecekteki rolü ve teknolojik gelişmeler hakkında detaylı analiz.',
 'Endüstriyel otomasyon teknolojilerinin gelişimi ve geleceğe dair öngörüler. Yapay zeka, IoT ve robotik teknolojilerin endüstriyel süreçlere entegrasyonu...',
 '/blog/automation-future.jpg', 1, NULL, 'published', '2024-01-15'::timestamp, 245, 8,
 '["otomasyon", "gelecek", "teknoloji", "endüstri", "yapay zeka"]'::jsonb,
 'Endüstriyel Otomasyonun Geleceği - ARK KONTROL Blog',
 'Endüstriyel otomasyon teknolojilerinin geleceği ve sektöre etkileri hakkında detaylı analiz.'),

(2, 'Robotik Kaynak Sistemlerinde Yenilikler', 'robotik-kaynak-sistemlerinde-yenilikler',
 'Robotik kaynak teknolojilerindeki son gelişmeler ve endüstriyel uygulamalar.',
 'Modern robotik kaynak sistemlerinin avantajları ve uygulama alanları. ABB ve KUKA robotlarının kaynak uygulamalarındaki performansı...',
 '/blog/robotic-welding.jpg', 2, NULL, 'published', '2024-01-20'::timestamp, 189, 6,
 '["robotik", "kaynak", "otomasyon", "teknoloji", "ABB"]'::jsonb,
 'Robotik Kaynak Sistemlerinde Yenilikler - ARK KONTROL',
 'Robotik kaynak sistemlerindeki yenilikler ve endüstriyel uygulamalar hakkında uzman görüşleri.'),

(3, 'Lazer Kesim Teknolojisinin Avantajları', 'lazer-kesim-teknolojisinin-avantajlari',
 'Lazer kesim teknolojisinin endüstriyel uygulamalardaki faydaları ve avantajları.',
 'Lazer kesim teknolojisinin geleneksel yöntemlere göre avantajları. Fiber lazer sistemlerin hassasiyet ve hız avantajları...',
 '/blog/laser-cutting.jpg', 4, NULL, 'published', '2024-01-25'::timestamp, 156, 5,
 '["lazer kesim", "teknoloji", "avantajlar", "endüstri", "fiber lazer"]'::jsonb,
 'Lazer Kesim Teknolojisinin Avantajları - ARK KONTROL',
 'Lazer kesim teknolojisinin endüstriyel uygulamalardaki avantajları ve faydaları hakkında detaylı bilgi.')
) AS new_posts(id, title, slug, excerpt, content, featured_image, category_id, author_id, 
    status, published_at, views, reading_time, tags, meta_title, meta_description)
WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.id = new_posts.id);

-- Forms (Sadece yoksa ekle)
INSERT INTO forms (
    id, name, title, description, slug, status, submit_message, redirect_url,
    email_notifications, notification_emails, store_submissions
) 
SELECT * FROM (VALUES 
(1, 'contact_form', 'İletişim Formu', 'Genel iletişim ve bilgi alma formu', 'iletisim', 'active',
 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.', NULL,
 true, '["info@arkkontrol.com", "admin@arkkontrol.com"]'::jsonb, true),

(2, 'quote_form', 'Teklif Formu', 'Proje teklif talep formu', 'teklif', 'active',
 'Teklif talebiniz alındı. Uzmanlarımız en kısa sürede sizinle iletişime geçecek.', NULL,
 true, '["sales@arkkontrol.com", "info@arkkontrol.com"]'::jsonb, true),

(3, 'service_form', 'Servis Talep Formu', 'Teknik servis ve bakım talep formu', 'servis', 'active',
 'Servis talebiniz kaydedildi. Teknik ekibimiz sizinle iletişime geçecek.', NULL,
 true, '["service@arkkontrol.com", "teknik@arkkontrol.com"]'::jsonb, true)
) AS new_forms(id, name, title, description, slug, status, submit_message, redirect_url,
    email_notifications, notification_emails, store_submissions)
WHERE NOT EXISTS (SELECT 1 FROM forms WHERE forms.id = new_forms.id);

-- Form Fields (Önce mevcut alanları temizle)
DELETE FROM form_fields WHERE form_id IN (1,2,3);

INSERT INTO form_fields (
    form_id, name, label, type, placeholder, required, options, validation_rules, order_index
) VALUES 
-- İletişim Formu Alanları
(1, 'name', 'Ad Soyad', 'text', 'Adınızı ve soyadınızı girin', true, '[]'::jsonb, '{"minLength": 2}'::jsonb, 1),
(1, 'email', 'E-posta', 'email', 'E-posta adresinizi girin', true, '[]'::jsonb, '{"email": true}'::jsonb, 2),
(1, 'phone', 'Telefon', 'tel', 'Telefon numaranızı girin', false, '[]'::jsonb, '{}'::jsonb, 3),
(1, 'subject', 'Konu', 'text', 'Mesaj konusunu girin', true, '[]'::jsonb, '{"minLength": 3}'::jsonb, 4),
(1, 'message', 'Mesaj', 'textarea', 'Mesajınızı yazın', true, '[]'::jsonb, '{"minLength": 10}'::jsonb, 5),

-- Teklif Formu Alanları
(2, 'company', 'Şirket Adı', 'text', 'Şirket adınızı girin', true, '[]'::jsonb, '{"minLength": 2}'::jsonb, 1),
(2, 'name', 'İletişim Kişisi', 'text', 'Adınızı ve soyadınızı girin', true, '[]'::jsonb, '{"minLength": 2}'::jsonb, 2),
(2, 'email', 'E-posta', 'email', 'E-posta adresinizi girin', true, '[]'::jsonb, '{"email": true}'::jsonb, 3),
(2, 'phone', 'Telefon', 'tel', 'Telefon numaranızı girin', true, '[]'::jsonb, '{}'::jsonb, 4),
(2, 'project_type', 'Proje Türü', 'select', 'Proje türünü seçin', true, 
 '["Robotik Kaynak", "Lazer Kesim", "Otomasyon Sistemi", "ABB Robot Servisi", "Fronius Servis", "Diğer"]'::jsonb, '{}'::jsonb, 5),
(2, 'description', 'Proje Açıklaması', 'textarea', 'Projenizi detaylı açıklayın', true, '[]'::jsonb, '{"minLength": 20}'::jsonb, 6);

-- Site Stats (Sadece yoksa ekle)
INSERT INTO site_stats (date, visitors, page_views, sessions, bounce_rate, avg_session_duration, new_visitors, returning_visitors) 
SELECT * FROM (VALUES 
('2024-06-20'::date, 180, 245, 195, 0.35, 185, 120, 60),
('2024-06-21'::date, 210, 280, 225, 0.32, 195, 140, 70),
('2024-06-22'::date, 240, 320, 260, 0.28, 220, 160, 80),
('2024-06-23'::date, 220, 290, 240, 0.30, 200, 150, 70)
) AS new_stats(date, visitors, page_views, sessions, bounce_rate, avg_session_duration, new_visitors, returning_visitors)
WHERE NOT EXISTS (SELECT 1 FROM site_stats WHERE site_stats.date = new_stats.date);

-- Traffic Sources (Sadece yoksa ekle)
INSERT INTO traffic_sources (date, source_type, source_name, sessions, users, page_views, bounce_rate) 
SELECT * FROM (VALUES 
('2024-06-23'::date, 'organic', 'Google', 120, 110, 180, 0.25),
('2024-06-23'::date, 'direct', 'Direct Traffic', 65, 60, 85, 0.35),
('2024-06-23'::date, 'social', 'LinkedIn', 20, 18, 25, 0.40),
('2024-06-23'::date, 'referral', 'Partner Sites', 15, 14, 20, 0.30)
) AS new_sources(date, source_type, source_name, sessions, users, page_views, bounce_rate)
WHERE NOT EXISTS (SELECT 1 FROM traffic_sources WHERE traffic_sources.date = new_sources.date AND traffic_sources.source_type = new_sources.source_type AND traffic_sources.source_name = new_sources.source_name);

-- Update sequences (sadece gerekirse)
SELECT setval('site_settings_id_seq', GREATEST((SELECT MAX(id) FROM site_settings), 1));
SELECT setval('seo_settings_id_seq', GREATEST((SELECT MAX(id) FROM seo_settings), 1));
SELECT setval('pages_id_seq', GREATEST((SELECT MAX(id) FROM pages), 14));
SELECT setval('menu_items_id_seq', GREATEST((SELECT MAX(id) FROM menu_items), 16));
SELECT setval('blog_categories_id_seq', GREATEST((SELECT MAX(id) FROM blog_categories), 5));
SELECT setval('blog_posts_id_seq', GREATEST((SELECT MAX(id) FROM blog_posts), 3));
SELECT setval('forms_id_seq', GREATEST((SELECT MAX(id) FROM forms), 3));
SELECT setval('form_fields_id_seq', GREATEST((SELECT MAX(id) FROM form_fields), 20));
SELECT setval('languages_id_seq', GREATEST((SELECT MAX(id) FROM languages), 2));
SELECT setval('site_stats_id_seq', GREATEST((SELECT MAX(id) FROM site_stats), 10));
SELECT setval('traffic_sources_id_seq', GREATEST((SELECT MAX(id) FROM traffic_sources), 10));
