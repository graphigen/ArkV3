-- ARK KONTROL Ultimate Demo Data Script
-- Bu script tablo yapısına göre dinamik olarak çalışır

-- 1. Site Settings
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM site_settings WHERE id = 1) THEN
        INSERT INTO site_settings (
            site_name, site_description, site_url, admin_email, contact_email, 
            phone, address, timezone, language, maintenance_mode, allow_registration,
            require_email_verification, enable_comments, enable_newsletter
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
            true
        );
    END IF;
END $$;

-- 2. SEO Settings
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM seo_settings WHERE id = 1) THEN
        INSERT INTO seo_settings (
            site_title, site_description, site_keywords, robots_txt
        ) VALUES (
            'ARK KONTROL - Endüstriyel Otomasyon Çözümleri',
            'Robotik kaynak, lazer kesim ve endüstriyel otomasyon alanında uzman çözümler. ABB ve Fronius yetkili servisi.',
            'robotik kaynak, lazer kesim, endüstriyel otomasyon, ABB robot, Fronius kaynak, tiger torch',
            'User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://arkkontrol.com/sitemap.xml'
        );
    END IF;
END $$;

-- 3. Languages
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'tr') THEN
        INSERT INTO languages (code, name, native_name, is_default, is_active, direction) 
        VALUES ('tr', 'Turkish', 'Türkçe', true, true, 'ltr');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en') THEN
        INSERT INTO languages (code, name, native_name, is_default, is_active, direction) 
        VALUES ('en', 'English', 'English', false, false, 'ltr');
    END IF;
END $$;

-- 4. Pages (Ana sayfalar)
DO $$
BEGIN
    -- Ana Sayfa
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = '' OR slug IS NULL) THEN
        INSERT INTO pages (
            title, slug, content, excerpt, status, language, seo_title, seo_description, 
            seo_keywords, template, menu_order, views, published_at
        ) VALUES (
            'Ana Sayfa', '', 
            'ARK KONTROL olarak endüstriyel otomasyon ve robotik çözümler sunuyoruz.',
            'ARK KONTROL ana sayfası', 'published', 'tr',
            'ARK KONTROL - Endüstriyel Otomasyon ve Robotik Çözümler',
            'Endüstriyel otomasyon, robotik kaynak, lazer kesim ve plazma kesim çözümleri.',
            'otomasyon, robotik, endüstri, kaynak, lazer kesim, ABB, Fronius',
            'home', 1, 1250, NOW()
        );
    END IF;
    
    -- Hakkımızda
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'hakkimizda') THEN
        INSERT INTO pages (
            title, slug, content, excerpt, status, language, seo_title, seo_description, 
            template, menu_order, views, published_at
        ) VALUES (
            'Hakkımızda', 'hakkimizda',
            'ARK KONTROL, 2010 yılından beri endüstriyel otomasyon alanında hizmet vermektedir.',
            'ARK KONTROL hakkında bilgiler', 'published', 'tr',
            'Hakkımızda - ARK KONTROL', 
            'ARK KONTROL şirketi hakkında detaylı bilgiler, misyon, vizyon ve değerlerimiz.',
            'page', 2, 420, NOW()
        );
    END IF;
    
    -- İletişim
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'iletisim') THEN
        INSERT INTO pages (
            title, slug, content, excerpt, status, language, seo_title, seo_description, 
            template, menu_order, views, published_at
        ) VALUES (
            'İletişim', 'iletisim',
            'Bizimle iletişime geçin. Projeleriniz için profesyonel destek alın.',
            'Bizimle iletişime geçin', 'published', 'tr',
            'İletişim - ARK KONTROL',
            'ARK KONTROL iletişim bilgileri, adres, telefon ve e-posta.',
            'contact', 3, 280, NOW()
        );
    END IF;
    
    -- Blog
    IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'blog') THEN
        INSERT INTO pages (
            title, slug, content, excerpt, status, language, seo_title, seo_description, 
            template, menu_order, views, published_at
        ) VALUES (
            'Blog', 'blog',
            'Endüstriyel otomasyon ve teknoloji hakkında güncel yazılar.',
            'ARK KONTROL blog sayfası', 'published', 'tr',
            'Blog - ARK KONTROL',
            'Endüstriyel otomasyon, robotik teknolojiler ve sektör haberleri.',
            'blog', 4, 95, NOW()
        );
    END IF;
END $$;

-- 5. Ürün Sayfaları
DO $$
DECLARE
    product_pages TEXT[][] := ARRAY[
        ['Tiger Torch Temizleme Üniteleri', 'urunler/tiger-torc', 'Tiger Torch temizleme üniteleri ile kaynak kalitesini artırın.'],
        ['Plazma Kesim Sarf Malzemeleri', 'urunler/plazma-sarf', 'Yüksek kaliteli plazma kesim sarf malzemeleri ve yedek parçalar.'],
        ['ABB Robot Servis ve Bakım', 'urunler/abb-servis', 'ABB robotları için profesyonel servis ve bakım hizmetleri.'],
        ['Fronius Kaynak Makina Servis', 'urunler/fronius-servis', 'Fronius kaynak makineleri için uzman servis ve yedek parça hizmetleri.']
    ];
    i INTEGER;
BEGIN
    FOR i IN 1..array_length(product_pages, 1) LOOP
        IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = product_pages[i][2]) THEN
            INSERT INTO pages (
                title, slug, content, excerpt, status, language, seo_title, seo_description, 
                template, menu_order, views, published_at
            ) VALUES (
                product_pages[i][1], product_pages[i][2], product_pages[i][3],
                product_pages[i][3], 'published', 'tr',
                product_pages[i][1] || ' - ARK KONTROL',
                product_pages[i][3],
                'product', 4 + i, 150 + i * 10, NOW()
            );
        END IF;
    END LOOP;
END $$;

-- 6. Proje Sayfaları
DO $$
DECLARE
    project_pages TEXT[][] := ARRAY[
        ['Pozisyoner Sistemleri', 'projeler/pozisyoner', 'Kaynak işlemleri için özel tasarım pozisyoner sistemleri.'],
        ['Robotik Slider Sistemleri', 'projeler/slider', 'Robot hareketliliği için lineer slider sistemleri.'],
        ['Mekanize Çözümler', 'projeler/mekanize', 'Endüstriyel üretim için özel mekanize çözümler.'],
        ['Robotik Kaynak Hücreleri', 'projeler/robotik-kaynak', 'Tam otomatik robotik kaynak hücreleri ve sistemleri.'],
        ['Lazer Kesim Tezgahları', 'projeler/lazer-kesim', 'Yüksek hassasiyetli lazer kesim tezgahları ve sistemleri.'],
        ['Fikstur Sistemleri', 'projeler/fikstur', 'Kaynak ve montaj işlemleri için özel fikstur sistemleri.']
    ];
    i INTEGER;
BEGIN
    FOR i IN 1..array_length(project_pages, 1) LOOP
        IF NOT EXISTS (SELECT 1 FROM pages WHERE slug = project_pages[i][2]) THEN
            INSERT INTO pages (
                title, slug, content, excerpt, status, language, seo_title, seo_description, 
                template, menu_order, views, published_at
            ) VALUES (
                project_pages[i][1], project_pages[i][2], project_pages[i][3],
                project_pages[i][3], 'published', 'tr',
                project_pages[i][1] || ' - ARK KONTROL',
                project_pages[i][3],
                'project', 8 + i, 100 + i * 15, NOW()
            );
        END IF;
    END LOOP;
END $$;

-- 7. Menu Items (Header menüsünü yeniden oluştur)
DO $$
DECLARE
    home_page_id INTEGER;
    about_page_id INTEGER;
    contact_page_id INTEGER;
    blog_page_id INTEGER;
    tiger_page_id INTEGER;
    plasma_page_id INTEGER;
    abb_page_id INTEGER;
    fronius_page_id INTEGER;
    positioner_page_id INTEGER;
    slider_page_id INTEGER;
    mechanized_page_id INTEGER;
    welding_page_id INTEGER;
    laser_page_id INTEGER;
    fixture_page_id INTEGER;
BEGIN
    -- Önce mevcut header menüsünü temizle
    DELETE FROM menu_items WHERE menu_location = 'header';
    
    -- Sayfa ID'lerini al
    SELECT id INTO home_page_id FROM pages WHERE slug = '' OR slug IS NULL LIMIT 1;
    SELECT id INTO about_page_id FROM pages WHERE slug = 'hakkimizda' LIMIT 1;
    SELECT id INTO contact_page_id FROM pages WHERE slug = 'iletisim' LIMIT 1;
    SELECT id INTO blog_page_id FROM pages WHERE slug = 'blog' LIMIT 1;
    SELECT id INTO tiger_page_id FROM pages WHERE slug = 'urunler/tiger-torc' LIMIT 1;
    SELECT id INTO plasma_page_id FROM pages WHERE slug = 'urunler/plazma-sarf' LIMIT 1;
    SELECT id INTO abb_page_id FROM pages WHERE slug = 'urunler/abb-servis' LIMIT 1;
    SELECT id INTO fronius_page_id FROM pages WHERE slug = 'urunler/fronius-servis' LIMIT 1;
    SELECT id INTO positioner_page_id FROM pages WHERE slug = 'projeler/pozisyoner' LIMIT 1;
    SELECT id INTO slider_page_id FROM pages WHERE slug = 'projeler/slider' LIMIT 1;
    SELECT id INTO mechanized_page_id FROM pages WHERE slug = 'projeler/mekanize' LIMIT 1;
    SELECT id INTO welding_page_id FROM pages WHERE slug = 'projeler/robotik-kaynak' LIMIT 1;
    SELECT id INTO laser_page_id FROM pages WHERE slug = 'projeler/lazer-kesim' LIMIT 1;
    SELECT id INTO fixture_page_id FROM pages WHERE slug = 'projeler/fikstur' LIMIT 1;
    
    -- Ana menü öğeleri
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) VALUES 
    ('header', 'Anasayfa', '/', home_page_id, NULL, 1, '_self', true, 'tr', 'public'),
    ('header', 'Ürün ve Çözümler', '#', NULL, NULL, 2, '_self', true, 'tr', 'public'),
    ('header', 'Projelerimiz', '#', NULL, NULL, 3, '_self', true, 'tr', 'public'),
    ('header', 'Blog', '/blog', blog_page_id, NULL, 4, '_self', true, 'tr', 'public'),
    ('header', 'Hakkımızda', '/hakkimizda', about_page_id, NULL, 5, '_self', true, 'tr', 'public'),
    ('header', 'İletişim', '/iletisim', contact_page_id, NULL, 6, '_self', true, 'tr', 'public');
    
    -- Alt menü öğeleri (Ürün ve Çözümler)
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Tiger Torch Temizleme Üniteleri', '/urunler/tiger-torc', tiger_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
           1, '_self', true, 'tr', 'public'
    WHERE tiger_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Plazma Kesim Sarf Malzemeleri', '/urunler/plazma-sarf', plasma_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
           2, '_self', true, 'tr', 'public'
    WHERE plasma_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'ABB Robot Servis ve Bakım', '/urunler/abb-servis', abb_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
           3, '_self', true, 'tr', 'public'
    WHERE abb_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Fronius Kaynak Makina Servis', '/urunler/fronius-servis', fronius_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Ürün ve Çözümler'), 
           4, '_self', true, 'tr', 'public'
    WHERE fronius_page_id IS NOT NULL;
    
    -- Alt menü öğeleri (Projelerimiz)
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Robotik Kaynak Hücreleri', '/projeler/robotik-kaynak', welding_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
           1, '_self', true, 'tr', 'public'
    WHERE welding_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Fikstur Sistemleri', '/projeler/fikstur', fixture_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
           2, '_self', true, 'tr', 'public'
    WHERE fixture_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Pozisyoner Sistemleri', '/projeler/pozisyoner', positioner_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
           3, '_self', true, 'tr', 'public'
    WHERE positioner_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Robotik Slider Sistemleri', '/projeler/slider', slider_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
           4, '_self', true, 'tr', 'public'
    WHERE slider_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Mekanize Çözümler', '/projeler/mekanize', mechanized_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
           5, '_self', true, 'tr', 'public'
    WHERE mechanized_page_id IS NOT NULL;
    
    INSERT INTO menu_items (menu_location, title, url, page_id, parent_id, menu_order, target, is_active, language, visibility) 
    SELECT 'header', 'Lazer Kesim Tezgahları', '/projeler/lazer-kesim', laser_page_id, 
           (SELECT id FROM menu_items WHERE menu_location = 'header' AND title = 'Projelerimiz'), 
           6, '_self', true, 'tr', 'public'
    WHERE laser_page_id IS NOT NULL;
END $$;

-- 8. Blog Categories
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'otomasyon') THEN
        INSERT INTO blog_categories (name, slug, description, color) VALUES 
        ('Otomasyon', 'otomasyon', 'Endüstriyel otomasyon haberleri ve gelişmeleri', '#3B82F6');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'robotik') THEN
        INSERT INTO blog_categories (name, slug, description, color) VALUES 
        ('Robotik', 'robotik', 'Robotik teknolojiler ve uygulamalar', '#10B981');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM blog_categories WHERE slug = 'kaynak-teknolojileri') THEN
        INSERT INTO blog_categories (name, slug, description, color) VALUES 
        ('Kaynak Teknolojileri', 'kaynak-teknolojileri', 'Kaynak teknolojileri ve yenilikler', '#F59E0B');
    END IF;
END $$;

-- 9. Blog Posts (author_id NULL bırakıyoruz)
DO $$
DECLARE
    otomasyon_cat_id INTEGER;
    robotik_cat_id INTEGER;
    kaynak_cat_id INTEGER;
BEGIN
    SELECT id INTO otomasyon_cat_id FROM blog_categories WHERE slug = 'otomasyon' LIMIT 1;
    SELECT id INTO robotik_cat_id FROM blog_categories WHERE slug = 'robotik' LIMIT 1;
    SELECT id INTO kaynak_cat_id FROM blog_categories WHERE slug = 'kaynak-teknolojileri' LIMIT 1;
    
    IF NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'endustriyel-otomasyonun-gelecegi') THEN
        INSERT INTO blog_posts (
            title, slug, excerpt, content, category_id, author_id, status, published_at, views, reading_time, 
            tags, meta_title, meta_description
        ) VALUES (
            'Endüstriyel Otomasyonun Geleceği', 'endustriyel-otomasyonun-gelecegi',
            'Endüstriyel otomasyonun gelecekteki rolü ve teknolojik gelişmeler hakkında detaylı analiz.',
            'Endüstriyel otomasyon teknolojilerinin gelişimi ve geleceğe dair öngörüler...',
            otomasyon_cat_id, NULL, 'published', NOW(), 245, 8,
            '["otomasyon", "gelecek", "teknoloji"]'::jsonb,
            'Endüstriyel Otomasyonun Geleceği - ARK KONTROL Blog',
            'Endüstriyel otomasyon teknolojilerinin geleceği hakkında detaylı analiz.'
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM blog_posts WHERE slug = 'robotik-kaynak-sistemleri') THEN
        INSERT INTO blog_posts (
            title, slug, excerpt, content, category_id, author_id, status, published_at, views, reading_time, 
            tags, meta_title, meta_description
        ) VALUES (
            'Robotik Kaynak Sistemlerinde Yenilikler', 'robotik-kaynak-sistemleri',
            'Robotik kaynak teknolojilerindeki son gelişmeler ve endüstriyel uygulamalar.',
            'Modern robotik kaynak sistemlerinin avantajları ve uygulama alanları...',
            robotik_cat_id, NULL, 'published', NOW(), 189, 6,
            '["robotik", "kaynak", "otomasyon"]'::jsonb,
            'Robotik Kaynak Sistemlerinde Yenilikler - ARK KONTROL',
            'Robotik kaynak sistemlerindeki yenilikler hakkında uzman görüşleri.'
        );
    END IF;
END $$;

-- 10. Forms
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM forms WHERE slug = 'iletisim') THEN
        INSERT INTO forms (
            name, title, description, slug, status, submit_message, 
            email_notifications, notification_emails, store_submissions
        ) VALUES (
            'contact_form', 'İletişim Formu', 'Genel iletişim ve bilgi alma formu', 'iletisim', 'active',
            'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.',
            true, '["info@arkkontrol.com"]'::jsonb, true
        );
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM forms WHERE slug = 'teklif') THEN
        INSERT INTO forms (
            name, title, description, slug, status, submit_message, 
            email_notifications, notification_emails, store_submissions
        ) VALUES (
            'quote_form', 'Teklif Formu', 'Proje teklif talep formu', 'teklif', 'active',
            'Teklif talebiniz alındı. Uzmanlarımız en kısa sürede sizinle iletişime geçecek.',
            true, '["sales@arkkontrol.com"]'::jsonb, true
        );
    END IF;
END $$;

-- 11. Form Fields
DO $$
DECLARE
    contact_form_id INTEGER;
    quote_form_id INTEGER;
BEGIN
    SELECT id INTO contact_form_id FROM forms WHERE slug = 'iletisim' LIMIT 1;
    SELECT id INTO quote_form_id FROM forms WHERE slug = 'teklif' LIMIT 1;
    
    -- İletişim formu alanları
    IF contact_form_id IS NOT NULL THEN
        DELETE FROM form_fields WHERE form_id = contact_form_id;
        
        INSERT INTO form_fields (form_id, name, label, type, placeholder, required, options, validation_rules, order_index) VALUES 
        (contact_form_id, 'name', 'Ad Soyad', 'text', 'Adınızı ve soyadınızı girin', true, '[]'::jsonb, '{"minLength": 2}'::jsonb, 1),
        (contact_form_id, 'email', 'E-posta', 'email', 'E-posta adresinizi girin', true, '[]'::jsonb, '{"email": true}'::jsonb, 2),
        (contact_form_id, 'phone', 'Telefon', 'tel', 'Telefon numaranızı girin', false, '[]'::jsonb, '{}'::jsonb, 3),
        (contact_form_id, 'message', 'Mesaj', 'textarea', 'Mesajınızı yazın', true, '[]'::jsonb, '{"minLength": 10}'::jsonb, 4);
    END IF;
    
    -- Teklif formu alanları
    IF quote_form_id IS NOT NULL THEN
        DELETE FROM form_fields WHERE form_id = quote_form_id;
        
        INSERT INTO form_fields (form_id, name, label, type, placeholder, required, options, validation_rules, order_index) VALUES 
        (quote_form_id, 'company', 'Şirket Adı', 'text', 'Şirket adınızı girin', true, '[]'::jsonb, '{"minLength": 2}'::jsonb, 1),
        (quote_form_id, 'name', 'İletişim Kişisi', 'text', 'Adınızı ve soyadınızı girin', true, '[]'::jsonb, '{"minLength": 2}'::jsonb, 2),
        (quote_form_id, 'email', 'E-posta', 'email', 'E-posta adresinizi girin', true, '[]'::jsonb, '{"email": true}'::jsonb, 3),
        (quote_form_id, 'project_type', 'Proje Türü', 'select', 'Proje türünü seçin', true, 
         '["Robotik Kaynak", "Lazer Kesim", "Otomasyon Sistemi", "Diğer"]'::jsonb, '{}'::jsonb, 4),
        (quote_form_id, 'description', 'Proje Açıklaması', 'textarea', 'Projenizi detaylı açıklayın', true, '[]'::jsonb, '{"minLength": 20}'::jsonb, 5);
    END IF;
END $$;

-- 12. Analytics Data
DO $$
BEGIN
    -- Site Stats
    IF NOT EXISTS (SELECT 1 FROM site_stats WHERE date = CURRENT_DATE) THEN
        INSERT INTO site_stats (date, visitors, page_views, sessions, bounce_rate, avg_session_duration, new_visitors, returning_visitors) 
        VALUES (CURRENT_DATE, 220, 290, 240, 0.30, 200, 150, 70);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM site_stats WHERE date = CURRENT_DATE - 1) THEN
        INSERT INTO site_stats (date, visitors, page_views, sessions, bounce_rate, avg_session_duration, new_visitors, returning_visitors) 
        VALUES (CURRENT_DATE - 1, 240, 320, 260, 0.28, 220, 160, 80);
    END IF;
    
    -- Traffic Sources
    IF NOT EXISTS (SELECT 1 FROM traffic_sources WHERE date = CURRENT_DATE AND source_type = 'organic') THEN
        INSERT INTO traffic_sources (date, source_type, source_name, sessions, users, page_views, bounce_rate) 
        VALUES (CURRENT_DATE, 'organic', 'Google', 120, 110, 180, 0.25);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM traffic_sources WHERE date = CURRENT_DATE AND source_type = 'direct') THEN
        INSERT INTO traffic_sources (date, source_type, source_name, sessions, users, page_views, bounce_rate) 
        VALUES (CURRENT_DATE, 'direct', 'Direct Traffic', 65, 60, 85, 0.35);
    END IF;
END $$;

-- Son olarak sequence'ları güncelle
SELECT setval(pg_get_serial_sequence('pages', 'id'), COALESCE(MAX(id), 1)) FROM pages;
SELECT setval(pg_get_serial_sequence('menu_items', 'id'), COALESCE(MAX(id), 1)) FROM menu_items;
SELECT setval(pg_get_serial_sequence('blog_categories', 'id'), COALESCE(MAX(id), 1)) FROM blog_categories;
SELECT setval(pg_get_serial_sequence('blog_posts', 'id'), COALESCE(MAX(id), 1)) FROM blog_posts;
SELECT setval(pg_get_serial_sequence('forms', 'id'), COALESCE(MAX(id), 1)) FROM forms;
SELECT setval(pg_get_serial_sequence('form_fields', 'id'), COALESCE(MAX(id), 1)) FROM form_fields;
