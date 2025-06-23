import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/lib/database"

// Gerçek site menülerinizi mock data olarak tanımlayalım
const mockMenuItems = [
  // Ana Menü Öğeleri
  {
    id: 1,
    menu_location: "header",
    title: "Anasayfa",
    url: "/",
    page_id: 1,
    parent_id: null,
    menu_order: 1,
    target: "_self",
    css_class: "",
    icon: "home",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 2,
    menu_location: "header",
    title: "Ürün ve Çözümler",
    url: "#",
    page_id: null,
    parent_id: null,
    menu_order: 2,
    target: "_self",
    css_class: "",
    icon: "package",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  // Ürün ve Çözümler Alt Menüleri
  {
    id: 3,
    menu_location: "header",
    title: "Tiger Torch Temizleme Üniteleri",
    url: "/urunler/tiger-torc",
    page_id: 2,
    parent_id: 2,
    menu_order: 1,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 4,
    menu_location: "header",
    title: "Plazma Kesim Sarf Malzemeleri",
    url: "/urunler/plazma-sarf",
    page_id: 3,
    parent_id: 2,
    menu_order: 2,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 5,
    menu_location: "header",
    title: "ABB Robot Servis ve Bakım",
    url: "/urunler/abb-servis",
    page_id: 4,
    parent_id: 2,
    menu_order: 3,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 6,
    menu_location: "header",
    title: "Fronius Kaynak Makina Servis",
    url: "/urunler/fronius-servis",
    page_id: 5,
    parent_id: 2,
    menu_order: 4,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  // Projelerimiz Ana Menü
  {
    id: 7,
    menu_location: "header",
    title: "Projelerimiz",
    url: "#",
    page_id: null,
    parent_id: null,
    menu_order: 3,
    target: "_self",
    css_class: "",
    icon: "briefcase",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  // Projelerimiz Alt Menüleri
  {
    id: 8,
    menu_location: "header",
    title: "Robotik Kaynak Hücreleri",
    url: "/projeler/robotik-kaynak",
    page_id: 6,
    parent_id: 7,
    menu_order: 1,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 9,
    menu_location: "header",
    title: "Fikstur Sistemleri",
    url: "/projeler/fikstur",
    page_id: 7,
    parent_id: 7,
    menu_order: 2,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 10,
    menu_location: "header",
    title: "Pozisyoner Sistemleri",
    url: "/projeler/pozisyoner",
    page_id: 8,
    parent_id: 7,
    menu_order: 3,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 11,
    menu_location: "header",
    title: "Robotik Slider Sistemleri",
    url: "/projeler/slider",
    page_id: 9,
    parent_id: 7,
    menu_order: 4,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 12,
    menu_location: "header",
    title: "Mekanize Çözümler",
    url: "/projeler/mekanize",
    page_id: 10,
    parent_id: 7,
    menu_order: 5,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 13,
    menu_location: "header",
    title: "Lazer Kesim Tezgahları",
    url: "/projeler/lazer-kesim",
    page_id: 11,
    parent_id: 7,
    menu_order: 6,
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  // Diğer Ana Menüler
  {
    id: 14,
    menu_location: "header",
    title: "Blog",
    url: "/blog",
    page_id: 12,
    parent_id: null,
    menu_order: 4,
    target: "_self",
    css_class: "",
    icon: "book-open",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    id: 15,
    menu_location: "header",
    title: "İletişim",
    url: "/iletisim",
    page_id: 13,
    parent_id: null,
    menu_order: 5,
    target: "_self",
    css_class: "",
    icon: "phone",
    is_active: true,
    visibility: "public",
    language: "tr",
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "header"
    const language = searchParams.get("language") || "tr"

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

    return NextResponse.json(items)
  } catch (error) {
    console.error("Error in GET /api/admin/menus:", error)
    return NextResponse.json({ error: "Menü öğeleri yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const itemData = await request.json()

    const result = await pool.query(
      `INSERT INTO menu_items (
        menu_location, title, url, page_id, parent_id, menu_order, 
        target, css_class, icon, is_active, language, visibility
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        itemData.menu_location,
        itemData.title,
        itemData.url || null,
        itemData.page_id || null,
        itemData.parent_id || null,
        itemData.menu_order || 1,
        itemData.target || "_self",
        itemData.css_class || "",
        itemData.icon || "",
        itemData.is_active !== false,
        itemData.language || "tr",
        itemData.visibility || "public",
      ],
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/admin/menus:", error)
    return NextResponse.json({ error: "Menü öğesi oluşturulamadı" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { action, items } = await request.json()

    if (action === "reorder" && items) {
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
        return NextResponse.json({ success: true, message: "Menü sıralaması güncellendi" })
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      } finally {
        client.release()
      }
    }

    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 })
  } catch (error) {
    console.error("Error in PUT /api/admin/menus:", error)
    return NextResponse.json({ error: "Menü öğesi güncellenemedi" }, { status: 500 })
  }
}
