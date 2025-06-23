import { neon } from "@neondatabase/serverless"

// Neon SQL client - tagged template literals kullanıyoruz
const sql = neon(process.env.DATABASE_URL!)

// Connection test function
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as test`
    return result.length > 0
  } catch (error) {
    console.error("Database connection test failed:", error)
    return false
  }
}

// Types
export interface SiteSettings {
  id: number
  site_name: string
  site_description?: string
  site_url?: string
  admin_email?: string
  contact_email?: string
  phone?: string
  address?: string
  timezone: string
  language: string
  maintenance_mode: boolean
  allow_registration: boolean
  require_email_verification: boolean
  enable_comments: boolean
  enable_newsletter: boolean
  logo_url?: string
  favicon_url?: string
  footer_logo_url?: string
  social_image_url?: string
  created_at: Date
  updated_at: Date
}

export interface Page {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  status: "draft" | "published" | "scheduled"
  language: string
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  og_title?: string
  og_description?: string
  og_image?: string
  canonical_url?: string
  noindex: boolean
  template: string
  custom_css?: string
  custom_js?: string
  featured_image?: string
  author_id?: number
  parent_id?: number
  menu_order: number
  views: number
  published_at?: Date
  created_at: Date
  updated_at: Date
}

export interface MenuItem {
  id: number
  menu_location: string
  title: string
  url?: string
  page_id?: number
  parent_id?: number
  menu_order: number
  target: string
  css_class?: string
  icon?: string
  is_active: boolean
  language: string
  visibility: string
  created_at: Date
  updated_at: Date
}

export interface IntegrationConfig {
  id: number
  category: string
  service_key: string
  config: any // JSONB will be parsed as an object
  is_enabled: boolean
  status: string
  last_tested_at?: Date | null
  created_at: Date
  updated_at: Date
}

export interface Webhook {
  id: number
  name: string
  url: string
  events: string[]
  status: string
  secret?: string | null
  last_triggered_at?: Date | null
  created_at: Date
  updated_at: Date
}

// Database functions with error handling
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const result = await sql`SELECT * FROM site_settings ORDER BY id DESC LIMIT 1`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return null
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings | null> {
  try {
    const keys = Object.keys(settings).filter(
      (key) => key !== "id" && settings[key as keyof SiteSettings] !== undefined,
    )

    if (keys.length === 0) return null

    // Build dynamic query
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")
    const values = keys.map((key) => settings[key as keyof SiteSettings])

    const query = `
      UPDATE site_settings 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = (SELECT id FROM site_settings ORDER BY id DESC LIMIT 1)
      RETURNING *
    `

    const result = await sql.query(query, values)
    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating site settings:", error)
    return null
  }
}

export async function getPages(
  language?: string,
  limit?: number,
  offset?: number,
): Promise<{ pages: Page[]; total: number }> {
  try {
    let countQuery = `SELECT COUNT(*) as total FROM pages WHERE 1=1`
    let dataQuery = `SELECT * FROM pages WHERE 1=1`
    const params: any[] = []
    let paramIndex = 1

    if (language) {
      countQuery += ` AND language = $${paramIndex}`
      dataQuery += ` AND language = $${paramIndex}`
      params.push(language)
      paramIndex++
    }

    dataQuery += ` ORDER BY menu_order ASC, created_at DESC`

    if (limit) {
      dataQuery += ` LIMIT $${paramIndex}`
      params.push(limit)
      paramIndex++
    }

    if (offset) {
      dataQuery += ` OFFSET $${paramIndex}`
      params.push(offset)
    }

    const [countResult, dataResult] = await Promise.all([
      sql.query(countQuery, language ? [language] : []),
      sql.query(dataQuery, params),
    ])

    return {
      pages: dataResult.rows || [],
      total: Number.parseInt(countResult.rows[0]?.total || "0"),
    }
  } catch (error) {
    console.error("Error fetching pages:", error)
    return { pages: [], total: 0 }
  }
}

export async function getPage(identifier: string | number): Promise<Page | null> {
  try {
    let result
    if (typeof identifier === "number") {
      result = await sql`SELECT * FROM pages WHERE id = ${identifier}`
    } else {
      result = await sql`SELECT * FROM pages WHERE slug = ${identifier}`
    }
    return result[0] || null
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

export async function createPage(pageData: Omit<Page, "id" | "created_at" | "updated_at">): Promise<Page | null> {
  try {
    const result = await sql`
      INSERT INTO pages (
        title, slug, content, excerpt, status, language, seo_title, seo_description,
        seo_keywords, og_title, og_description, og_image, canonical_url, noindex,
        template, custom_css, custom_js, featured_image, author_id, parent_id,
        menu_order, views, published_at
      ) VALUES (
        ${pageData.title}, ${pageData.slug}, ${pageData.content}, ${pageData.excerpt},
        ${pageData.status}, ${pageData.language}, ${pageData.seo_title}, ${pageData.seo_description},
        ${pageData.seo_keywords}, ${pageData.og_title}, ${pageData.og_description}, ${pageData.og_image},
        ${pageData.canonical_url}, ${pageData.noindex}, ${pageData.template}, ${pageData.custom_css},
        ${pageData.custom_js}, ${pageData.featured_image}, ${pageData.author_id}, ${pageData.parent_id},
        ${pageData.menu_order}, ${pageData.views}, ${pageData.published_at}
      ) RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error creating page:", error)
    return null
  }
}

export async function updatePage(id: number, pageData: Partial<Page>): Promise<Page | null> {
  try {
    const keys = Object.keys(pageData).filter((key) => key !== "id" && pageData[key as keyof Page] !== undefined)
    if (keys.length === 0) return null

    const values = keys.map((key) => pageData[key as keyof Page])
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")
    const query = `UPDATE pages SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`

    const result = await sql.query(query, [...values, id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating page:", error)
    return null
  }
}

export async function deletePage(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM pages WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting page:", error)
    return false
  }
}

export async function getMenuItems(location: string, language = "tr"): Promise<MenuItem[]> {
  try {
    return await sql`
      SELECT * FROM menu_items 
      WHERE menu_location = ${location} AND language = ${language} AND is_active = true 
      ORDER BY menu_order ASC
    `
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}

export async function createMenuItem(
  itemData: Omit<MenuItem, "id" | "created_at" | "updated_at">,
): Promise<MenuItem | null> {
  try {
    const result = await sql`
      INSERT INTO menu_items (
        menu_location, title, url, page_id, parent_id, menu_order, 
        target, css_class, icon, is_active, language, visibility
      ) VALUES (
        ${itemData.menu_location}, ${itemData.title}, ${itemData.url || null}, 
        ${itemData.page_id || null}, ${itemData.parent_id || null}, ${itemData.menu_order}, 
        ${itemData.target}, ${itemData.css_class || ""}, ${itemData.icon || ""}, 
        ${itemData.is_active}, ${itemData.language}, ${itemData.visibility}
      ) 
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error creating menu item:", error)
    return null
  }
}

export async function updateMenuItem(id: number, itemData: Partial<MenuItem>): Promise<MenuItem | null> {
  try {
    const keys = Object.keys(itemData).filter((key) => key !== "id" && itemData[key as keyof MenuItem] !== undefined)
    if (keys.length === 0) return null

    const values = keys.map((key) => itemData[key as keyof MenuItem])
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")
    const query = `UPDATE menu_items SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`

    const result = await sql.query(query, [...values, id])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating menu item:", error)
    return null
  }
}

export async function deleteMenuItem(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM menu_items WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return false
  }
}

// Integration Configs Functions
export async function getAllIntegrationConfigs(): Promise<IntegrationConfig[]> {
  try {
    return await sql`SELECT * FROM integration_configs ORDER BY category, service_key ASC`
  } catch (error) {
    console.error("Error fetching all integration configs:", error)
    return []
  }
}

export async function updateIntegrationConfig(
  category: string,
  service_key: string,
  config: any,
  is_enabled: boolean,
  status?: string,
): Promise<IntegrationConfig | null> {
  try {
    const result = await sql`
      INSERT INTO integration_configs (category, service_key, config, is_enabled, status)
      VALUES (${category}, ${service_key}, ${JSON.stringify(config)}, ${is_enabled}, ${status || "active"})
      ON CONFLICT (category, service_key) 
      DO UPDATE SET 
        config = EXCLUDED.config,
        is_enabled = EXCLUDED.is_enabled,
        status = EXCLUDED.status,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error(`Error updating integration config for ${category}.${service_key}:`, error)
    return null
  }
}

// Webhooks Functions
export async function getAllWebhooks(): Promise<Webhook[]> {
  try {
    return await sql`SELECT * FROM webhooks ORDER BY created_at DESC`
  } catch (error) {
    console.error("Error fetching all webhooks:", error)
    return []
  }
}

export async function createWebhook(
  data: Omit<Webhook, "id" | "created_at" | "updated_at" | "last_triggered_at">,
): Promise<Webhook | null> {
  try {
    const result = await sql`
      INSERT INTO webhooks (name, url, events, status, secret) 
      VALUES (${data.name}, ${data.url}, ${data.events}, ${data.status}, ${data.secret}) 
      RETURNING *
    `
    return result[0] || null
  } catch (error) {
    console.error("Error creating webhook:", error)
    return null
  }
}

export async function updateWebhook(
  id: number,
  data: Partial<Omit<Webhook, "id" | "created_at" | "updated_at">>,
): Promise<Webhook | null> {
  try {
    const keys = Object.keys(data).filter((key) => data[key as keyof typeof data] !== undefined)
    if (keys.length === 0) return getWebhookById(id)

    const values = keys.map((key) => data[key as keyof typeof data])
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")
    const query = `UPDATE webhooks SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`

    const result = await sql.query(query, [...values, id])
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error updating webhook ${id}:`, error)
    return null
  }
}

export async function getWebhookById(id: number): Promise<Webhook | null> {
  try {
    const result = await sql`SELECT * FROM webhooks WHERE id = ${id}`
    return result[0] || null
  } catch (error) {
    console.error(`Error fetching webhook ${id}:`, error)
    return null
  }
}

export async function deleteWebhook(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM webhooks WHERE id = ${id}`
    return true
  } catch (error) {
    console.error(`Error deleting webhook ${id}:`, error)
    return false
  }
}
