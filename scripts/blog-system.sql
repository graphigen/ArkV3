-- Blog System Tables

-- Blog categories table
CREATE TABLE IF NOT EXISTS blog_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL,
    featured_image VARCHAR(500),
    category_id INTEGER REFERENCES blog_categories(id) ON DELETE SET NULL,
    author_id INTEGER, -- Will be linked to users table later
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP,
    views INTEGER DEFAULT 0,
    reading_time INTEGER DEFAULT 5, -- in minutes
    tags JSONB DEFAULT '[]',
    meta_title VARCHAR(500),
    meta_description TEXT,
    custom_css TEXT,
    custom_js TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS blog_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES blog_posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES blog_comments(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    author_website VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'spam', 'trash')),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_views ON blog_posts(views);
CREATE INDEX IF NOT EXISTS idx_blog_comments_post_id ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_comments_status ON blog_comments(status);
CREATE INDEX IF NOT EXISTS idx_blog_comments_created_at ON blog_comments(created_at);

-- Insert default blog categories
INSERT INTO blog_categories (name, slug, description, color) VALUES
('Robotik Kaynak', 'robotik-kaynak', 'Robotik kaynak teknolojileri ve uygulamaları', '#F59E0B'),
('Lazer Kesim', 'lazer-kesim', 'Lazer kesim teknolojileri ve çözümleri', '#EF4444'),
('Endüstriyel Otomasyon', 'endustriyel-otomasyon', 'Otomasyon sistemleri ve çözümleri', '#3B82F6'),
('ABB Robotları', 'abb-robotlari', 'ABB robot teknolojileri ve servisleri', '#10B981'),
('Fronius Kaynak', 'fronius-kaynak', 'Fronius kaynak makineleri ve teknolojileri', '#8B5CF6'),
('Proje Hikayeleri', 'proje-hikayeleri', 'Başarılı proje hikayeleri ve vaka çalışmaları', '#F97316')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample blog posts
DO $$
DECLARE
    robotik_cat_id INTEGER;
    lazer_cat_id INTEGER;
    otomasyon_cat_id INTEGER;
BEGIN
    SELECT id INTO robotik_cat_id FROM blog_categories WHERE slug = 'robotik-kaynak';
    SELECT id INTO lazer_cat_id FROM blog_categories WHERE slug = 'lazer-kesim';
    SELECT id INTO otomasyon_cat_id FROM blog_categories WHERE slug = 'endustriyel-otomasyon';
    
    INSERT INTO blog_posts (title, slug, excerpt, content, category_id, status, published_at, reading_time, tags, meta_title, meta_description) VALUES
    (
        'Robotik Kaynak Nedir? Avantajları ve Uygulama Alanları',
        'robotik-kaynak-nedir-avantajlari-uygulama-alanlari',
        'Robotik kaynak teknolojisinin temel prensipleri, avantajları ve endüstriyel uygulama alanlarını keşfedin.',
        '<h2>Robotik Kaynak Teknolojisine Giriş</h2><p>Robotik kaynak, endüstriyel üretimde devrim yaratan bir teknolojidir. Bu yazıda robotik kaynağın temel prensiplerini ve avantajlarını inceleyeceğiz.</p><h3>Robotik Kaynağın Avantajları</h3><ul><li>Yüksek hassasiyet ve tekrarlanabilirlik</li><li>Artan üretim hızı</li><li>İnsan hatalarının minimize edilmesi</li><li>Zorlu çalışma koşullarında güvenlik</li></ul><p>Robotik kaynak sistemleri, otomotiv, makine imalatı ve metal işleme sektörlerinde yaygın olarak kullanılmaktadır.</p>',
        robotik_cat_id,
        'published',
        CURRENT_TIMESTAMP - INTERVAL '7 days',
        8,
        '["robotik kaynak", "otomasyon", "endüstriyel robot", "kaynak teknolojisi"]',
        'Robotik Kaynak Nedir? Avantajları ve Uygulama Alanları | Arkkontrol',
        'Robotik kaynak teknolojisinin temel prensipleri, avantajları ve endüstriyel uygulama alanlarını öğrenin. Uzman görüşleri ve pratik bilgiler.'
    ),
    (
        'Fiber Lazer Kesim Teknolojisinin Geleceği',
        'fiber-lazer-kesim-teknolojisinin-gelecegi',
        'Fiber lazer kesim teknolojisindeki son gelişmeler ve gelecekteki trendler hakkında detaylı analiz.',
        '<h2>Fiber Lazer Teknolojisindeki Yenilikler</h2><p>Fiber lazer kesim teknolojisi, metal işleme endüstrisinde sürekli gelişim göstermektedir. Bu yazıda en son teknolojik gelişmeleri inceleyeceğiz.</p><h3>Teknolojik Gelişmeler</h3><ul><li>Daha yüksek güç seviyeleri</li><li>Gelişmiş kesim kalitesi</li><li>Enerji verimliliği</li><li>Akıllı kontrol sistemleri</li></ul><p>Gelecekte fiber lazer teknolojisinin daha da yaygınlaşması beklenmektedir.</p>',
        lazer_cat_id,
        'published',
        CURRENT_TIMESTAMP - INTERVAL '3 days',
        6,
        '["fiber lazer", "lazer kesim", "metal işleme", "teknoloji"]',
        'Fiber Lazer Kesim Teknolojisinin Geleceği | Arkkontrol Blog',
        'Fiber lazer kesim teknolojisindeki son gelişmeler ve gelecekteki trendler. Uzman analizleri ve sektörel öngörüler.'
    ),
    (
        'Endüstriyel Otomasyon Sistemlerinde Yapay Zeka',
        'endustriyel-otomasyon-sistemlerinde-yapay-zeka',
        'Yapay zeka teknolojilerinin endüstriyel otomasyon sistemlerindeki rolü ve gelecekteki potansiyeli.',
        '<h2>Yapay Zeka ve Endüstriyel Otomasyon</h2><p>Yapay zeka teknolojileri, endüstriyel otomasyon sistemlerinde giderek daha önemli bir rol oynamaktadır.</p><h3>AI Uygulamaları</h3><ul><li>Öngörülü bakım</li><li>Kalite kontrol</li><li>Süreç optimizasyonu</li><li>Akıllı planlama</li></ul><p>Bu teknolojiler sayesinde üretim verimliliği önemli ölçüde artmaktadır.</p>',
        otomasyon_cat_id,
        'published',
        CURRENT_TIMESTAMP - INTERVAL '1 day',
        10,
        '["yapay zeka", "endüstriyel otomasyon", "AI", "akıllı üretim"]',
        'Endüstriyel Otomasyon Sistemlerinde Yapay Zeka | Arkkontrol',
        'Yapay zeka teknolojilerinin endüstriyel otomasyon sistemlerindeki rolü ve gelecekteki potansiyeli hakkında detaylı inceleme.'
    )
    ON CONFLICT (slug) DO NOTHING;
END $$;
