-- Örnek blog yazıları ekle (sadece kategori varsa)

DO $$
DECLARE
    robotik_cat_id INTEGER;
    lazer_cat_id INTEGER;
    otomasyon_cat_id INTEGER;
BEGIN
    -- Kategori ID'lerini al
    SELECT id INTO robotik_cat_id FROM blog_categories WHERE slug = 'robotik-kaynak' LIMIT 1;
    SELECT id INTO lazer_cat_id FROM blog_categories WHERE slug = 'lazer-kesim' LIMIT 1;
    SELECT id INTO otomasyon_cat_id FROM blog_categories WHERE slug = 'endustriyel-otomasyon' LIMIT 1;
    
    -- Sadece kategoriler varsa blog yazıları ekle
    IF robotik_cat_id IS NOT NULL THEN
        INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description) 
        SELECT * FROM (VALUES
            ('Robotik Kaynak Nedir? Avantajları ve Uygulama Alanları', 'robotik-kaynak-nedir-avantajlari-uygulama-alanlari', 'Robotik kaynak teknolojisinin temel prensipleri, avantajları ve endüstriyel uygulama alanlarını keşfedin.', '<h2>Robotik Kaynak Teknolojisine Giriş</h2><p>Robotik kaynak, endüstriyel üretimde devrim yaratan bir teknolojidir.</p>', robotik_cat_id, 'published', CURRENT_TIMESTAMP - INTERVAL '7 days', 8, '["robotik kaynak", "otomasyon"]'::jsonb, 'Robotik Kaynak Nedir? | Arkkontrol', 'Robotik kaynak teknolojisinin temel prensipleri ve avantajları')
        ) AS v(title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description)
        WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.slug = v.slug);
    END IF;
    
    IF lazer_cat_id IS NOT NULL THEN
        INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description) 
        SELECT * FROM (VALUES
            ('Fiber Lazer Kesim Teknolojisinin Geleceği', 'fiber-lazer-kesim-teknolojisinin-gelecegi', 'Fiber lazer kesim teknolojisindeki son gelişmeler ve gelecekteki trendler hakkında detaylı analiz.', '<h2>Fiber Lazer Teknolojisindeki Yenilikler</h2><p>Fiber lazer kesim teknolojisi sürekli gelişim göstermektedir.</p>', lazer_cat_id, 'published', CURRENT_TIMESTAMP - INTERVAL '3 days', 6, '["fiber lazer", "lazer kesim"]'::jsonb, 'Fiber Lazer Kesim Teknolojisinin Geleceği | Arkkontrol', 'Fiber lazer kesim teknolojisindeki son gelişmeler ve trendler')
        ) AS v(title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description)
        WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.slug = v.slug);
    END IF;
    
    IF otomasyon_cat_id IS NOT NULL THEN
        INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description) 
        SELECT * FROM (VALUES
            ('Endüstriyel Otomasyon Sistemlerinde Yapay Zeka', 'endustriyel-otomasyon-sistemlerinde-yapay-zeka', 'Yapay zeka teknolojilerinin endüstriyel otomasyon sistemlerindeki rolü ve gelecekteki potansiyeli.', '<h2>Yapay Zeka ve Endüstriyel Otomasyon</h2><p>Yapay zeka teknolojileri giderek daha önemli rol oynamaktadır.</p>', otomasyon_cat_id, 'published', CURRENT_TIMESTAMP - INTERVAL '1 day', 10, '["yapay zeka", "otomasyon"]'::jsonb, 'Endüstriyel Otomasyon Sistemlerinde Yapay Zeka | Arkkontrol', 'Yapay zeka teknolojilerinin endüstriyel otomasyon sistemlerindeki rolü')
        ) AS v(title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description)
        WHERE NOT EXISTS (SELECT 1 FROM blog_posts WHERE blog_posts.slug = v.slug);
    END IF;
END $$;
