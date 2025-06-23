-- Ana sayfa ve diğer URL'leri düzelt
UPDATE menu_items SET url = '/' WHERE title = 'Anasayfa' AND menu_location = 'header';
UPDATE menu_items SET url = '/hakkimizda' WHERE title = 'Hakkımızda' AND menu_location = 'header';
UPDATE menu_items SET url = '/iletisim' WHERE title = 'İletişim' AND menu_location = 'header';

-- Blog menüsü ekle
INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, target, is_active, language) VALUES
('header', 'Blog', '/blog', NULL, 6, '_self', true, 'tr')
ON CONFLICT DO NOTHING;
