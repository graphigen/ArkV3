-- Mevcut site sayfalarını veritabanına ekle
INSERT INTO pages (title, slug, content, status, language, seo_title, seo_description, template, menu_order, created_at, updated_at) VALUES
('Ana Sayfa', '/', '{"type":"homepage","sections":[{"type":"hero","title":"ARK KONTROL","subtitle":"Endüstriyel Otomasyon ve Robotik Kaynak Sistemleri","description":"Türkiye''nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı","cta":"Projelerimizi İnceleyin","image":"/images/hero-bg.jpg"}]}', 'published', 'tr', 'ARK KONTROL - Endüstriyel Otomasyon ve Robotik Kaynak Sistemleri', 'Türkiye''nin önde gelen endüstriyel otomasyon firması. Robotik kaynak, lazer kesim, fikstur sistemleri ve ABB-Fronius servis hizmetleri.', 'homepage', 1, NOW(), NOW()),

('Hakkımızda', '/hakkimizda', '{"type":"page","sections":[{"type":"content","title":"Hakkımızda","content":"ARK KONTROL olarak, endüstriyel otomasyon alanında 15 yılı aşkın deneyimimizle..."}]}', 'published', 'tr', 'Hakkımızda | ARK KONTROL', 'ARK KONTROL hakkında detaylı bilgi, misyon, vizyon ve değerlerimiz.', 'page', 2, NOW(), NOW()),

('İletişim', '/iletisim', '{"type":"contact","sections":[{"type":"contact_form","title":"İletişim","content":"Bizimle iletişime geçin"}]}', 'published', 'tr', 'İletişim | ARK KONTROL', 'ARK KONTROL ile iletişime geçin. Adres, telefon ve e-posta bilgileri.', 'contact', 3, NOW(), NOW()),

('Blog', '/blog', '{"type":"blog_index","sections":[{"type":"blog_list","title":"Blog","content":"Son yazılarımız"}]}', 'published', 'tr', 'Blog | ARK KONTROL', 'Endüstriyel otomasyon, robotik kaynak ve teknoloji hakkında blog yazıları.', 'blog', 4, NOW(), NOW()),

-- Proje sayfaları
('Robotik Kaynak', '/projeler/robotik-kaynak', '{"type":"project","sections":[{"type":"project_detail","title":"Robotik Kaynak Sistemleri","content":"ABB ve KUKA robotları ile otomatik kaynak sistemleri"}]}', 'published', 'tr', 'Robotik Kaynak Sistemleri | ARK KONTROL', 'ABB ve KUKA robotları ile otomatik kaynak sistemleri ve çözümleri.', 'project', 5, NOW(), NOW()),

('Lazer Kesim', '/projeler/lazer-kesim', '{"type":"project","sections":[{"type":"project_detail","title":"Lazer Kesim Teknolojisi","content":"Hassas lazer kesim teknolojisi ile metal işleme"}]}', 'published', 'tr', 'Lazer Kesim Teknolojisi | ARK KONTROL', 'Hassas lazer kesim teknolojisi ile metal işleme çözümleri.', 'project', 6, NOW(), NOW()),

('Fikstur Sistemleri', '/projeler/fikstur', '{"type":"project","sections":[{"type":"project_detail","title":"Fikstur Sistemleri","content":"Özel tasarım fikstur ve sabitleme sistemleri"}]}', 'published', 'tr', 'Fikstur Sistemleri | ARK KONTROL', 'Özel tasarım fikstur ve sabitleme sistemleri.', 'project', 7, NOW(), NOW()),

('Pozisyoner', '/projeler/pozisyoner', '{"type":"project","sections":[{"type":"project_detail","title":"Pozisyoner Sistemler","content":"Kaynak pozisyoner ve döner tabla sistemleri"}]}', 'published', 'tr', 'Pozisyoner Sistemler | ARK KONTROL', 'Kaynak pozisyoner ve döner tabla sistemleri.', 'project', 8, NOW(), NOW()),

('Slider Sistemler', '/projeler/slider', '{"type":"project","sections":[{"type":"project_detail","title":"Slider Sistemler","content":"Lineer hareket sistemleri ve slider çözümleri"}]}', 'published', 'tr', 'Slider Sistemler | ARK KONTROL', 'Lineer hareket sistemleri ve slider çözümleri.', 'project', 9, NOW(), NOW()),

('Mekanize Sistemler', '/projeler/mekanize', '{"type":"project","sections":[{"type":"project_detail","title":"Mekanize Sistemler","content":"Tam otomatik mekanize üretim sistemleri"}]}', 'published', 'tr', 'Mekanize Sistemler | ARK KONTROL', 'Tam otomatik mekanize üretim sistemleri.', 'project', 10, NOW(), NOW()),

-- Ürün sayfaları
('ABB Servis', '/urunler/abb-servis', '{"type":"product","sections":[{"type":"product_detail","title":"ABB Robot Servis","content":"ABB robotları için profesyonel servis hizmetleri"}]}', 'published', 'tr', 'ABB Robot Servis | ARK KONTROL', 'ABB robotları için profesyonel servis, bakım ve onarım hizmetleri.', 'product', 11, NOW(), NOW()),

('Fronius Servis', '/urunler/fronius-servis', '{"type":"product","sections":[{"type":"product_detail","title":"Fronius Servis","content":"Fronius kaynak makinaları servis hizmetleri"}]}', 'published', 'tr', 'Fronius Servis | ARK KONTROL', 'Fronius kaynak makinaları için servis, bakım ve onarım hizmetleri.', 'product', 12, NOW(), NOW()),

('Tiger Torch', '/urunler/tiger-torc', '{"type":"product","sections":[{"type":"product_detail","title":"Tiger Torch Plazma","content":"Tiger Torch plazma kesim sistemleri"}]}', 'published', 'tr', 'Tiger Torch Plazma | ARK KONTROL', 'Tiger Torch plazma kesim sistemleri ve çözümleri.', 'product', 13, NOW(), NOW()),

('Plazma Sarf Malzemeleri', '/urunler/plazma-sarf', '{"type":"product","sections":[{"type":"product_detail","title":"Plazma Sarf Malzemeleri","content":"Plazma kesim sarf malzemeleri ve yedek parçalar"}]}', 'published', 'tr', 'Plazma Sarf Malzemeleri | ARK KONTROL', 'Plazma kesim sarf malzemeleri ve yedek parçalar.', 'product', 14, NOW(), NOW())

ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    seo_title = EXCLUDED.seo_title,
    seo_description = EXCLUDED.seo_description,
    updated_at = NOW();
