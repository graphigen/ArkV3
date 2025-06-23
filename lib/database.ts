import { Pool } from "pg"

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export { pool }

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
  is_active: boolean
  language: string
  created_at: Date
  updated_at: Date
}

// Database functions
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const result = await pool.query("SELECT * FROM site_settings ORDER BY id DESC LIMIT 1")
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return null
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings | null> {
  try {
    const setClause = Object.keys(settings)
      .filter((key) => key !== "id")
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ")

    const values = Object.keys(settings)
      .filter((key) => key !== "id")
      .map((key) => settings[key as keyof SiteSettings])

    const result = await pool.query(
      `UPDATE site_settings SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = 1 RETURNING *`,
      values,
    )

    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating site settings:", error)
    return null
  }
}

export async function getPages(language?: string): Promise<Page[]> {
  try {
    let query = "SELECT * FROM pages"
    const params: any[] = []

    if (language) {
      query += " WHERE language = $1"
      params.push(language)
    }

    query += " ORDER BY menu_order ASC, created_at DESC"

    const result = await pool.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error fetching pages:", error)
    return []
  }
}

export async function getPage(identifier: string | number): Promise<Page | null> {
  try {
    let query: string
    let param: string | number

    if (typeof identifier === "number") {
      query = "SELECT * FROM pages WHERE id = $1"
      param = identifier
    } else {
      query = "SELECT * FROM pages WHERE slug = $1"
      param = identifier
    }

    const result = await pool.query(query, [param])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

export async function createPage(pageData: Omit<Page, "id" | "created_at" | "updated_at">): Promise<Page | null> {
  try {
    const columns = Object.keys(pageData).join(", ")
    const placeholders = Object.keys(pageData)
      .map((_, index) => `$${index + 1}`)
      .join(", ")
    const values = Object.values(pageData)

    const result = await pool.query(`INSERT INTO pages (${columns}) VALUES (${placeholders}) RETURNING *`, values)

    return result.rows[0] || null
  } catch (error) {
    console.error("Error creating page:", error)
    return null
  }
}

export async function updatePage(id: number, pageData: Partial<Page>): Promise<Page | null> {
  try {
    const setClause = Object.keys(pageData)
      .filter((key) => key !== "id")
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ")

    const values = Object.keys(pageData)
      .filter((key) => key !== "id")
      .map((key) => pageData[key as keyof Page])

    const result = await pool.query(
      `UPDATE pages SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id],
    )

    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating page:", error)
    return null
  }
}

export async function deletePage(id: number): Promise<boolean> {
  try {
    const result = await pool.query("DELETE FROM pages WHERE id = $1", [id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error deleting page:", error)
    return false
  }
}

export async function getMenuItems(location: string, language = "tr"): Promise<MenuItem[]> {
  try {
    const result = await pool.query(
      "SELECT * FROM menu_items WHERE menu_location = $1 AND language = $2 AND is_active = true ORDER BY menu_order ASC",
      [location, language],
    )
    return result.rows
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}
