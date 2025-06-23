-- Users and Authentication System

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    avatar_url VARCHAR(500),
    last_login TIMESTAMP,
    email_verified BOOLEAN DEFAULT false,
    email_verification_token VARCHAR(255),
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User permissions table
CREATE TABLE IF NOT EXISTS user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(100) NOT NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    granted_by INTEGER REFERENCES users(id),
    UNIQUE(user_id, permission)
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INTEGER,
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, first_name, last_name, role, status, email_verified) VALUES
('admin', 'admin@arkkontrol.com', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQ', 'Admin', 'User', 'admin', 'active', true)
ON CONFLICT (email) DO NOTHING;

-- Insert default permissions for admin
DO $$
DECLARE
    admin_user_id INTEGER;
BEGIN
    SELECT id INTO admin_user_id FROM users WHERE email = 'admin@arkkontrol.com';
    
    INSERT INTO user_permissions (user_id, permission) VALUES
    (admin_user_id, 'admin.dashboard'),
    (admin_user_id, 'admin.pages.view'),
    (admin_user_id, 'admin.pages.create'),
    (admin_user_id, 'admin.pages.edit'),
    (admin_user_id, 'admin.pages.delete'),
    (admin_user_id, 'admin.blog.view'),
    (admin_user_id, 'admin.blog.create'),
    (admin_user_id, 'admin.blog.edit'),
    (admin_user_id, 'admin.blog.delete'),
    (admin_user_id, 'admin.media.view'),
    (admin_user_id, 'admin.media.upload'),
    (admin_user_id, 'admin.media.delete'),
    (admin_user_id, 'admin.forms.view'),
    (admin_user_id, 'admin.forms.create'),
    (admin_user_id, 'admin.forms.edit'),
    (admin_user_id, 'admin.forms.delete'),
    (admin_user_id, 'admin.menus.view'),
    (admin_user_id, 'admin.menus.edit'),
    (admin_user_id, 'admin.settings.view'),
    (admin_user_id, 'admin.settings.edit'),
    (admin_user_id, 'admin.seo.view'),
    (admin_user_id, 'admin.seo.edit'),
    (admin_user_id, 'admin.i18n.view'),
    (admin_user_id, 'admin.i18n.edit'),
    (admin_user_id, 'admin.analytics.view')
    ON CONFLICT (user_id, permission) DO NOTHING;
END $$;
