-- Final Indexes and Performance Optimization

-- Additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pages_status_published ON pages(status, published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_pages_slug_status ON pages(slug, status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status_published ON blog_posts(status, published_at) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_blog_posts_category_status ON blog_posts(category_id, status);
CREATE INDEX IF NOT EXISTS idx_menu_items_location_active ON menu_items(menu_location, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_order ON menu_items(parent_id, menu_order);
CREATE INDEX IF NOT EXISTS idx_translations_approved ON translations(language_code, is_approved) WHERE is_approved = true;
CREATE INDEX IF NOT EXISTS idx_contact_messages_status_date ON contact_messages(status, created_at);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_status ON form_submissions(form_id, status);

-- Composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_pages_author_status_date ON pages(author_id, status, created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author_status_date ON blog_posts(author_id, status, published_at);
CREATE INDEX IF NOT EXISTS idx_media_type_date ON media(mime_type, created_at);
CREATE INDEX IF NOT EXISTS idx_site_stats_date_visitors ON site_stats(date, visitors);

-- Full-text search indexes
CREATE INDEX IF NOT EXISTS idx_pages_content_search ON pages USING gin(to_tsvector('turkish', title || ' ' || COALESCE(content, '')));
CREATE INDEX IF NOT EXISTS idx_blog_posts_content_search ON blog_posts USING gin(to_tsvector('turkish', title || ' ' || COALESCE(content, '')));

-- Update table statistics
ANALYZE pages;
ANALYZE blog_posts;
ANALYZE menu_items;
ANALYZE translations;
ANALYZE site_stats;
ANALYZE contact_messages;
ANALYZE form_submissions;
ANALYZE media;
ANALYZE users;

-- Create views for common queries
CREATE OR REPLACE VIEW published_pages AS
SELECT p.*, u.first_name || ' ' || u.last_name as author_name
FROM pages p
LEFT JOIN users u ON p.author_id = u.id
WHERE p.status = 'published';

CREATE OR REPLACE VIEW published_blog_posts AS
SELECT bp.*, bc.name as category_name, bc.slug as category_slug,
       u.first_name || ' ' || u.last_name as author_name
FROM blog_posts bp
LEFT JOIN blog_categories bc ON bp.category_id = bc.id
LEFT JOIN users u ON bp.author_id = u.id
WHERE bp.status = 'published'
ORDER BY bp.published_at DESC;

CREATE OR REPLACE VIEW active_menu_items AS
SELECT mi.*, p.title as page_title, p.slug as page_slug
FROM menu_items mi
LEFT JOIN pages p ON mi.page_id = p.id
WHERE mi.is_active = true
ORDER BY mi.menu_location, mi.parent_id NULLS FIRST, mi.menu_order;

-- Grant necessary permissions
GRANT SELECT ON published_pages TO PUBLIC;
GRANT SELECT ON published_blog_posts TO PUBLIC;
GRANT SELECT ON active_menu_items TO PUBLIC;
