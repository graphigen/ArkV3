import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()
    const { title, url, page_id, parent_id, target, css_class, icon, is_active, visibility, menu_order } = data

    const result = await sql`
      UPDATE menu_items 
      SET 
        title = ${title},
        url = ${url || null},
        page_id = ${page_id || null},
        parent_id = ${parent_id || null},
        target = ${target || "_self"},
        css_class = ${css_class || null},
        icon = ${icon || null},
        is_active = ${is_active !== false},
        visibility = ${visibility || "public"},
        menu_order = ${menu_order || 1},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Menu item update error:", error)
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    // Delete children first
    await sql`DELETE FROM menu_items WHERE parent_id = ${id}`

    // Delete the item
    const result = await sql`DELETE FROM menu_items WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Menu item deletion error:", error)
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 })
  }
}
