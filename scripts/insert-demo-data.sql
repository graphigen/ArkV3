-- Site Settings
INSERT INTO site_settings (
    id, site_name, site_description, site_url, admin_email, contact_email, 
    phone, address, timezone, language, maintenance_mode, allow_registration,
    require_email_verification, enable_comments, enable_newsletter,
    logo_url, favicon_url, footer_logo_url, social_image_url
) VALUES (
    1, 'ARK KONTROL', 'Endüstriyel Otomasyon ve Robotik Çözümler', 
    'https://arkkontrol.com', 'admin@arkkontrol.com', 'info@arkkontrol.com',
    '+90 212 555 0123', 'İstanbul, Türkiye', 'Europe/Istanbul', 'tr',
    false, false, true, true, true,
    '/logo.png', '/favicon.ico', '/footer-logo.png', '/social-image.jpg'
) ON CONFLICT (id) DO UPDATE SET
    site_name = EXCLUDED.site_name,
    site_description = EXCLUDED.site_description,
    updated_at = CURRENT_TIMESTAMP;

-- Pages (Tüm mevcut sayfalar)
INSERT INTO pages (
    id, title, slug, content, excerpt, status, language, seo_title, seo_description, 
    seo_keywords, og_title, og_description, canonical_url, noindex, template, 
    menu_order, views, published_at
) VALUES 
-- Ana Sayfa
(1, 'Ana Sayfa', '', 
 'ARK KONTROL olarak endüstriyel otomasyon ve robotik çözümler sunuyoruz.',
 'ARK KONTROL ana sayfası', 'published', 'tr',
 'ARK KONTROL - Endüstriyel Otomasyon ve Robotik Çözümler',
 'Endüstriyel otomasyon, robotik kaynak, lazer kesim ve plazma kesim çözümleri. ABB ve Fronius servis hizmetleri.',
 'otomasyon, robotik, endüstri, kaynak, lazer kesim, ABB, Fronius',
 'ARK KONTROL - Endüstriyel Otomasyon', 
 'Türkiye''nin önde gelen endüstriyel otomasyon şirketi',
 'https://arkkontrol.com', false, 'home', 1, 1250, '2024-01-01'),

-- Hakkımızda
(2, 'Hakkımızda', 'hakkimizda',
 'ARK KONTROL, 2010 yılından beri endüstriyel otomasyon alanında hizmet vermektedir.',
 'ARK KONTROL hakkında bilgiler', 'published', 'tr',
 'Hakkımızda - ARK KONTROL', 
 'ARK KONTROL şirketi hakkında detaylı bilgiler, misyon, vizyon ve değerlerimiz.',
 'hakkımızda, şirket, misyon, vizyon, endüstriyel otomasyon',
 'Hakkımızda - ARK KONTROL', 'ARK KONTROL şirketi hakkında',
 'https://arkkontrol.com/hakkimizda', false, 'page', 2, 420, '2024-01-01'),

-- İletişim
(3, 'İletişim', 'iletisim',
 'Bizimle iletişime geçin. Projeleriniz için profesyonel destek alın.',
 'Bizimle iletişime geçin', 'published', 'tr',
 'İletişim - ARK KONTROL',
 'ARK KONTROL iletişim bilgileri, adres, telefon ve e-posta.',
 'iletişim, adres, telefon, e-posta, destek',
 'İletişim - ARK KONTROL', 'ARK KONTROL ile iletişime geçin',
 'https://arkkontrol.com/iletisim', false, 'contact', 3, 280, '2024-01-01'),

-- Ürün Sayfaları
(4, 'Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc',
 'Tiger Torch temizleme üniteleri ile kaynak kalitesini artırın.',
 'Tiger Torch temizleme üniteleri', 'published', 'tr',
 'Tiger Torch Temizleme Üniteleri - ARK KONTROL',
 'Tiger Torch otomatik temizleme üniteleri ile kaynak kalitesini artırın ve üretkenliği yükseltin.',
 'tiger torch, temizleme, kaynak, otomasyon',
 'Tiger Torch Temizleme Üniteleri', 'Kaynak kalitesi için Tiger Torch',
 'https://arkkontrol.com/urunler/tiger-torc', false, 'product', 4, 180, '2024-01-01'),

(5, 'Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf',
 'Yüksek kaliteli plazma kesim sarf malzemeleri ve yedek parçalar.',
 'Plazma kesim sarf malzemeleri', 'published', 'tr',
 'Plazma Kesim Sarf Malzemeleri - ARK KONTROL',
 'Plazma kesim makineleri için orijinal sarf malzemeleri ve yedek parçalar.',
 'plazma kesim, sarf malzeme, yedek parça',
 'Plazma Kesim Sarf Malzemeleri', 'Kaliteli plazma sarf malzemeleri',
 'https://arkkontrol.com/urunler/plazma-sarf', false, 'product', 5, 150, '2024-01-01'),

(6, 'ABB Robot Servis ve Bakım', 'urunler/abb-servis',
 'ABB robotları için profesyonel servis ve bakım hizmetleri.',
 'ABB robot servis hizmetleri', 'published', 'tr',
 'ABB Robot Servis ve Bakım - ARK KONTROL',
 'ABB endüstriyel robotları için uzman servis, bakım ve yedek parça hizmetleri.',
 'ABB robot, servis, bakım, endüstriyel robot',
 'ABB Robot Servis', 'ABB robotları için uzman servis',
 'https://arkkontrol.com/urunler/abb-servis', false, 'service', 6, 200, '2024-01-01'),

(7, 'Fronius Kaynak Makina Servis', 'urunler/fronius-servis',
 'Fronius kaynak makineleri için uzman servis ve yedek parça hizmetleri.',
 'Fronius servis hizmetleri', 'published', 'tr',
 'Fronius Kaynak Makina Servis - ARK KONTROL',
 'Fronius kaynak makineleri için profesyonel servis, bakım ve yedek parça hizmetleri.',
 'Fronius, kaynak makinesi, servis, bakım',
 'Fronius Servis', 'Fronius kaynak makineleri servisi',
 'https://arkkontrol.com/urunler/fronius-servis', false, 'service', 7, 160, '2024-01-01'),

-- Proje Sayfaları
(8, 'Pozisyoner Sistemleri', 'projeler/pozisyoner',
 'Kaynak işlemleri için özel tasarım pozisyoner sistemleri.',
 'Pozisyoner sistemleri', 'published', 'tr',
 'Pozisyoner Sistemleri - ARK KONTROL',
 'Kaynak işlemleri için özel tasarım pozisyoner sistemleri ve döner tablalar.',
 'pozisyoner, kaynak, döner tabla, otomasyon',
 'Pozisyoner Sistemleri', 'Kaynak için pozisyoner çözümleri',
 'https://arkkontrol.com/projeler/pozisyoner', false, 'project', 8, 120, '2024-01-01'),

(9, 'Robotik Slider Sistemleri', 'projeler/slider',
 'Robot hareketliliği için lineer slider sistemleri.',
 'Robotik slider sistemleri', 'published', 'tr',
 'Robotik Slider Sistemleri - ARK KONTROL',
 'Endüstriyel robotlar için lineer hareket sağlayan slider sistemleri.',
 'robotik slider, lineer hareket, robot ray',
 'Robotik Slider Sistemleri', 'Robot hareketliliği için slider',
 'https://arkkontrol.com/projeler/slider', false, 'project', 9, 95, '2024-01-01'),

(10, 'Mekanize Çözümler', 'projeler/mekanize',
 'Endüstriyel üretim için özel mekanize çözümler.',
 'Mekanize çözümler', 'published', 'tr',
 'Mekanize Çözümler - ARK KONTROL',
 'Endüstriyel üretim süreçleri için özel tasarım mekanize çözümler.',
 'mekanize, otomasyon, üretim, endüstri',
 'Mekanize Çözümler', 'Endüstriyel mekanize sistemler',
 'https://arkkontrol.com/projeler/mekanize', false, 'project', 10, 140, '2024-01-01'),

(11, 'Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak',
 'Tam otomatik robotik kaynak hücreleri ve sistemleri.',
 'Robotik kaynak hücreleri', 'published', 'tr',
 'Robotik Kaynak Hücreleri - ARK KONTROL',
 'Tam otomatik robotik kaynak hücreleri, kaynak robotları ve otomasyon sistemleri.',
 'robotik kaynak, kaynak robotu, otomasyon, kaynak hücresi',
 'Robotik Kaynak Hücreleri', 'Otomatik kaynak çözümleri',
 'https://arkkontrol.com/projeler/robotik-kaynak', false, 'project', 11, 220, '2024-01-01'),

(12, 'Lazer Kesim Tezgahları', 'projeler/lazer-kesim',
 'Yüksek hassasiyetli lazer kesim tezgahları ve sistemleri.',
 'Lazer kesim tezgahları', 'published', 'tr',
 'Lazer Kesim Tezgahları - ARK KONTROL',
 'Endüstriyel lazer kesim tezgahları, fiber lazer sistemleri ve otomasyon çözümleri.',
 'lazer kesim, fiber lazer, kesim tezgahı',
 'Lazer Kesim Tezgahları', 'Hassas lazer kesim çözümleri',
 'https://arkkontrol.com/projeler/lazer-kesim', false, 'project', 12, 180, '2024-01-01'),

(13, 'Fikstur Sistemleri', 'projeler/fikstur',
 'Kaynak ve montaj işlemleri için özel fikstur sistemleri.',
 'Fikstur sistemleri', 'published', 'tr',
 'Fikstur Sistemleri - ARK KONTROL',
 'Kaynak ve montaj işlemleri için özel tasarım fikstur sistemleri ve aparatlar.',
 'fikstur, kaynak aparatı, montaj, otomasyon',
 'Fikstur Sistemleri', 'Kaynak için fikstur çözümleri',
 'https://arkkontrol.com/projeler/fikstur', false, 'project', 13, 110, '2024-01-01'),

-- Blog Sayfası
(14, 'Blog', 'blog',
 'Endüstriyel otomasyon ve teknoloji hakkında güncel yazılar.',
 'ARK KONTROL blog sayfası', 'published', 'tr',
 'Blog - ARK KONTROL',
 'Endüstriyel otomasyon, robotik teknolojiler ve sektör haberleri.',
 'blog, otomasyon, teknoloji, sektör haberleri',
 'ARK KONTROL Blog', 'Otomasyon ve teknoloji blog',
 'https://arkkontrol.com/blog', false, 'blog', 14, 95, '2024-01-01')

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = CURRENT_TIMESTAMP;

-- Menu Items (Header Menüsü)
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
(16, 'header', 'Lazer Kesim Tezgahları', '/projeler/lazer-kesim', 12, 3, 6, '_self', '', '', true, 'tr', 'public')

ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    url = EXCLUDED.url,
    updated_at = CURRENT_TIMESTAMP;

-- Blog Categories
INSERT INTO blog_categories (id, name, slug, description, color, is_active, language) VALUES 
(1, 'Otomasyon', 'otomasyon', 'Endüstriyel otomasyon haberleri', '#3B82F6', true, 'tr'),
(2, 'Robotik', 'robotik', 'Robotik teknolojiler', '#10B981', true, 'tr'),
(3, 'Kaynak Teknolojileri', 'kaynak-teknolojileri', 'Kaynak teknolojileri ve yenilikler', '#F59E0B', true, 'tr'),
(4, 'Lazer Kesim', 'lazer-kesim', 'Lazer kesim teknolojileri', '#EF4444', true, 'tr'),
(5, 'Sektör Haberleri', 'sektor-haberleri', 'Endüstri sektör haberleri', '#8B5CF6', true, 'tr')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Blog Posts
INSERT INTO blog_posts (
    id, title, slug, content, excerpt, status, author_id, category_id, 
    featured_image, tags, seo_title, seo_description, published_at, language
) VALUES 
(1, 'Endüstriyel Otomasyonun Geleceği', 'endustriyel-otomasyonun-gelecegi',
 'Endüstriyel otomasyon teknolojilerinin gelişimi ve geleceğe dair öngörüler...',
 'Endüstriyel otomasyonun gelecekteki rolü ve teknolojik gelişmeler',
 'published', 1, 1, '/blog/otomasyon-gelecek.jpg', 
 '["otomasyon", "gelecek", "teknoloji", "endüstri"]',
 'Endüstriyel Otomasyonun Geleceği - ARK KONTROL Blog',
 'Endüstriyel otomasyon teknolojilerinin geleceği ve sektöre etkileri hakkında detaylı analiz.',
 '2024-01-15', 'tr'),

(2, 'Robotik Kaynak Sistemlerinde Yenilikler', 'robotik-kaynak-sistemlerinde-yenilikler',
 'Modern robotik kaynak sistemlerinin avantajları ve uygulama alanları...',
 'Robotik kaynak teknolojilerindeki son gelişmeler',
 'published', 1, 2, '/blog/robotik-kaynak.jpg',
 '["robotik", "kaynak", "otomasyon", "teknoloji"]',
 'Robotik Kaynak Sistemlerinde Yenilikler - ARK KONTROL',
 'Robotik kaynak sistemlerindeki yenilikler ve endüstriyel uygulamalar.',
 '2024-01-20', 'tr'),

(3, 'Lazer Kesim Teknolojisinin Avantajları', 'lazer-kesim-teknolojisinin-avantajlari',
 'Lazer kesim teknolojisinin geleneksel yöntemlere göre avantajları...',
 'Lazer kesim teknolojisinin endüstriyel faydaları',
 'published', 1, 4, '/blog/lazer-kesim.jpg',
 '["lazer kesim", "teknoloji", "avantajlar", "endüstri"]',
 'Lazer Kesim Teknolojisinin Avantajları - ARK KONTROL',
 'Lazer kesim teknolojisinin endüstriyel uygulamalardaki avantajları ve faydaları.',
 '2024-01-25', 'tr')

ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;

-- Forms
INSERT INTO forms (
    id, name, title, description, slug, status, submit_message, 
    email_notifications, notification_emails, store_submissions
) VALUES 
(1, 'contact_form', 'İletişim Formu', 'Genel iletişim formu', 'iletisim', 'active',
 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
 true, '["info@arkkontrol.com"]', true),

(2, 'quote_form', 'Teklif Formu', 'Proje teklif formu', 'teklif', 'active',
 'Teklif talebiniz alındı. Uzmanlarımız en kısa sürede sizinle iletişime geçecek.',
 true, '["sales@arkkontrol.com"]', true),

(3, 'service_form', 'Servis Talep Formu', 'Teknik servis talep formu', 'servis', 'active',
 'Servis talebiniz kaydedildi. Teknik ekibimiz sizinle iletişime geçecek.',
 true, '["service@arkkontrol.com"]', true)

ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Form Fields
INSERT INTO form_fields (
    form_id, name, type, label, placeholder, required, options, order_index
) VALUES 
-- İletişim Formu Alanları
(1, 'name', 'text', 'Ad Soyad', 'Adınızı ve soyadınızı girin', true, NULL, 1),
(1, 'email', 'email', 'E-posta', 'E-posta adresinizi girin', true, NULL, 2),
(1, 'phone', 'tel', 'Telefon', 'Telefon numaranızı girin', false, NULL, 3),
(1, 'subject', 'text', 'Konu', 'Mesaj konusunu girin', true, NULL, 4),
(1, 'message', 'textarea', 'Mesaj', 'Mesajınızı yazın', true, NULL, 5),

-- Teklif Formu Alanları
(2, 'company', 'text', 'Şirket Adı', 'Şirket adınızı girin', true, NULL, 1),
(2, 'name', 'text', 'İletişim Kişisi', 'Adınızı ve soyadınızı girin', true, NULL, 2),
(2, 'email', 'email', 'E-posta', 'E-posta adresinizi girin', true, NULL, 3),
(2, 'phone', 'tel', 'Telefon', 'Telefon numaranızı girin', true, NULL, 4),
(2, 'project_type', 'select', 'Proje Türü', 'Proje türünü seçin', true, 
 '["Robotik Kaynak", "Lazer Kesim", "Otomasyon", "Servis", "Diğer"]', 5),
(2, 'description', 'textarea', 'Proje Açıklaması', 'Projenizi detaylı açıklayın', true, NULL, 6)

ON CONFLICT (form_id, name) DO UPDATE SET label = EXCLUDED.label;

-- SEO Settings
INSERT INTO seo_settings (
    id, site_name, site_description, default_og_image, google_analytics_id,
    robots_txt, enable_breadcrumbs, enable_schema_markup, enable_open_graph
) VALUES (
    1, 'ARK KONTROL', 
    'Endüstriyel otomasyon ve robotik çözümler. Tiger Torch, ABB-Fronius servis, lazer kesim ve kaynak sistemleri.',
    '/social-image.jpg', 'GA-XXXXXXXXX',
    'User-agent: *\nAllow: /\nSitemap: https://arkkontrol.com/sitemap.xml',
    true, true, true
) ON CONFLICT (id) DO UPDATE SET site_name = EXCLUDED.site_name;

-- Analytics Data
INSERT INTO site_stats (date, page_views, unique_visitors, bounce_rate, avg_session_duration) VALUES 
('2024-06-20', 245, 180, 0.35, 185),
('2024-06-21', 280, 210, 0.32, 195),
('2024-06-22', 320, 240, 0.28, 220),
('2024-06-23', 290, 220, 0.30, 200)
ON CONFLICT (date) DO UPDATE SET page_views = EXCLUDED.page_views;

-- Traffic Sources
INSERT INTO traffic_sources (date, source, visitors, percentage) VALUES 
('2024-06-23', 'Organic Search', 120, 0.55),
('2024-06-23', 'Direct', 65, 0.30),
('2024-06-23', 'Social Media', 20, 0.09),
('2024-06-23', 'Referral', 15, 0.06)
ON CONFLICT (date, source) DO UPDATE SET visitors = EXCLUDED.visitors;

-- Languages
INSERT INTO languages (id, code, name, native_name, flag_emoji, is_active, is_default, sort_order) VALUES 
(1, 'tr', 'Turkish', 'Türkçe', '🇹🇷', true, true, 1),
(2, 'en', 'English', 'English', '🇺🇸', false, false, 2)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Update sequences
SELECT setval('pages_id_seq', (SELECT MAX(id) FROM pages));
SELECT setval('menu_items_id_seq', (SELECT MAX(id) FROM menu_items));
SELECT setval('blog_categories_id_seq', (SELECT MAX(id) FROM blog_categories));
SELECT setval('blog_posts_id_seq', (SELECT MAX(id) FROM blog_posts));
SELECT setval('forms_id_seq', (SELECT MAX(id) FROM forms));
SELECT setval('languages_id_seq', (SELECT MAX(id) FROM languages));
