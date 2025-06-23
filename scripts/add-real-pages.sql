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
INSERT INTO pages (title, slug, content, excerpt, status, language, seo_title, seo_description, seo_keywords, template, menu_order, views, published_at, author_id) VALUES
('Ana Sayfa', '', 'ARK KONTROL ana sayfa içeriği', 'Endüstriyel otomasyon ve robotik çözümler', 'published', 'tr', 'ARK KONTROL - Endüstriyel Otomasyon', 'Endüstriyel otomasyon, robotik kaynak, lazer kesim ve pozisyoner çözümleri', 'otomasyon,robotik,endüstri,kaynak,lazer', 'home', 1, 1250, CURRENT_TIMESTAMP, 1),
('Hakkımızda', 'hakkimizda', 'ARK KONTROL hakkında detaylı bilgiler', 'Şirketimiz hakkında', 'published', 'tr', 'Hakkımızda - ARK KONTROL', 'ARK KONTROL şirketi hakkında detaylı bilgiler', 'hakkımızda,şirket,tarihçe', 'page', 2, 420, CURRENT_TIMESTAMP, 1),
('İletişim', 'iletisim', 'İletişim bilgileri ve form', 'Bizimle iletişime geçin', 'published', 'tr', 'İletişim - ARK KONTROL', 'ARK KONTROL iletişim bilgileri ve iletişim formu', 'iletişim,adres,telefon', 'contact', 3, 280, CURRENT_TIMESTAMP, 1),
('Tiger Torch Plazma Torç', 'urunler/tiger-torc', 'Tiger Torch plazma torç ürün detayları', 'Yüksek kaliteli plazma torç çözümleri', 'published', 'tr', 'Tiger Torch Plazma Torç - ARK KONTROL', 'Tiger Torch plazma torç ürünleri ve teknik özellikleri', 'plazma,torç,tiger,kesim', 'product', 10, 180, CURRENT_TIMESTAMP, 1),
('Plazma Sarf Malzemeleri', 'urunler/plazma-sarf', 'Plazma sarf malzemeleri ve yedek parçalar', 'Kaliteli plazma sarf malzemeleri', 'published', 'tr', 'Plazma Sarf Malzemeleri - ARK KONTROL', 'Plazma kesim sarf malzemeleri ve yedek parçalar', 'plazma,sarf,malzeme,yedek', 'product', 11, 150, CURRENT_TIMESTAMP, 1),
('ABB Robot Servisi', 'urunler/abb-servis', 'ABB robot servis ve bakım hizmetleri', 'Profesyonel ABB robot servisi', 'published', 'tr', 'ABB Robot Servisi - ARK KONTROL', 'ABB robot servis, bakım ve onarım hizmetleri', 'abb,robot,servis,bakım', 'service', 12, 200, CURRENT_TIMESTAMP, 1),
('Fronius Servis', 'urunler/fronius-servis', 'Fronius kaynak makinesi servis hizmetleri', 'Fronius servis ve bakım', 'published', 'tr', 'Fronius Servis - ARK KONTROL', 'Fronius kaynak makinesi servis ve bakım hizmetleri', 'fronius,servis,kaynak,bakım', 'service', 13, 160, CURRENT_TIMESTAMP, 1),
('Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Pozisyoner sistem projeleri', 'Özel pozisyoner çözümleri', 'published', 'tr', 'Pozisyoner Sistemleri - ARK KONTROL', 'Endüstriyel pozisyoner sistem projeleri ve çözümleri', 'pozisyoner,sistem,proje', 'project', 20, 120, CURRENT_TIMESTAMP, 1),
('Slider Sistemleri', 'projeler/slider', 'Slider sistem projeleri', 'Özel slider çözümleri', 'published', 'tr', 'Slider Sistemleri - ARK KONTROL', 'Endüstriyel slider sistem projeleri', 'slider,sistem,proje', 'project', 21, 95, CURRENT_TIMESTAMP, 1),
('Mekanize Sistemler', 'projeler/mekanize', 'Mekanize sistem projeleri', 'Otomasyon çözümleri', 'published', 'tr', 'Mekanize Sistemler - ARK KONTROL', 'Mekanize sistem projeleri ve otomasyon çözümleri', 'mekanize,otomasyon,sistem', 'project', 22, 140, CURRENT_TIMESTAMP, 1),
('Robotik Kaynak', 'projeler/robotik-kaynak', 'Robotik kaynak sistem projeleri', 'Robotik kaynak çözümleri', 'published', 'tr', 'Robotik Kaynak - ARK KONTROL', 'Robotik kaynak sistem projeleri ve çözümleri', 'robotik,kaynak,sistem', 'project', 23, 220, CURRENT_TIMESTAMP, 1),
('Lazer Kesim', 'projeler/lazer-kesim', 'Lazer kesim sistem projeleri', 'Lazer kesim çözümleri', 'published', 'tr', 'Lazer Kesim - ARK KONTROL', 'Lazer kesim sistem projeleri ve çözümleri', 'lazer,kesim,sistem', 'project', 24, 180, CURRENT_TIMESTAMP, 1),
('Fikstur Sistemleri', 'projeler/fikstur', 'Fikstur sistem projeleri', 'Özel fikstur çözümleri', 'published', 'tr', 'Fikstur Sistemleri - ARK KONTROL', 'Fikstur sistem projeleri ve özel çözümler', 'fikstur,sistem,proje', 'project', 25, 110, CURRENT_TIMESTAMP, 1)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  content = EXCLUDED.content,
  excerpt = EXCLUDED.excerpt,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  seo_keywords = EXCLUDED.seo_keywords,
  author_id = EXCLUDED.author_id, -- Ensure author_id is also updated if necessary
  updated_at = CURRENT_TIMESTAMP;

-- Ana menü öğelerini ekle
INSERT INTO menu_items (menu_location, title, url, page_id, menu_order, target, is_active, language) VALUES
('main', 'Ana Sayfa', '/', (SELECT id from pages WHERE slug='' AND language='tr'), 1, '_self', true, 'tr'),
('main', 'Hakkımızda', '/hakkimizda', (SELECT id from pages WHERE slug='hakkimizda' AND language='tr'), 2, '_self', true, 'tr'),
('main', 'Ürünler', '#', NULL, 3, '_self', true, 'tr'),
('main', 'Projeler', '#', NULL, 4, '_self', true, 'tr'),
('main', 'İletişim', '/iletisim', (SELECT id from pages WHERE slug='iletisim' AND language='tr'), 5, '_self', true, 'tr')
ON CONFLICT (menu_location, title, language, COALESCE(url, ''), COALESCE(page_id, -1), COALESCE(parent_id, -1)) DO NOTHING;


-- Alt menü öğelerini ekle (Ürünler)
-- Önce parent 'Ürünler' menu item'ının var olduğundan emin olalım veya ID'sini alalım
WITH parent_urunler AS (
  SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'main' AND language = 'tr' AND parent_id IS NULL LIMIT 1
)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language) VALUES
('main', 'Tiger Torch', '/urunler/tiger-torc', (SELECT id from pages WHERE slug='urunler/tiger-torc' AND language='tr'), (SELECT id FROM parent_urunler), 1, '_self', true, 'tr'),
('main', 'Plazma Sarf', '/urunler/plazma-sarf', (SELECT id from pages WHERE slug='urunler/plazma-sarf' AND language='tr'), (SELECT id FROM parent_urunler), 2, '_self', true, 'tr'),
('main', 'ABB Servis', '/urunler/abb-servis', (SELECT id from pages WHERE slug='urunler/abb-servis' AND language='tr'), (SELECT id FROM parent_urunler), 3, '_self', true, 'tr'),
('main', 'Fronius Servis', '/urunler/fronius-servis', (SELECT id from pages WHERE slug='urunler/fronius-servis' AND language='tr'), (SELECT id FROM parent_urunler), 4, '_self', true, 'tr')
ON CONFLICT (menu_location, title, language, COALESCE(url, ''), COALESCE(page_id, -1), COALESCE(parent_id, -1)) DO NOTHING;


-- Alt menü öğelerini ekle (Projeler)
-- Önce parent 'Projeler' menu item'ının var olduğundan emin olalım veya ID'sini alalım
WITH parent_projeler AS (
  SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'main' AND language = 'tr' AND parent_id IS NULL LIMIT 1
)
INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language) VALUES
('main', 'Pozisyoner', '/projeler/pozisyoner', (SELECT id from pages WHERE slug='projeler/pozisyoner' AND language='tr'), (SELECT id FROM parent_projeler), 1, '_self', true, 'tr'),
('main', 'Slider', '/projeler/slider', (SELECT id from pages WHERE slug='projeler/slider' AND language='tr'), (SELECT id FROM parent_projeler), 2, '_self', true, 'tr'),
('main', 'Mekanize', '/projeler/mekanize', (SELECT id from pages WHERE slug='projeler/mekanize' AND language='tr'), (SELECT id FROM parent_projeler), 3, '_self', true, 'tr'),
('main', 'Robotik Kaynak', '/projeler/robotik-kaynak', (SELECT id from pages WHERE slug='projeler/robotik-kaynak' AND language='tr'), (SELECT id FROM parent_projeler), 4, '_self', true, 'tr'),
('main', 'Lazer Kesim', '/projeler/lazer-kesim', (SELECT id from pages WHERE slug='projeler/lazer-kesim' AND language='tr'), (SELECT id FROM parent_projeler), 5, '_self', true, 'tr'),
('main', 'Fikstur', '/projeler/fikstur', (SELECT id from pages WHERE slug='projeler/fikstur' AND language='tr'), (SELECT id FROM parent_projeler), 6, '_self', true, 'tr')
ON CONFLICT (menu_location, title, language, COALESCE(url, ''), COALESCE(page_id, -1), COALESCE(parent_id, -1)) DO NOTHING;
