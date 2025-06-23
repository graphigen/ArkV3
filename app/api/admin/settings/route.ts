import { type NextRequest, NextResponse } from "next/server"
import { getSiteSettings, updateSiteSettings } from "@/lib/database"

export async function GET() {
  try {
    const settings = await getSiteSettings()

    if (!settings) {
      return NextResponse.json({ error: "Ayarlar bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error in GET /api/admin/settings:", error)
    return NextResponse.json({ error: "Ayarlar yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settingsData = await request.json()

    const updatedSettings = await updateSiteSettings(settingsData)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 })
    }

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error in PUT /api/admin/settings:", error)
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 })
  }
}
