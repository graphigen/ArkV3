import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Language {
  id: number
  code: string
  name: string
  native_name: string
  flag_icon?: string
  is_default: boolean
  is_active: boolean
  direction: string
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
  default_language: string
  fallback_language: string
  url_strategy: "prefix" | "domain" | "subdomain"
  auto_detect_language: boolean
  store_user_preference: boolean
  created_at: string
  updated_at: string
}

// Get all active languages
export async function getLanguages(): Promise<Language[]> {
  try {
    return await sql`SELECT * FROM languages WHERE is_active = true ORDER BY name ASC`
  } catch (error) {
    console.error("Error fetching languages:", error)
    return []
  }
}

// Get default language
export async function getDefaultLanguage(): Promise<Language | null> {
  try {
    const result = await sql`SELECT * FROM languages WHERE is_default = true AND is_active = true LIMIT 1`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching default language:", error)
    return null
  }
}

// Get language by code
export async function getLanguageByCode(code: string): Promise<Language | null> {
  try {
    const result = await sql`SELECT * FROM languages WHERE code = ${code} AND is_active = true`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching language by code:", error)
    return null
  }
}

// Get all translations for a language
export async function getTranslations(languageCode: string): Promise<Record<string, string>> {
  try {
    const result = await sql`
      SELECT tk.key_name, t.value 
      FROM translations t 
      JOIN translation_keys tk ON t.key_id = tk.id 
      WHERE t.language_code = ${languageCode} AND t.is_approved = true
    `

    const translations: Record<string, string> = {}
    result.forEach((row: any) => {
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
    let result = await sql`
      SELECT t.value 
      FROM translations t 
      JOIN translation_keys tk ON t.key_id = tk.id 
      WHERE tk.key_name = ${key} AND t.language_code = ${languageCode} AND t.is_approved = true
    `

    if (result.length > 0) {
      return result[0].value
    }

    // Fallback to default language
    if (languageCode !== fallbackLanguage) {
      result = await sql`
        SELECT t.value 
        FROM translations t 
        JOIN translation_keys tk ON t.key_id = tk.id 
        WHERE tk.key_name = ${key} AND t.language_code = ${fallbackLanguage} AND t.is_approved = true
      `

      if (result.length > 0) {
        return result[0].value
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
    const result = await sql`
      SELECT 
        tk.id, tk.key_name, tk.category, tk.description, tk.created_at,
        COALESCE(
          json_object_agg(t.language_code, t.value) FILTER (WHERE t.language_code IS NOT NULL),
          '{}'::json
        ) as translations
      FROM translation_keys tk
      LEFT JOIN translations t ON tk.id = t.key_id AND t.is_approved = true
      GROUP BY tk.id, tk.key_name, tk.category, tk.description, tk.created_at
      ORDER BY tk.category, tk.key_name
    `

    return result.map((row: any) => ({
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
    // Ensure translation key exists
    const keyResult = await sql`SELECT id FROM translation_keys WHERE key_name = ${keyName}`

    let keyId: number
    if (keyResult.length === 0) {
      // Create new translation key
      const newKeyResult = await sql`
        INSERT INTO translation_keys (key_name, category) 
        VALUES (${keyName}, ${category || "general"}) 
        RETURNING id
      `
      keyId = newKeyResult[0].id
    } else {
      keyId = keyResult[0].id
    }

    // Upsert translation using sql.query for complex operation
    await sql.query(
      `INSERT INTO translations (key_id, language_code, value, is_approved) 
       VALUES ($1, $2, $3, true) 
       ON CONFLICT (key_id, language_code) 
       DO UPDATE SET value = $3, updated_at = CURRENT_TIMESTAMP`,
      [keyId, languageCode, value],
    )

    return true
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
      await sql`
        DELETE FROM translations 
        WHERE key_id = (SELECT id FROM translation_keys WHERE key_name = ${keyName}) 
        AND language_code = ${languageCode}
      `
    } else {
      // Delete all translations for this key
      await sql`DELETE FROM translation_keys WHERE key_name = ${keyName}`
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
    return await sql`SELECT * FROM page_translations WHERE page_id = ${pageId} ORDER BY language_code`
  } catch (error) {
    console.error("Error fetching page translations:", error)
    return []
  }
}

// Get page translation by language
export async function getPageTranslation(pageId: number, languageCode: string): Promise<PageTranslation | null> {
  try {
    const result =
      await sql`SELECT * FROM page_translations WHERE page_id = ${pageId} AND language_code = ${languageCode}`
    return result[0] || null
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
    const values = fields.map((field) => data[field as keyof PageTranslation])

    const query = `
      INSERT INTO page_translations (page_id, language_code, ${fields.join(", ")}) 
      VALUES ($1, $2, ${fields.map((_, i) => `$${i + 3}`).join(", ")}) 
      ON CONFLICT (page_id, language_code) 
      DO UPDATE SET ${fields.map((field, i) => `${field} = $${i + 3}`).join(", ")}, updated_at = CURRENT_TIMESTAMP 
      RETURNING *
    `

    const result = await sql.query(query, [pageId, languageCode, ...values])
    return result[0] || null
  } catch (error) {
    console.error("Error upserting page translation:", error)
    return null
  }
}

// Get i18n settings
export async function getI18nSettings(): Promise<I18nSettings | null> {
  try {
    const result = await sql`SELECT * FROM i18n_settings ORDER BY id DESC LIMIT 1`
    return result[0] || null
  } catch (error) {
    console.error("Error fetching i18n settings:", error)
    return null
  }
}

// Update i18n settings
export async function updateI18nSettings(settings: Partial<I18nSettings>): Promise<I18nSettings | null> {
  try {
    const fields = Object.keys(settings).filter((key) => key !== "id")
    const values = fields.map((field) => settings[field as keyof I18nSettings])
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(", ")

    const query = `
      UPDATE i18n_settings SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = (SELECT id FROM i18n_settings ORDER BY id DESC LIMIT 1) 
      RETURNING *
    `

    const result = await sql.query(query, values)
    return result[0] || null
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
    if (settings?.auto_detect_language && browserLanguage) {
      const browserLangCode = browserLanguage.split("-")[0].toLowerCase()
      const lang = await getLanguageByCode(browserLangCode)
      if (lang) return browserLangCode
    }

    // 3. IP-based geolocation (if enabled)
    if (settings?.auto_detect_language && ipCountry) {
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
    await sql.query(
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
    const result = await sql`
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
    `

    return result
  } catch (error) {
    console.error("Error fetching missing translations:", error)
    return []
  }
}
