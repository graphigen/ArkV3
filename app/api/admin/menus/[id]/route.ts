import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz menü ID" }, { status: 400 })
    }

    const result = await pool.query(
      `SELECT mi.*, p.title as page_title, p.slug as page_slug 
       FROM menu_items mi 
       LEFT JOIN pages p ON mi.page_id = p.id 
       WHERE mi.id = $1`,
      [id],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Menü öğesi bulunamadı" }, { status: 404 })
    }

    const item = {
      ...result.rows[0],
      url: result.rows[0].url || result.rows[0].page_slug,
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error in GET /api/admin/menus/[id]:", error)
    return NextResponse.json({ error: "Menü öğesi yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz menü ID" }, { status: 400 })
    }

    const itemData = await request.json()

    const result = await pool.query(
      `UPDATE menu_items SET 
        title = $1, url = $2, page_id = $3, parent_id = $4, target = $5,
        css_class = $6, icon = $7, is_active = $8, visibility = $9,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 RETURNING *`,
      [
        itemData.title,
        itemData.url || null,
        itemData.page_id || null,
        itemData.parent_id || null,
        itemData.target || "_self",
        itemData.css_class || "",
        itemData.icon || "",
        itemData.is_active !== false,
        itemData.visibility || "public",
        id,
      ],
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Menü öğesi bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error("Error in PUT /api/admin/menus/[id]:", error)
    return NextResponse.json({ error: "Menü öğesi güncellenemedi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz menü ID" }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query("BEGIN")

      // Alt menüleri de sil
      await client.query("DELETE FROM menu_items WHERE parent_id = $1", [id])

      // Ana öğeyi sil
      const result = await client.query("DELETE FROM menu_items WHERE id = $1", [id])

      if (result.rowCount === 0) {
        await client.query("ROLLBACK")
        return NextResponse.json({ error: "Menü öğesi bulunamadı" }, { status: 404 })
      }

      await client.query("COMMIT")
      return NextResponse.json({ success: true, message: "Menü öğesi başarıyla silindi" })
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error("Error in DELETE /api/admin/menus/[id]:", error)
    return NextResponse.json({ error: "Menü öğesi silinemedi" }, { status: 500 })
  }
}
