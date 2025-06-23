# Manual VACUUM Instructions

Since VACUUM cannot run inside transaction blocks, run these commands manually in your database:

## Connect to your database directly:
\`\`\`bash
psql $DATABASE_URL
\`\`\`

## Run VACUUM commands:
\`\`\`sql
VACUUM ANALYZE site_stats;
VACUUM ANALYZE traffic_sources;
VACUUM ANALYZE page_views;
VACUUM ANALYZE pages;
VACUUM ANALYZE menu_items;
VACUUM ANALYZE admin_users;
VACUUM ANALYZE blog_posts;
VACUUM ANALYZE forms;

-- Full vacuum (optional, for heavy cleanup)
VACUUM FULL;
\`\`\`

## Check results:
\`\`\`sql
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
