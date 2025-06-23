-- Menu Management Tables

-- Menu Locations Table
CREATE TABLE IF NOT EXISTS menu_locations (
    id SERIAL PRIMARY KEY,
    location_key VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update Menu Items Table with better structure
DROP TABLE IF EXISTS menu_items CASCADE;
CREATE TABLE menu_items (
    id SERIAL PRIMARY KEY,
    menu_location VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500),
    page_id INTEGER REFERENCES pages(id) ON DELETE SET NULL,
    parent_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
    menu_order INTEGER DEFAULT 0,
    target VARCHAR(20) DEFAULT '_self',
    css_class VARCHAR(100),
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    language VARCHAR(10) DEFAULT 'tr',
    visibility VARCHAR(20) DEFAULT 'public', -- public, logged_in, logged_out
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default menu locations
INSERT INTO menu_locations (location_key, location_name, description) VALUES
('header', 'Header Menü', 'Ana navigasyon menüsü'),
('footer', 'Footer Menü', 'Alt sayfa menüsü'),
('sidebar', 'Sidebar Menü', 'Yan menü'),
('mobile', 'Mobil Menü', 'Mobil cihazlar için menü')
ON CONFLICT (location_key) DO NOTHING;

-- Insert default menu items
INSERT INTO menu_items (menu_location, title, page_id, menu_order, language) 
SELECT 'header', p.title, p.id, 
    CASE 
        WHEN p.slug = '/' THEN 1
        WHEN p.slug = '/hakkimizda' THEN 2
        WHEN p.slug = '/iletisim' THEN 3
        ELSE 4
    END,
    'tr'
FROM pages p 
WHERE p.slug IN ('/', '/hakkimizda', '/iletisim')
ON CONFLICT DO NOTHING;

-- Add projects menu
INSERT INTO menu_items (menu_location, title, url, menu_order, language) VALUES
('header', 'Projeler', '/projeler', 4, 'tr'),
('header', 'Ürünler', '/urunler', 5, 'tr')
ON CONFLICT DO NOTHING;

-- Add sub-menu items for projects
INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, language) VALUES
('header', 'Robotik Kaynak', '/projeler/robotik-kaynak', (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 1, 'tr'),
('header', 'Lazer Kesim', '/projeler/lazer-kesim', (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 2, 'tr'),
('header', 'Fikstur Sistemleri', '/projeler/fikstur', (SELECT id FROM menu_items WHERE title = 'Projeler' AND menu_location = 'header'), 3, 'tr')
ON CONFLICT DO NOTHING;

-- Add sub-menu items for products
INSERT INTO menu_items (menu_location, title, url, parent_id, menu_order, language) VALUES
('header', 'ABB Servis', '/urunler/abb-servis', (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 1, 'tr'),
('header', 'Fronius Servis', '/urunler/fronius-servis', (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 2, 'tr'),
('header', 'Tiger Torch', '/urunler/tiger-torc', (SELECT id FROM menu_items WHERE title = 'Ürünler' AND menu_location = 'header'), 3, 'tr')
ON CONFLICT DO NOTHING;
