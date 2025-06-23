-- Sadece eksik olan temel verileri ekle
-- Hata vermeyecek şekilde ON CONFLICT ile

-- Site ayarları kontrol et ve ekle
INSERT INTO site_settings (
    site_name, 
    site_description, 
    admin_email, 
    contact_email, 
    phone, 
    address
) 
SELECT 
    'Arkkontrol',
    'Endüstriyel Otomasyon ve Robotik Çözümler',
    'admin@arkkontrol.com',
    'info@arkkontrol.com',
    '+90 212 555 0123',
    'İstanbul, Türkiye'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- SEO ayarları kontrol et ve ekle
INSERT INTO seo_settings (
    site_title,
    site_description,
    site_keywords
)
SELECT 
    'Arkkontrol - Endüstriyel Otomasyon',
    'Robotik kaynak, lazer kesim ve otomasyon çözümleri',
    'robotik, otomasyon, lazer kesim, kaynak'
WHERE NOT EXISTS (SELECT 1 FROM seo_settings LIMIT 1);

-- Dil ayarları
INSERT INTO languages (code, name, native_name, is_default, is_active)
SELECT 'tr', 'Turkish', 'Türkçe', true, true
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'tr');

INSERT INTO languages (code, name, native_name, is_default, is_active)
SELECT 'en', 'English', 'English', false, true
WHERE NOT EXISTS (SELECT 1 FROM languages WHERE code = 'en');

-- Sonuç raporu
SELECT 
    'Demo data check completed!' as status,
    (SELECT COUNT(*) FROM site_settings) as site_settings_count,
    (SELECT COUNT(*) FROM seo_settings) as seo_settings_count,
    (SELECT COUNT(*) FROM languages) as languages_count;
