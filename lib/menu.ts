import { pool } from "./database"

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
  children?: MenuItem[]
  created_at: Date
  updated_at: Date
}

export interface MenuLocation {
  id: number
  location_key: string
  location_name: string
  description?: string
  is_active: boolean
  created_at: Date
}

// Get all menu locations
export async function getMenuLocations(): Promise<MenuLocation[]> {
  try {
    const result = await pool.query("SELECT * FROM menu_locations WHERE is_active = true ORDER BY location_name")
    return result.rows
  } catch (error) {
    console.error("Error fetching menu locations:", error)
    return []
  }
}

// Get menu items for a specific location
export async function getMenuItems(location: string, language = "tr"): Promise<MenuItem[]> {
  try {
    const result = await pool.query(
      `SELECT mi.*, p.title as page_title, p.slug as page_slug 
       FROM menu_items mi 
       LEFT JOIN pages p ON mi.page_id = p.id 
       WHERE mi.menu_location = $1 AND mi.language = $2 AND mi.is_active = true 
       ORDER BY mi.menu_order ASC`,
      [location, language],
    )

    const items = result.rows.map((row) => ({
      ...row,
      url: row.url || row.page_slug,
    }))

    // Build hierarchical structure
    return buildMenuHierarchy(items)
  } catch (error) {
    console.error("Error fetching menu items:", error)
    return []
  }
}

// Build hierarchical menu structure
function buildMenuHierarchy(items: MenuItem[]): MenuItem[] {
  const itemMap = new Map<number, MenuItem>()
  const rootItems: MenuItem[] = []

  // First pass: create map of all items
  items.forEach((item) => {
    itemMap.set(item.id, { ...item, children: [] })
  })

  // Second pass: build hierarchy
  items.forEach((item) => {
    const menuItem = itemMap.get(item.id)!
    if (item.parent_id && itemMap.has(item.parent_id)) {
      const parent = itemMap.get(item.parent_id)!
      parent.children!.push(menuItem)
    } else {
      rootItems.push(menuItem)
    }
  })

  return rootItems
}

// Get all menu items for admin (flat structure)
export async function getAllMenuItems(location?: string, language = "tr"): Promise<MenuItem[]> {
  try {
    let query = `SELECT mi.*, p.title as page_title, p.slug as page_slug 
                 FROM menu_items mi 
                 LEFT JOIN pages p ON mi.page_id = p.id 
                 WHERE mi.language = $1`
    const params: any[] = [language]

    if (location) {
      query += " AND mi.menu_location = $2"
      params.push(location)
    }

    query += " ORDER BY mi.menu_location, mi.menu_order ASC"

    const result = await pool.query(query, params)
    return result.rows.map((row) => ({
      ...row,
      url: row.url || row.page_slug,
    }))
  } catch (error) {
    console.error("Error fetching all menu items:", error)
    return []
  }
}

// Create menu item
export async function createMenuItem(
  itemData: Omit<MenuItem, "id" | "created_at" | "updated_at">,
): Promise<MenuItem | null> {
  try {
    const columns = Object.keys(itemData).join(", ")
    const placeholders = Object.keys(itemData)
      .map((_, index) => `$${index + 1}`)
      .join(", ")
    const values = Object.values(itemData)

    const result = await pool.query(`INSERT INTO menu_items (${columns}) VALUES (${placeholders}) RETURNING *`, values)

    return result.rows[0] || null
  } catch (error) {
    console.error("Error creating menu item:", error)
    return null
  }
}

// Update menu item
export async function updateMenuItem(id: number, itemData: Partial<MenuItem>): Promise<MenuItem | null> {
  try {
    const setClause = Object.keys(itemData)
      .filter((key) => key !== "id")
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ")

    const values = Object.keys(itemData)
      .filter((key) => key !== "id")
      .map((key) => itemData[key as keyof MenuItem])

    const result = await pool.query(
      `UPDATE menu_items SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id],
    )

    return result.rows[0] || null
  } catch (error) {
    console.error("Error updating menu item:", error)
    return null
  }
}

// Delete menu item
export async function deleteMenuItem(id: number): Promise<boolean> {
  try {
    const result = await pool.query("DELETE FROM menu_items WHERE id = $1", [id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Error deleting menu item:", error)
    return false
  }
}

// Update menu order
export async function updateMenuOrder(
  items: { id: number; menu_order: number; parent_id?: number }[],
): Promise<boolean> {
  try {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      for (const item of items) {
        await client.query(
          "UPDATE menu_items SET menu_order = $1, parent_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3",
          [item.menu_order, item.parent_id || null, item.id],
        )
      }

      await client.query("COMMIT")
      return true
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error updating menu order:", error)
    return false
  }
}
