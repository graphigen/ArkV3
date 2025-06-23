import { type NextRequest, NextResponse } from "next/server"
import { getMenuItems } from "@/lib/menu"

export async function GET(request: NextRequest, { params }: { params: { location: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") || "tr"

    const menuItems = await getMenuItems(params.location, language)
    return NextResponse.json(menuItems)
  } catch (error) {
    console.error("Error in GET /api/menus/[location]:", error)
    return NextResponse.json({ error: "Menü öğeleri yüklenemedi" }, { status: 500 })
  }
}
