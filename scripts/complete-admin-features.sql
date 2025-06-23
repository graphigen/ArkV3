-- Analytics Integration Tables
CREATE TABLE IF NOT EXISTS analytics_settings (
    id SERIAL PRIMARY KEY,
    google_analytics_id VARCHAR(50),
    google_tag_manager_id VARCHAR(50),
    yandex_metrica_id VARCHAR(50),
    bing_webmaster_code TEXT,
    facebook_pixel_id VARCHAR(50),
    google_search_console_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Management Tables
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login Logs
CREATE TABLE IF NOT EXISTS login_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES admin_users(id),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE IF NOT EXISTS admin_notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES admin_users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    action_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backup Settings
CREATE TABLE IF NOT EXISTS backup_settings (
    id SERIAL PRIMARY KEY,
    auto_backup_enabled BOOLEAN DEFAULT false,
    backup_frequency VARCHAR(20) DEFAULT 'daily',
    backup_retention_days INTEGER DEFAULT 30,
    last_backup_at TIMESTAMP,
    backup_location VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- API Keys
CREATE TABLE IF NOT EXISTS api_keys (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_by INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    events JSONB DEFAULT '[]',
    secret VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    last_triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Redirects
CREATE TABLE IF NOT EXISTS url_redirects (
    id SERIAL PRIMARY KEY,
    from_url VARCHAR(500) NOT NULL,
    to_url VARCHAR(500) NOT NULL,
    redirect_type INTEGER DEFAULT 301,
    is_active BOOLEAN DEFAULT true,
    hit_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Settings
CREATE TABLE IF NOT EXISTS performance_settings (
    id SERIAL PRIMARY KEY,
    cache_enabled BOOLEAN DEFAULT true,
    cache_duration INTEGER DEFAULT 3600,
    api_rate_limit INTEGER DEFAULT 100,
    compression_enabled BOOLEAN DEFAULT true,
    minify_css BOOLEAN DEFAULT true,
    minify_js BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Security Settings
CREATE TABLE IF NOT EXISTS security_settings (
    id SERIAL PRIMARY KEY,
    recaptcha_site_key VARCHAR(100),
    recaptcha_secret_key VARCHAR(100),
    recaptcha_version VARCHAR(10) DEFAULT 'v2',
    session_timeout INTEGER DEFAULT 3600,
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration INTEGER DEFAULT 900,
    ip_whitelist JSONB DEFAULT '[]',
    ip_blacklist JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Page Custom Code
CREATE TABLE IF NOT EXISTS page_custom_code (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES pages(id) ON DELETE CASCADE,
    head_code TEXT,
    body_code TEXT,
    footer_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(page_id)
);

-- Insert default admin user
INSERT INTO admin_users (username, email, password_hash, role) 
VALUES ('admin', 'admin@arkkontrol.com', '$2b$10$dummy.hash.for.demo', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert default settings
INSERT INTO analytics_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
INSERT INTO backup_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
INSERT INTO performance_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
INSERT INTO security_settings DEFAULT VALUES ON CONFLICT DO NOTHING;
