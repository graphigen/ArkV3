-- Site ayarlarını ekle
INSERT INTO site_settings (
  site_name, site_description, site_url, admin_email, contact_email, 
  phone, address, timezone, language, maintenance_mode, 
  allow_registration, require_email_verification, enable_comments, 
  enable_newsletter, logo_url, favicon_url
) VALUES (
  'ARK KONTROL', 
  'Endüstriyel Otomasyon ve Robotik Çözümler', 
  'https://arkkontrol.com',
  'admin@arkkontrol.com',
  'info@arkkontrol.com',
  '+90 212 555 0123',
  'İstanbul, Türkiye',
  'Europe/Istanbul',
  'tr',
  false,
  false,
  true,
  true,
  true,
  '/logo.png',
  '/favicon.ico'
) ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  site_description = EXCLUDED.site_description,
  updated_at = CURRENT_TIMESTAMP;

-- Mevcut sayfaları ekle
INSERT INTO pages (title, slug, content, excerpt, status, language, seo_title, seo_description, seo_keywords, template, menu_order, views, published_at) VALUES
('Ana Sayfa', '', 'ARK KONTROL ana sayfa içeriği', 'Endüstriyel otomasyon ve robotik çözümler', 'published', 'tr', 'ARK KONTROL - Endüstriyel Otomasyon', 'Endüstriyel otomasyon, robotik kaynak, lazer kesim ve pozisyoner çözümleri', 'otomasyon,robotik,endüstri,kaynak,lazer', 'home', 1, 1250, CURRENT_TIMESTAMP),

('Hakkımızda', 'hakkimizda', 'ARK KONTROL hakkında detaylı bilgiler', 'Şirketimiz hakkında', 'published', 'tr', 'Hakkımızda - ARK KONTROL', 'ARK KONTROL şirketi hakkında detaylı bilgiler', 'hakkımızda,şirket,tarihçe', 'page', 2, 420, CURRENT_TIMESTAMP),

('İletişim', 'iletisim', 'İletişim bilgileri ve form', 'Bizimle iletişime geçin', 'published', 'tr', 'İletişim - ARK KONTROL', 'ARK KONTROL iletişim bilgileri ve iletişim formu', 'iletişim,adres,telefon', 'contact', 3, 280, CURRENT_TIMESTAMP),

-- Ürün Sayfaları
('Tiger Torch Plazma Torç', 'urunler/tiger-torc', 'Tiger Torch plazma torç ürün detayları', 'Yüksek kaliteli plazma torç çözümleri', 'published', 'tr', 'Tiger Torch Plazma Torç - ARK KONTROL', 'Tiger Torch plazma torç ürünleri ve teknik özellikleri', 'plazma,torç,tiger,kesim', 'product', 10, 180, CURRENT_TIMESTAMP),

('Plazma Sarf Malzemeleri', 'urunler/plazma-sarf', 'Plazma sarf malzemeleri ve yedek parçalar', 'Kaliteli plazma sarf malzemeleri', 'published', 'tr', 'Plazma Sarf Malzemeleri - ARK KONTROL', 'Plazma kesim sarf malzemeleri ve yedek parçalar', 'plazma,sarf,malzeme,yedek', 'product', 11, 150, CURRENT_TIMESTAMP),

('ABB Robot Servisi', 'urunler/abb-servis', 'ABB robot servis ve bakım hizmetleri', 'Profesyonel ABB robot servisi', 'published', 'tr', 'ABB Robot Servisi - ARK KONTROL', 'ABB robot servis, bakım ve onarım hizmetleri', 'abb,robot,servis,bakım', 'service', 12, 200, CURRENT_TIMESTAMP),

('Fronius Servis', 'urunler/fronius-servis', 'Fronius kaynak makinesi servis hizmetleri', 'Fronius servis ve bakım', 'published', 'tr', 'Fronius Servis - ARK KONTROL', 'Fronius kaynak makinesi servis ve bakım hizmetleri', 'fronius,servis,kaynak,bakım', 'service', 13, 160, CURRENT_TIMESTAMP),

-- Proje Sayfaları
('Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Pozisyoner sistem projeleri', 'Özel pozisyoner çözümleri', 'published', 'tr', 'Pozisyoner Sistemleri - ARK KONTROL', 'Endüstriyel pozisyoner sistem projeleri ve çözümleri', 'pozisyoner,sistem,proje', 'project', 20, 120, CURRENT_TIMESTAMP),

('Slider Sistemleri', 'projeler/slider', 'Slider sistem projeleri', 'Özel slider çözümleri', 'published', 'tr', 'Slider Sistemleri - ARK KONTROL', 'Endüstriyel slider sistem projeleri', 'slider,sistem,proje', 'project', 21, 95, CURRENT_TIMESTAMP),

('Mekanize Sistemler', 'projeler/mekanize', 'Mekanize sistem projeleri', 'Otomasyon çözümleri', 'published', 'tr', 'Mekanize Sistemler - ARK KONTROL', 'Mekanize sistem projeleri ve otomasyon çözümleri', 'mekanize,otomasyon,sistem', 'project', 22, 140, CURRENT_TIMESTAMP),

('Robotik Kaynak', 'projeler/robotik-kaynak', 'Robotik kaynak sistem projeleri', 'Robotik kaynak çözümleri', 'published', 'tr', 'Robotik Kaynak - ARK KONTROL', 'Robotik kaynak sistem projeleri ve çözümleri', 'robotik,kaynak,sistem', 'project', 23, 220, CURRENT_TIMESTAMP),

('Lazer Kesim', 'projeler/lazer-kesim', 'Lazer kesim sistem projeleri', 'Lazer kesim çözümleri', 'published', 'tr', 'Lazer Kesim - ARK KONTROL', 'Lazer kesim sistem projeleri ve çözümleri', 'lazer,kesim,sistem', 'project', 24, 180, CURRENT_TIMESTAMP),

('Fikstur Sistemleri', 'projeler/fikstur', 'Fikstur sistem projeleri', 'Özel fikstur çözümleri', 'published', 'tr', 'Fikstur Sistemleri - ARK KONTROL', 'Fikstur sistem projeleri ve özel çözümler', 'fikstur,sistem,proje', 'project', 25, 110, CURRENT_TIMESTAMP)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  updated_at = CURRENT_TIMESTAMP;

-- Ana menü öğelerini ekle
INSERT INTO menu_items (menu_location, title, url, page_id, menu_order, target, is_active, language) VALUES
('main', 'Ana Sayfa', '/', 1, 1, '_self', true, 'tr'),
('main', 'Hakkımızda', '/hakkimizda', 2, 2, '_self', true, 'tr'),
('main', 'Ürünler', '#', NULL, 3, '_self', true, 'tr'),
('main', 'Projeler', '#', NULL, 4, '_self', true, 'tr'),
('main', 'İletişim', '/iletisim', 3, 5, '_self', true, 'tr')
ON CONFLICT DO NOTHING;

-- Alt menü öğelerini ekle (Ürünler)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language) VALUES
('main', 'Tiger Torch', '/urunler/tiger-torc', 4, (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'main'), 1, '_self', true, 'tr'),
('main', 'Plazma Sarf', '/urunler/plazma-sarf', 5, (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'main'), 2, '_self', true, 'tr'),
('main', 'ABB Servis', '/urunler/abb-servis', 6, (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'main'), 3, '_self', true, 'tr'),
('main', 'Fronius Servis', '/urunler/fronius-servis', 7, (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'main'), 4, '_self', true, 'tr')
ON CONFLICT DO NOTHING;

-- Alt menü öğelerini ekle (Projeler)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language) VALUES
('main', 'Pozisyoner', '/projeler/pozisyoner', 8, (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main'), 1, '_self', true, 'tr'),
('main', 'Slider', '/projeler/slider', 9, (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main'), 2, '_self', true, 'tr'),
('main', 'Mekanize', '/projeler/mekanize', 10, (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main'), 3, '_self', true, 'tr'),
('main', 'Robotik Kaynak', '/projeler/robotik-kaynak', 11, (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main'), 4, '_self', true, 'tr'),
('main', 'Lazer Kesim', '/projeler/lazer-kesim', 12, (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main'), 5, '_self', true, 'tr'),
('main', 'Fikstur', '/projeler/fikstur', 13, (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main'), 6, '_self', true, 'tr')
ON CONFLICT DO NOTHING;
