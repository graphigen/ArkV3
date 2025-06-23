-- Form submissions tablosuna updated_at kolonu ekle
ALTER TABLE form_submissions 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Blog posts tablosuna sayfalama için index ekle
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);

-- Form submissions tablosuna sayfalama için index ekle
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_status ON form_submissions(status);

-- Pages tablosuna sayfalama için index ekle
CREATE INDEX IF NOT EXISTS idx_pages_created_at ON pages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
