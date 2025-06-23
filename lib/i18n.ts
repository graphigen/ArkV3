import { pool } from "./database"

export interface Language {
  id: number
  code: string
  name: string
  native_name: string
  flag_emoji?: string
  is_active: boolean
  is_default: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface TranslationKey {
  id: number
  key_name: string
  category?: string
  description?: string
  created_at: string
}

export interface Translation {
  id: number
  key_id: number
  language_code: string
  value: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface PageTranslation {
  id: number
  page_id: number
  language_code: string
  title: string
  slug: string
  content?: string
  meta_title?: string
  meta_description?: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface I18nSettings {
  id: number
  auto_detect_language: boolean
  use_browser_language: boolean
  use_ip_geolocation: boolean
  fallback_language: string
  url_strategy: "prefix" | "domain" | "subdomain"
  created_at: string
  updated_at: string
}

// Get all active languages
export async function getLanguages(): Promise<Language[]> {
  try {
    const result = await pool.query("SELECT * FROM languages WHERE is_active = true ORDER BY sort_order ASC")
    return result.rows
  } catch (error) {
    console.error("Error fetching languages:", error)
    return []
  }
}

// Get default language
export async function getDefaultLanguage(): Promise<Language | null> {
  try {
    const result = await pool.query("SELECT * FROM languages WHERE is_default = true AND is_active = true LIMIT 1")
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching default language:", error)
    return null
  }
}

// Get language by code
export async function getLanguageByCode(code: string): Promise<Language | null> {
  try {
    const result = await pool.query("SELECT * FROM languages WHERE code = $1 AND is_active = true", [code])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching language by code:", error)
    return null
  }
}

// Get all translations for a language
export async function getTranslations(languageCode: string): Promise<Record<string, string>> {
  try {
    const result = await pool.query(
      `SELECT tk.key_name, t.value 
       FROM translations t 
       JOIN translation_keys tk ON t.key_id = tk.id 
       WHERE t.language_code = $1 AND t.is_approved = true`,
      [languageCode],
    )

    const translations: Record<string, string> = {}
    result.rows.forEach((row) => {
      translations[row.key_name] = row.value
    })

    return translations
  } catch (error) {
    console.error("Error fetching translations:", error)
    return {}
  }
}

// Get translation by key and language
export async function getTranslation(key: string, languageCode: string, fallbackLanguage = "tr"): Promise<string> {
  try {
    // Try to get translation in requested language
    let result = await pool.query(
      `SELECT t.value 
       FROM translations t 
       JOIN translation_keys tk ON t.key_id = tk.id 
       WHERE tk.key_name = $1 AND t.language_code = $2 AND t.is_approved = true`,
      [key, languageCode],
    )

    if (result.rows.length > 0) {
      return result.rows[0].value
    }

    // Fallback to default language
    if (languageCode !== fallbackLanguage) {
      result = await pool.query(
        `SELECT t.value 
         FROM translations t 
         JOIN translation_keys tk ON t.key_id = tk.id 
         WHERE tk.key_name = $1 AND t.language_code = $2 AND t.is_approved = true`,
        [key, fallbackLanguage],
      )

      if (result.rows.length > 0) {
        return result.rows[0].value
      }
    }

    // Return key if no translation found
    return key
  } catch (error) {
    console.error("Error fetching translation:", error)
    return key
  }
}

// Get all translation keys with their translations
export async function getAllTranslationKeys(): Promise<
  Array<TranslationKey & { translations: Record<string, string> }>
> {
  try {
    const result = await pool.query(`
      SELECT 
        tk.id, tk.key_name, tk.category, tk.description, tk.created_at,
        json_object_agg(t.language_code, t.value) FILTER (WHERE t.language_code IS NOT NULL) as translations
      FROM translation_keys tk
      LEFT JOIN translations t ON tk.id = t.key_id AND t.is_approved = true
      GROUP BY tk.id, tk.key_name, tk.category, tk.description, tk.created_at
      ORDER BY tk.category, tk.key_name
    `)

    return result.rows.map((row) => ({
      ...row,
      translations: row.translations || {},
    }))
  } catch (error) {
    console.error("Error fetching translation keys:", error)
    return []
  }
}

// Create or update translation
export async function upsertTranslation(
  keyName: string,
  languageCode: string,
  value: string,
  category?: string,
): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Ensure translation key exists
      const keyResult = await client.query("SELECT id FROM translation_keys WHERE key_name = $1", [keyName])

      let keyId: number
      if (keyResult.rows.length === 0) {
        // Create new translation key
        const newKeyResult = await client.query(
          "INSERT INTO translation_keys (key_name, category) VALUES ($1, $2) RETURNING id",
          [keyName, category || "general"],
        )
        keyId = newKeyResult.rows[0].id
      } else {
        keyId = keyResult.rows[0].id
      }

      // Upsert translation
      await client.query(
        `INSERT INTO translations (key_id, language_code, value, is_approved) 
         VALUES ($1, $2, $3, true) 
         ON CONFLICT (key_id, language_code) 
         DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP`,
        [keyId, languageCode, value],
      )

      await client.query("COMMIT")
      return true
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error upserting translation:", error)
    return false
  }
}

// Delete translation
export async function deleteTranslation(keyName: string, languageCode?: string): Promise<boolean> {
  try {
    if (languageCode) {
      // Delete specific language translation
      await pool.query(
        `DELETE FROM translations 
         WHERE key_id = (SELECT id FROM translation_keys WHERE key_name = $1) 
         AND language_code = $2`,
        [keyName, languageCode],
      )
    } else {
      // Delete all translations for this key
      await pool.query("DELETE FROM translation_keys WHERE key_name = $1", [keyName])
    }
    return true
  } catch (error) {
    console.error("Error deleting translation:", error)
    return false
  }
}

// Get page translations
export async function getPageTranslations(pageId: number): Promise<PageTranslation[]> {
  try {
    const result = await pool.query("SELECT * FROM page_translations WHERE page_id = $1 ORDER BY language_code", [
      pageId,
    ])
    return result.rows
  } catch (error) {
    console.error("Error fetching page translations:", error)
    return []
  }
}

// Get page translation by language
export async function getPageTranslation(pageId: number, languageCode: string): Promise<PageTranslation | null> {
  try {
    const result = await pool.query("SELECT * FROM page_translations WHERE page_id = $1 AND language_code = $2", [
      pageId,
      languageCode,
    ])
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching page translation:", error)
    return null
  }
}

// Create or update page translation
export async function upsertPageTranslation(
  pageId: number,
  languageCode: string,
  data: Partial<PageTranslation>,
): Promise<PageTranslation | null> {
  try {
    const fields = ["title", "slug", "content", "meta_title", "meta_description", "is_published"]
    const setClause = fields
      .filter((field) => data[field as keyof PageTranslation] !== undefined)
      .map((field, index) => `${field} = $${index + 3}`)
      .join(", ")

    const values = fields
      .filter((field) => data[field as keyof PageTranslation] !== undefined)
      .map((field) => data[field as keyof PageTranslation])

    const result = await pool.query(
      `INSERT INTO page_translations (page_id, language_code, ${fields.join(", ")}) 
       VALUES ($1, $2, ${fields.map((_, i) => `$${i + 3}`).join(", ")}) 
       ON CONFLICT (page_id, language_code) 
       DO UPDATE SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       RETURNING *`,
      [pageId, languageCode, ...values],
    )

    return result.rows[0] || null
  } catch (error) {
    console.error("Error upserting page translation:", error)
    return null
  }
}

// Get i18n settings
export async function getI18nSettings(): Promise<I18nSettings | null> {
  try {
    const result = await pool.query("SELECT * FROM i18n_settings ORDER BY id DESC LIMIT 1")
    return result.rows[0] || null
  } catch (error) {
    console.error("Error fetching i18n settings:", error)
    return null
  }
}

// Update i18n settings
export async function updateI18nSettings(settings: Partial<I18nSettings>): Promise<I18nSettings | null> {
  try {
    const fields = Object.keys(settings).filter((key) => key !== "id")
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")
    const values = fields.map((field) => settings[field as keyof I18nSettings])

    const result = await pool.query(
      `UPDATE i18n_settings SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = (SELECT id FROM i18n_settings ORDER BY id DESC LIMIT 1) 
       RETURNING *`,
      values,
    )

    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating i18n settings:", error)
    return null
  }
}

// Detect user language based on various factors
export async function detectUserLanguage(
  browserLanguage?: string,
  ipCountry?: string,
  userPreference?: string,
): Promise<string> {
  try {
    const settings = await getI18nSettings()
    const fallbackLanguage = settings?.fallback_language || "tr"

    // 1. User preference (if logged in or stored in session)
    if (userPreference) {
      const lang = await getLanguageByCode(userPreference)
      if (lang) return userPreference
    }

    // 2. Browser language detection
    if (settings?.use_browser_language && browserLanguage) {
      const browserLangCode = browserLanguage.split("-")[0].toLowerCase()
      const lang = await getLanguageByCode(browserLangCode)
      if (lang) return browserLangCode
    }

    // 3. IP-based geolocation (if enabled)
    if (settings?.use_ip_geolocation && ipCountry) {
      const countryToLanguage: Record<string, string> = {
        TR: "tr",
        US: "en",
        GB: "en",
        DE: "de",
        AT: "de",
        CH: "de",
      }

      const detectedLang = countryToLanguage[ipCountry.toUpperCase()]
      if (detectedLang) {
        const lang = await getLanguageByCode(detectedLang)
        if (lang) return detectedLang
      }
    }

    // 4. Fallback to default language
    return fallbackLanguage
  } catch (error) {
    console.error("Error detecting user language:", error)
    return "tr"
  }
}

// Store user language preference
export async function storeUserLanguagePreference(
  sessionId: string,
  ipAddress: string,
  preferredLanguage: string,
  detectedLanguage?: string,
  browserLanguage?: string,
  countryCode?: string,
): Promise<void> {
  try {
    await pool.query(
      `INSERT INTO user_language_preferences 
       (session_id, ip_address, preferred_language, detected_language, browser_language, country_code) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (session_id) 
       DO UPDATE SET 
         preferred_language = $3, 
         detected_language = $4, 
         browser_language = $5, 
         country_code = $6, 
         updated_at = CURRENT_TIMESTAMP`,
      [sessionId, ipAddress, preferredLanguage, detectedLanguage, browserLanguage, countryCode],
    )
  } catch (error) {
    console.error("Error storing user language preference:", error)
  }
}

// Translation helper function for components
export function createTranslator(translations: Record<string, string>, fallbackLanguage = "tr") {
  return function t(key: string, fallback?: string): string {
    return translations[key] || fallback || key
  }
}

// Get missing translations (keys that don't have translations in all active languages)
export async function getMissingTranslations(): Promise<Array<{ key_name: string; missing_languages: string[] }>> {
  try {
    const result = await pool.query(`
      WITH active_languages AS (
        SELECT code FROM languages WHERE is_active = true
      ),
      translation_matrix AS (
        SELECT 
          tk.key_name,
          al.code as language_code,
          t.value
        FROM translation_keys tk
        CROSS JOIN active_languages al
        LEFT JOIN translations t ON tk.id = t.key_id AND t.language_code = al.code AND t.is_approved = true
      )
      SELECT 
        key_name,
        array_agg(language_code) FILTER (WHERE value IS NULL) as missing_languages
      FROM translation_matrix
      GROUP BY key_name
      HAVING array_length(array_agg(language_code) FILTER (WHERE value IS NULL), 1) > 0
      ORDER BY key_name
    `)

    return result.rows
  } catch (error) {
    console.error("Error fetching missing translations:", error)
    return []
  }
}
