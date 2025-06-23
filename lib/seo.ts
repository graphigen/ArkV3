import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface SEOData {
  id?: number
  pageId: number
  languageCode: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
  robots?: string
  schemaMarkup?: any
  focusKeyword?: string
  seoScore?: number
  readabilityScore?: number
  wordCount?: number
}

export interface SEOSettings {
  id?: number
  siteName?: string
  siteDescription?: string
  defaultOgImage?: string
  defaultTwitterImage?: string
  googleAnalyticsId?: string
  googleTagManagerId?: string
  googleSearchConsoleCode?: string
  bingWebmasterCode?: string
  yandexVerificationCode?: string
  facebookAppId?: string
  twitterUsername?: string
  robotsTxt?: string
  customHeadCode?: string
  customBodyCode?: string
  enableBreadcrumbs?: boolean
  enableSchemaMarkup?: boolean
  enableOpenGraph?: boolean
  enableTwitterCards?: boolean
}

export interface SEORedirect {
  id?: number
  fromUrl: string
  toUrl: string
  redirectType: number
  isActive: boolean
  hitCount?: number
  lastHit?: Date
}

export interface SEOKeyword {
  id?: number
  keyword: string
  pageId: number
  languageCode: string
  searchVolume?: number
  difficulty?: number
  currentPosition?: number
  targetPosition?: number
  isTracking: boolean
}

// SEO Data Functions
export async function getPageSEO(pageId: number, languageCode = "tr"): Promise<SEOData | null> {
  try {
    const result = await sql`
      SELECT * FROM page_seo 
      WHERE page_id = ${pageId} AND language_code = ${languageCode}
    `
    return result[0] || null
  } catch (error) {
    console.error("Error fetching page SEO:", error)
    return null
  }
}

export async function upsertPageSEO(seoData: SEOData): Promise<SEOData | null> {
  try {
    const result = await sql`
      INSERT INTO page_seo (
        page_id, language_code, meta_title, meta_description, meta_keywords,
        og_title, og_description, og_image, og_type,
        twitter_card, twitter_title, twitter_description, twitter_image,
        canonical_url, robots, schema_markup, focus_keyword,
        seo_score, readability_score, word_count, updated_at
      ) VALUES (
        ${seoData.pageId}, ${seoData.languageCode}, ${seoData.metaTitle}, 
        ${seoData.metaDescription}, ${seoData.metaKeywords},
        ${seoData.ogTitle}, ${seoData.ogDescription}, ${seoData.ogImage}, ${seoData.ogType || "website"},
        ${seoData.twitterCard || "summary_large_image"}, ${seoData.twitterTitle}, 
        ${seoData.twitterDescription}, ${seoData.twitterImage},
        ${seoData.canonicalUrl}, ${seoData.robots || "index,follow"}, 
        ${JSON.stringify(seoData.schemaMarkup)}, ${seoData.focusKeyword},
        ${seoData.seoScore || 0}, ${seoData.readabilityScore || 0}, 
        ${seoData.wordCount || 0}, CURRENT_TIMESTAMP
      )
      ON CONFLICT (page_id, language_code) 
      DO UPDATE SET
        meta_title = EXCLUDED.meta_title,
        meta_description = EXCLUDED.meta_description,
        meta_keywords = EXCLUDED.meta_keywords,
        og_title = EXCLUDED.og_title,
        og_description = EXCLUDED.og_description,
        og_image = EXCLUDED.og_image,
        og_type = EXCLUDED.og_type,
        twitter_card = EXCLUDED.twitter_card,
        twitter_title = EXCLUDED.twitter_title,
        twitter_description = EXCLUDED.twitter_description,
        twitter_image = EXCLUDED.twitter_image,
        canonical_url = EXCLUDED.canonical_url,
        robots = EXCLUDED.robots,
        schema_markup = EXCLUDED.schema_markup,
        focus_keyword = EXCLUDED.focus_keyword,
        seo_score = EXCLUDED.seo_score,
        readability_score = EXCLUDED.readability_score,
        word_count = EXCLUDED.word_count,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error upserting page SEO:", error)
    return null
  }
}

// SEO Settings Functions
export async function getSEOSettings(): Promise<SEOSettings | null> {
  try {
    const result = await sql`SELECT * FROM seo_settings ORDER BY id DESC LIMIT 1`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching SEO settings:", error)
    return null
  }
}

export async function updateSEOSettings(settings: SEOSettings): Promise<SEOSettings | null> {
  try {
    const result = await sql`
      INSERT INTO seo_settings (
        site_name, site_description, default_og_image, default_twitter_image,
        google_analytics_id, google_tag_manager_id, google_search_console_code,
        bing_webmaster_code, yandex_verification_code, facebook_app_id,
        twitter_username, robots_txt, custom_head_code, custom_body_code,
        enable_breadcrumbs, enable_schema_markup, enable_open_graph, enable_twitter_cards,
        updated_at
      ) VALUES (
        ${settings.siteName}, ${settings.siteDescription}, ${settings.defaultOgImage}, ${settings.defaultTwitterImage},
        ${settings.googleAnalyticsId}, ${settings.googleTagManagerId}, ${settings.googleSearchConsoleCode},
        ${settings.bingWebmasterCode}, ${settings.yandexVerificationCode}, ${settings.facebookAppId},
        ${settings.twitterUsername}, ${settings.robotsTxt}, ${settings.customHeadCode}, ${settings.customBodyCode},
        ${settings.enableBreadcrumbs}, ${settings.enableSchemaMarkup}, ${settings.enableOpenGraph}, ${settings.enableTwitterCards},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (id) DO UPDATE SET
        site_name = EXCLUDED.site_name,
        site_description = EXCLUDED.site_description,
        default_og_image = EXCLUDED.default_og_image,
        default_twitter_image = EXCLUDED.default_twitter_image,
        google_analytics_id = EXCLUDED.google_analytics_id,
        google_tag_manager_id = EXCLUDED.google_tag_manager_id,
        google_search_console_code = EXCLUDED.google_search_console_code,
        bing_webmaster_code = EXCLUDED.bing_webmaster_code,
        yandex_verification_code = EXCLUDED.yandex_verification_code,
        facebook_app_id = EXCLUDED.facebook_app_id,
        twitter_username = EXCLUDED.twitter_username,
        robots_txt = EXCLUDED.robots_txt,
        custom_head_code = EXCLUDED.custom_head_code,
        custom_body_code = EXCLUDED.custom_body_code,
        enable_breadcrumbs = EXCLUDED.enable_breadcrumbs,
        enable_schema_markup = EXCLUDED.enable_schema_markup,
        enable_open_graph = EXCLUDED.enable_open_graph,
        enable_twitter_cards = EXCLUDED.enable_twitter_cards,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating SEO settings:", error)
    return null
  }
}

// SEO Redirects Functions
export async function getAllRedirects(): Promise<SEORedirect[]> {
  try {
    const result = await sql`
      SELECT * FROM seo_redirects 
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error fetching redirects:", error)
    return []
  }
}

export async function createRedirect(redirect: Omit<SEORedirect, "id">): Promise<SEORedirect | null> {
  try {
    const result = await sql`
      INSERT INTO seo_redirects (from_url, to_url, redirect_type, is_active)
      VALUES (${redirect.fromUrl}, ${redirect.toUrl}, ${redirect.redirectType}, ${redirect.isActive})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating redirect:", error)
    return null
  }
}

export async function updateRedirect(id: number, redirect: Partial<SEORedirect>): Promise<SEORedirect | null> {
  try {
    const result = await sql`
      UPDATE seo_redirects 
      SET from_url = COALESCE(${redirect.fromUrl}, from_url),
          to_url = COALESCE(${redirect.toUrl}, to_url),
          redirect_type = COALESCE(${redirect.redirectType}, redirect_type),
          is_active = COALESCE(${redirect.isActive}, is_active),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating redirect:", error)
    return null
  }
}

export async function deleteRedirect(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM seo_redirects WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting redirect:", error)
    return false
  }
}

// SEO Keywords Functions
export async function getPageKeywords(pageId: number): Promise<SEOKeyword[]> {
  try {
    const result = await sql`
      SELECT * FROM seo_keywords 
      WHERE page_id = ${pageId}
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error("Error fetching page keywords:", error)
    return []
  }
}

export async function addKeyword(keyword: Omit<SEOKeyword, "id">): Promise<SEOKeyword | null> {
  try {
    const result = await sql`
      INSERT INTO seo_keywords (
        keyword, page_id, language_code, search_volume, difficulty,
        current_position, target_position, is_tracking
      ) VALUES (
        ${keyword.keyword}, ${keyword.pageId}, ${keyword.languageCode},
        ${keyword.searchVolume}, ${keyword.difficulty}, ${keyword.currentPosition},
        ${keyword.targetPosition}, ${keyword.isTracking}
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error adding keyword:", error)
    return null
  }
}

// SEO Analysis Functions
export function analyzeSEO(
  content: string,
  seoData: SEOData,
): {
  score: number
  issues: string[]
  recommendations: string[]
} {
  const issues: string[] = []
  const recommendations: string[] = []
  let score = 100

  // Title analysis
  if (!seoData.metaTitle) {
    issues.push("Meta title eksik")
    score -= 15
  } else if (seoData.metaTitle.length < 30) {
    issues.push("Meta title çok kısa (30 karakterden az)")
    score -= 10
  } else if (seoData.metaTitle.length > 60) {
    issues.push("Meta title çok uzun (60 karakterden fazla)")
    score -= 10
  }

  // Description analysis
  if (!seoData.metaDescription) {
    issues.push("Meta description eksik")
    score -= 15
  } else if (seoData.metaDescription.length < 120) {
    issues.push("Meta description çok kısa (120 karakterden az)")
    score -= 10
  } else if (seoData.metaDescription.length > 160) {
    issues.push("Meta description çok uzun (160 karakterden fazla)")
    score -= 10
  }

  // Content analysis
  const wordCount = content.split(/\s+/).length
  if (wordCount < 300) {
    issues.push("İçerik çok kısa (300 kelimeden az)")
    score -= 15
  }

  // Focus keyword analysis
  if (seoData.focusKeyword) {
    const keyword = seoData.focusKeyword.toLowerCase()
    const contentLower = content.toLowerCase()
    const titleLower = seoData.metaTitle?.toLowerCase() || ""

    if (!titleLower.includes(keyword)) {
      issues.push("Odak kelime meta title'da bulunmuyor")
      score -= 10
    }

    if (!contentLower.includes(keyword)) {
      issues.push("Odak kelime içerikte bulunmuyor")
      score -= 15
    }
  } else {
    issues.push("Odak kelime belirlenmemiş")
    score -= 10
  }

  // Generate recommendations
  if (issues.length === 0) {
    recommendations.push("SEO optimizasyonu mükemmel!")
  } else {
    recommendations.push("Tespit edilen sorunları düzeltin")
    if (!seoData.ogTitle) recommendations.push("Open Graph title ekleyin")
    if (!seoData.ogDescription) recommendations.push("Open Graph description ekleyin")
    if (!seoData.ogImage) recommendations.push("Open Graph image ekleyin")
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
  }
}

// Sitemap generation
export async function generateSitemap(): Promise<string> {
  try {
    const pages = await sql`
      SELECT p.slug, p.updated_at, pt.language_code, pt.slug as translated_slug
      FROM pages p
      LEFT JOIN page_translations pt ON p.id = pt.page_id
      WHERE p.is_published = true AND p.status = 'published'
      ORDER BY p.updated_at DESC
    `

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arkkontrol.com"

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

    // Add homepage
    sitemap += `  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
`

    // Add pages
    for (const page of pages) {
      const url = page.translated_slug
        ? `${baseUrl}/${page.language_code}/${page.translated_slug}`
        : `${baseUrl}/${page.slug}`

      sitemap += `  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`
    }

    sitemap += `</urlset>`
    return sitemap
  } catch (error) {
    console.error("Error generating sitemap:", error)
    return ""
  }
}
