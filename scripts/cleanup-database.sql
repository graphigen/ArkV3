-- Gereksiz verileri temizle (VACUUM olmadan)
DO $$
DECLARE
    deleted_stats INTEGER;
    deleted_traffic INTEGER;
    deleted_views INTEGER;
    deleted_fields INTEGER;
    deleted_menu INTEGER;
BEGIN
    -- Eski istatistikleri temizle
    DELETE FROM site_stats WHERE date < CURRENT_DATE - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_stats = ROW_COUNT;
    
    DELETE FROM traffic_sources WHERE date < CURRENT_DATE - INTERVAL '90 days';
    GET DIAGNOSTICS deleted_traffic = ROW_COUNT;
    
    DELETE FROM page_views WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
    GET DIAGNOSTICS deleted_views = ROW_COUNT;

    -- Orphaned kayıtları temizle
    DELETE FROM form_fields WHERE form_id NOT IN (SELECT id FROM forms);
    GET DIAGNOSTICS deleted_fields = ROW_COUNT;
    
    DELETE FROM menu_items WHERE page_id IS NOT NULL AND page_id NOT IN (SELECT id FROM pages);
    GET DIAGNOSTICS deleted_menu = ROW_COUNT;

    -- Sonuçları göster
    RAISE NOTICE 'Cleanup completed:';
    RAISE NOTICE '- Deleted % old site stats', deleted_stats;
    RAISE NOTICE '- Deleted % old traffic sources', deleted_traffic;
    RAISE NOTICE '- Deleted % old page views', deleted_views;
    RAISE NOTICE '- Deleted % orphaned form fields', deleted_fields;
    RAISE NOTICE '- Deleted % orphaned menu items', deleted_menu;
END $$;

-- Temizleme sonucu
SELECT 'Database cleanup completed' as status;
