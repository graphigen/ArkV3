-- Drop tables if they exist (optional, for development)
-- DROP TABLE IF EXISTS webhooks CASCADE;
-- DROP TABLE IF EXISTS integration_configs CASCADE;

-- Table for storing configurations for various integrations
CREATE TABLE IF NOT EXISTS integration_configs (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- e.g., 'analytics', 'social', 'email'
    service_key VARCHAR(50) NOT NULL, -- e.g., 'googleAnalytics', 'smtp'
    config JSONB DEFAULT '{}'::jsonb, -- Stores specific settings like API keys, tracking IDs
    is_enabled BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error', 'pending_configuration'
    last_tested_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category, service_key)
);

-- Table for storing webhook configurations
CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of event names
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
    secret VARCHAR(255), -- Optional webhook secret for verification
    last_triggered_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Insert default integration configurations (disabled by default)
INSERT INTO integration_configs (category, service_key, config, is_enabled, status) VALUES
('analytics', 'googleAnalytics', '{"trackingId": ""}', FALSE, 'disconnected'),
('analytics', 'googleTagManager', '{"containerId": ""}', FALSE, 'disconnected'),
('social', 'facebook', '{"appId": "", "appSecret": ""}', FALSE, 'disconnected'),
('social', 'twitter', '{"apiKey": "", "apiSecret": ""}', FALSE, 'disconnected'),
('social', 'instagram', '{"accessToken": ""}', FALSE, 'disconnected'),
('email', 'smtp', '{"host": "", "port": 587, "username": "", "password": ""}', FALSE, 'disconnected'),
('email', 'mailgun', '{"apiKey": "", "domain": ""}', FALSE, 'disconnected'),
('email', 'sendgrid', '{"apiKey": ""}', FALSE, 'disconnected'),
('payment', 'stripe', '{"publishableKey": "", "secretKey": ""}', FALSE, 'disconnected'),
('payment', 'paypal', '{"clientId": "", "clientSecret": ""}', FALSE, 'disconnected'),
('storage', 'aws', '{"accessKey": "", "secretKey": "", "bucket": "", "region": "us-east-1"}', FALSE, 'disconnected'),
('storage', 'cloudinary', '{"cloudName": "", "apiKey": "", "apiSecret": ""}', FALSE, 'disconnected')
ON CONFLICT (category, service_key) DO NOTHING;

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_integration_configs_category_service_key ON integration_configs(category, service_key);
CREATE INDEX IF NOT EXISTS idx_webhooks_name ON webhooks(name);

-- Notify successful creation
SELECT 'Integration settings and webhooks tables created and initialized successfully.' AS message;
