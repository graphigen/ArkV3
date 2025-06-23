import { type NextRequest, NextResponse } from "next/server"
import { getMenuItems, createMenuItem, updateMenuItem } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "header"
    const language = searchParams.get("language") || "tr"

    const menuItems = await getMenuItems(location, language)

    // Add page information
    const itemsWithPages = menuItems.map((item) => ({
      ...item,
      url: item.url || `/${item.page_slug || ""}`,
    }))

    return NextResponse.json(itemsWithPages)
  } catch (error) {
    console.error("Error in GET /api/admin/menus:", error)
    return NextResponse.json({ error: "Menü öğeleri yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json()

    // Validate required fields
    if (!itemData.title || !itemData.menu_location) {
      return NextResponse.json({ error: "Başlık ve menü konumu gereklidir" }, { status: 400 })
    }

    const newItemData = {
      menu_location: itemData.menu_location,
      title: itemData.title,
      url: itemData.url || null,
      page_id: itemData.page_id || null,
      parent_id: itemData.parent_id || null,
      menu_order: itemData.menu_order || 1,
      target: itemData.target || "_self",
      css_class: itemData.css_class || "",
      icon: itemData.icon || "",
      is_active: itemData.is_active !== false,
      language: itemData.language || "tr",
      visibility: itemData.visibility || "public",
    }

    const result = await createMenuItem(newItemData)

    if (!result) {
      return NextResponse.json({ error: "Menü öğesi oluşturulamadı" }, { status: 500 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/admin/menus:", error)
    return NextResponse.json({ error: "Menü öğesi oluşturulamadı" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, items, id, ...itemData } = await request.json()

    if (action === "reorder" && items) {
      // Bulk reorder
      const updatePromises = items.map((item: any) =>
        updateMenuItem(item.id, {
          menu_order: item.menu_order,
          parent_id: item.parent_id || null,
        }),
      )

      await Promise.all(updatePromises)
      return NextResponse.json({ success: true, message: "Menü sıralaması güncellendi" })
    }

    if (id) {
      // Single item update
      const result = await updateMenuItem(id, itemData)

      if (!result) {
        return NextResponse.json({ error: "Menü öğesi güncellenemedi" }, { status: 500 })
      }

      return NextResponse.json(result)
    }

    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 })
  } catch (error) {
    console.error("Error in PUT /api/admin/menus:", error)
    return NextResponse.json({ error: "Menü öğesi güncellenemedi" }, { status: 500 })
  }
}
