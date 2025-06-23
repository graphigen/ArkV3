-- Complete Setup and Data Population

-- Update pages table with author_id reference
ALTER TABLE pages ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES users(id);

-- Update blog_posts table with author_id reference  
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author_id INTEGER REFERENCES users(id);

-- Update form_submissions with user tracking
ALTER TABLE form_submissions ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id);

-- Update media table with uploaded_by reference
ALTER TABLE media ADD COLUMN IF NOT EXISTS uploaded_by INTEGER REFERENCES users(id);

-- Set default author for existing content
DO $$
DECLARE
    admin_user_id INTEGER;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@arkkontrol.com';
    
    -- Update existing pages
    UPDATE pages SET author_id = admin_user_id WHERE author_id IS NULL;
    
    -- Update existing blog posts
    UPDATE blog_posts SET author_id = admin_user_id WHERE author_id IS NULL;
END $$;

-- Insert additional sample data for testing
INSERT INTO contact_messages (name, email, phone, subject, message, status) VALUES
('Ahmet Yılmaz', 'ahmet@example.com', '+90 532 123 45 67', 'Robotik Kaynak Sistemi', 'Merhaba, fabrikamız için robotik kaynak sistemi hakkında bilgi almak istiyorum. 50 adet parça/gün kapasiteli bir sistem arıyoruz.', 'unread'),
('Fatma Kaya', 'fatma@metalworks.com', '+90 533 987 65 43', 'Lazer Kesim Hizmeti', 'Lazer kesim hizmetiniz için fiyat teklifi alabilir miyim? 5mm kalınlığında çelik levhalar kesilecek.', 'read'),
('Mehmet Demir', 'mehmet@otomotiv.com', '+90 534 456 78 90', 'ABB Robot Servisi', 'ABB IRB 1600 robotumuz arızalı, acil servis desteği gerekiyor. Ne zaman gelebilirsiniz?', 'replied'),
('Ayşe Özkan', 'ayse@makine.com', '+90 535 321 65 47', 'Fikstur Sistemi', 'Özel fikstur sistemi tasarımı yaptırabilir miyiz? Teknik çizimlerimiz hazır.', 'unread'),
('Ali Çelik', 'ali@endustri.com', '+90 536 789 12 34', 'Fronius Kaynak Makinesi', 'Fronius TPS 320i kaynak makinesi için yedek parça temin edebilir misiniz?', 'read')
ON CONFLICT DO NOTHING;

-- Insert sample analytics data for last 30 days
DO $$
DECLARE
    i INTEGER;
    random_visitors INTEGER;
    random_pageviews INTEGER;
    random_sessions INTEGER;
BEGIN
    FOR i IN 1..30 LOOP
        random_visitors := 800 + (RANDOM() * 1200)::INTEGER;
        random_pageviews := random_visitors * (1.5 + RANDOM() * 2);
        random_sessions := random_visitors * (0.8 + RANDOM() * 0.4);
        
        INSERT INTO site_stats (
            date, 
            visitors, 
            page_views, 
            sessions, 
            bounce_rate, 
            avg_session_duration,
            new_visitors,
            returning_visitors
        ) VALUES (
            CURRENT_DATE - INTERVAL '1 day' * i,
            random_visitors,
            random_pageviews,
            random_sessions,
            30 + (RANDOM() * 40),
            120 + (RANDOM() * 180)::INTEGER,
            (random_visitors * (0.6 + RANDOM() * 0.2))::INTEGER,
            (random_visitors * (0.2 + RANDOM() * 0.2))::INTEGER
        ) ON CONFLICT (date) DO NOTHING;
    END LOOP;
END $$;

-- Insert sample page views for popular pages
INSERT INTO page_views (page_url, visitor_ip, device_type, browser, created_at) VALUES
('/', '192.168.1.100', 'desktop', 'Chrome', NOW() - INTERVAL '1 hour'),
('/projeler/robotik-kaynak', '192.168.1.101', 'mobile', 'Safari', NOW() - INTERVAL '2 hours'),
('/urunler/abb-servis', '192.168.1.102', 'desktop', 'Firefox', NOW() - INTERVAL '3 hours'),
('/blog/robotik-kaynak-nedir-avantajlari-uygulama-alanlari', '192.168.1.103', 'tablet', 'Chrome', NOW() - INTERVAL '4 hours'),
('/iletisim', '192.168.1.104', 'desktop', 'Edge', NOW() - INTERVAL '5 hours')
ON CONFLICT DO NOTHING;

-- Create some system alerts
INSERT INTO system_alerts (type, title, message, action_text, action_url, priority) VALUES
('info', 'Hoş Geldiniz!', 'Admin paneline hoş geldiniz. Tüm özellikler aktif ve kullanıma hazır.', 'Keşfet', '/admin', 1),
('warning', 'SEO Optimizasyonu', '3 sayfada meta açıklama eksik. SEO performansını artırmak için tamamlayın.', 'Düzelt', '/admin/seo', 2),
('success', 'Sistem Güncel', 'Tüm sistemler güncel ve sorunsuz çalışıyor.', NULL, NULL, 1)
ON CONFLICT DO NOTHING;

-- Update page view counts
UPDATE pages SET views = (SELECT COUNT(*) FROM page_views WHERE page_views.page_url = pages.slug) WHERE slug IN ('/', '/hakkimizda', '/iletisim');

-- Update blog post view counts  
UPDATE blog_posts SET views = 150 + (RANDOM() * 500)::INTEGER WHERE status = 'published';

ANALYZE; -- Update table statistics for better query performance
