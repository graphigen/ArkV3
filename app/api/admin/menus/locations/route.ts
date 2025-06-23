import { NextResponse } from "next/server"

// Mock menu locations data
const mockMenuLocations = [
  {
    location_key: "header",
    location_name: "Üst Menü (Header)",
    description: "Sitenin üst kısmında görünen ana navigasyon menüsü",
    is_active: true,
    max_depth: 2,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    location_key: "footer",
    location_name: "Alt Menü (Footer)",
    description: "Sitenin alt kısmında görünen menü",
    is_active: true,
    max_depth: 1,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    location_key: "sidebar",
    location_name: "Yan Menü (Sidebar)",
    description: "Sayfa kenarında görünen menü",
    is_active: true,
    max_depth: 3,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
  {
    location_key: "mobile",
    location_name: "Mobil Menü",
    description: "Mobil cihazlarda görünen menü",
    is_active: true,
    max_depth: 2,
    created_at: new Date("2024-01-01"),
    updated_at: new Date("2024-01-01"),
  },
]

export async function GET() {
  try {
    return NextResponse.json(mockMenuLocations)
  } catch (error) {
    console.error("Error in GET /api/admin/menus/locations:", error)
    return NextResponse.json({ error: "Menü konumları yüklenemedi" }, { status: 500 })
  }
}
