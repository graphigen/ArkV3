-- Menu locations tablosunu oluştur
CREATE TABLE IF NOT EXISTS menu_locations (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Varsayılan menü konumlarını ekle
INSERT INTO menu_locations (location_key, location_name, description) VALUES
('header', 'Ana Menü', 'Site üst kısmındaki ana navigasyon menüsü'),
('mobile', 'Mobil Menü', 'Mobil cihazlar için hamburger menüsü'),
('footer', 'Footer Menü', 'Site alt kısmındaki footer menüsü'),
('sidebar', 'Yan Menü', 'Sayfa yan tarafındaki menü')
ON CONFLICT (location_key) DO NOTHING;
