-- Forms Management System Tables

-- Forms table
CREATE TABLE IF NOT EXISTS forms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    submit_message TEXT DEFAULT 'Mesajınız başarıyla gönderildi!',
    redirect_url VARCHAR(500),
    email_notifications BOOLEAN DEFAULT true,
    notification_emails JSONB DEFAULT '[]',
    store_submissions BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form fields table
CREATE TABLE IF NOT EXISTS form_fields (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    label VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('text', 'email', 'tel', 'textarea', 'select', 'checkbox', 'radio', 'file')),
    placeholder VARCHAR(255),
    required BOOLEAN DEFAULT false,
    options JSONB DEFAULT '[]',
    validation_rules JSONB DEFAULT '{}',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Form submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
    id SERIAL PRIMARY KEY,
    form_id INTEGER REFERENCES forms(id) ON DELETE CASCADE,
    data JSONB NOT NULL,
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'spam')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);
CREATE INDEX IF NOT EXISTS idx_forms_status ON forms(status);
CREATE INDEX IF NOT EXISTS idx_form_fields_form_id ON form_fields(form_id);
CREATE INDEX IF NOT EXISTS idx_form_fields_order ON form_fields(form_id, order_index);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at);

-- Insert default contact form
INSERT INTO forms (name, title, description, slug, submit_message, email_notifications, notification_emails, store_submissions) 
VALUES (
    'İletişim Formu',
    'Bizimle İletişime Geçin',
    'Sorularınız ve talepleriniz için bizimle iletişime geçin.',
    'iletisim',
    'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.',
    true,
    '["info@arkkontrol.com"]',
    true
) ON CONFLICT (slug) DO NOTHING;

-- Get the form ID for field insertion
DO $$
DECLARE
    contact_form_id INTEGER;
BEGIN
    SELECT id INTO contact_form_id FROM forms WHERE slug = 'iletisim';
    
    -- Insert form fields for contact form
    INSERT INTO form_fields (form_id, name, label, type, placeholder, required, order_index) VALUES
    (contact_form_id, 'name', 'Ad Soyad', 'text', 'Adınız ve soyadınız', true, 1),
    (contact_form_id, 'email', 'E-posta', 'email', 'ornek@email.com', true, 2),
    (contact_form_id, 'phone', 'Telefon', 'tel', '+90 (555) 123 45 67', false, 3),
    (contact_form_id, 'company', 'Şirket', 'text', 'Şirket adınız', false, 4),
    (contact_form_id, 'subject', 'Konu', 'select', '', true, 5),
    (contact_form_id, 'message', 'Mesaj', 'textarea', 'Mesajınızı buraya yazın...', true, 6)
    ON CONFLICT DO NOTHING;
    
    -- Update subject field with options
    UPDATE form_fields 
    SET options = '["Genel Bilgi", "Teklif Talebi", "Teknik Destek", "Satış Sonrası Hizmet", "Diğer"]'
    WHERE form_id = contact_form_id AND name = 'subject';
END $$;
