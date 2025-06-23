-- Internationalization (i18n) System Tables

-- Languages table
CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    code VARCHAR(5) NOT NULL UNIQUE, -- tr, en, de, etc.
    name VARCHAR(100) NOT NULL, -- Türkçe, English, Deutsch
    native_name VARCHAR(100) NOT NULL, -- Türkçe, English, Deutsch
    flag_icon VARCHAR(10), -- 🇹🇷, 🇺🇸, 🇩🇪
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    direction VARCHAR(3) DEFAULT 'ltr' CHECK (direction IN ('ltr', 'rtl')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translation keys table
CREATE TABLE IF NOT EXISTS translation_keys (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(255) NOT NULL UNIQUE, -- 'nav.home', 'button.contact', etc.
    category VARCHAR(100) DEFAULT 'general', -- 'navigation', 'forms', 'products', etc.
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
    id SERIAL PRIMARY KEY,
    key_id INTEGER REFERENCES translation_keys(id) ON DELETE CASCADE,
    language_code VARCHAR(5) REFERENCES languages(code) ON DELETE CASCADE,
    value TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(key_id, language_code)
);

-- i18n settings table
CREATE TABLE IF NOT EXISTS i18n_settings (
    id SERIAL PRIMARY KEY,
    default_language VARCHAR(5) REFERENCES languages(code),
    fallback_language VARCHAR(5) REFERENCES languages(code),
    url_strategy VARCHAR(20) DEFAULT 'prefix' CHECK (url_strategy IN ('prefix', 'domain', 'subdomain')),
    auto_detect_language BOOLEAN DEFAULT true,
    store_user_preference BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);
CREATE INDEX IF NOT EXISTS idx_translation_keys_category ON translation_keys(category);
CREATE INDEX IF NOT EXISTS idx_translations_key_lang ON translations(key_id, language_code);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);

-- Insert default languages
INSERT INTO languages (code, name, native_name, flag_icon, is_default, is_active) VALUES
('tr', 'Turkish', 'Türkçe', '🇹🇷', true, true),
('en', 'English', 'English', '🇺🇸', false, true),
('de', 'German', 'Deutsch', '🇩🇪', false, false)
ON CONFLICT (code) DO NOTHING;

-- Insert i18n settings
INSERT INTO i18n_settings (default_language, fallback_language, url_strategy, auto_detect_language, store_user_preference) VALUES
('tr', 'en', 'prefix', true, true)
ON CONFLICT DO NOTHING;

-- Insert common translation keys and values
DO $$
DECLARE
    nav_home_key_id INTEGER;
    nav_products_key_id INTEGER;
    nav_projects_key_id INTEGER;
    nav_blog_key_id INTEGER;
    nav_contact_key_id INTEGER;
    btn_get_quote_key_id INTEGER;
    btn_learn_more_key_id INTEGER;
    btn_contact_key_id INTEGER;
    footer_about_key_id INTEGER;
    footer_solutions_key_id INTEGER;
    footer_services_key_id INTEGER;
BEGIN
    -- Navigation keys
    INSERT INTO translation_keys (key_name, category, description) VALUES
    ('nav.home', 'navigation', 'Ana sayfa menü linki'),
    ('nav.products', 'navigation', 'Ürünler menü linki'),
    ('nav.projects', 'navigation', 'Projeler menü linki'),
    ('nav.blog', 'navigation', 'Blog menü linki'),
    ('nav.contact', 'navigation', 'İletişim menü linki'),
    ('btn.get_quote', 'buttons', 'Teklif al butonu'),
    ('btn.learn_more', 'buttons', 'Daha fazla öğren butonu'),
    ('btn.contact', 'buttons', 'İletişim butonu'),
    ('footer.about', 'footer', 'Footer hakkımızda başlığı'),
    ('footer.solutions', 'footer', 'Footer çözümler başlığı'),
    ('footer.services', 'footer', 'Footer hizmetler başlığı')
    ON CONFLICT (key_name) DO NOTHING;

    -- Get key IDs
    SELECT id INTO nav_home_key_id FROM translation_keys WHERE key_name = 'nav.home';
    SELECT id INTO nav_products_key_id FROM translation_keys WHERE key_name = 'nav.products';
    SELECT id INTO nav_projects_key_id FROM translation_keys WHERE key_name = 'nav.projects';
    SELECT id INTO nav_blog_key_id FROM translation_keys WHERE key_name = 'nav.blog';
    SELECT id INTO nav_contact_key_id FROM translation_keys WHERE key_name = 'nav.contact';
    SELECT id INTO btn_get_quote_key_id FROM translation_keys WHERE key_name = 'btn.get_quote';
    SELECT id INTO btn_learn_more_key_id FROM translation_keys WHERE key_name = 'btn.learn_more';
    SELECT id INTO btn_contact_key_id FROM translation_keys WHERE key_name = 'btn.contact';
    SELECT id INTO footer_about_key_id FROM translation_keys WHERE key_name = 'footer.about';
    SELECT id INTO footer_solutions_key_id FROM translation_keys WHERE key_name = 'footer.solutions';
    SELECT id INTO footer_services_key_id FROM translation_keys WHERE key_name = 'footer.services';

    -- Turkish translations
    INSERT INTO translations (key_id, language_code, value) VALUES
    (nav_home_key_id, 'tr', 'Anasayfa'),
    (nav_products_key_id, 'tr', 'Ürün ve Çözümler'),
    (nav_projects_key_id, 'tr', 'Projelerimiz'),
    (nav_blog_key_id, 'tr', 'Blog'),
    (nav_contact_key_id, 'tr', 'İletişim'),
    (btn_get_quote_key_id, 'tr', 'Teklif Al'),
    (btn_learn_more_key_id, 'tr', 'Daha Fazla Öğren'),
    (btn_contact_key_id, 'tr', 'İletişim'),
    (footer_about_key_id, 'tr', 'Hakkımızda'),
    (footer_solutions_key_id, 'tr', 'Çözümler'),
    (footer_services_key_id, 'tr', 'Hizmetler')
    ON CONFLICT (key_id, language_code) DO NOTHING;

    -- English translations
    INSERT INTO translations (key_id, language_code, value) VALUES
    (nav_home_key_id, 'en', 'Home'),
    (nav_products_key_id, 'en', 'Products & Solutions'),
    (nav_projects_key_id, 'en', 'Our Projects'),
    (nav_blog_key_id, 'en', 'Blog'),
    (nav_contact_key_id, 'en', 'Contact'),
    (btn_get_quote_key_id, 'en', 'Get Quote'),
    (btn_learn_more_key_id, 'en', 'Learn More'),
    (btn_contact_key_id, 'en', 'Contact'),
    (footer_about_key_id, 'en', 'About Us'),
    (footer_solutions_key_id, 'en', 'Solutions'),
    (footer_services_key_id, 'en', 'Services')
    ON CONFLICT (key_id, language_code) DO NOTHING;

    -- German translations
    INSERT INTO translations (key_id, language_code, value) VALUES
    (nav_home_key_id, 'de', 'Startseite'),
    (nav_products_key_id, 'de', 'Produkte & Lösungen'),
    (nav_projects_key_id, 'de', 'Unsere Projekte'),
    (nav_blog_key_id, 'de', 'Blog'),
    (nav_contact_key_id, 'de', 'Kontakt'),
    (btn_get_quote_key_id, 'de', 'Angebot Erhalten'),
    (btn_learn_more_key_id, 'de', 'Mehr Erfahren'),
    (btn_contact_key_id, 'de', 'Kontakt'),
    (footer_about_key_id, 'de', 'Über Uns'),
    (footer_solutions_key_id, 'de', 'Lösungen'),
    (footer_services_key_id, 'de', 'Dienstleistungen')
    ON CONFLICT (key_id, language_code) DO NOTHING;
END $$;
