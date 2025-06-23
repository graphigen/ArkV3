import { type NextRequest, NextResponse } from "next/server"
import { getI18nSettings, updateI18nSettings } from "@/lib/i18n"

export async function GET(request: NextRequest) {
  try {
    const settings = await getI18nSettings()
    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error in GET /api/admin/i18n/settings:", error)
    return NextResponse.json({ error: "Dil ayarları yüklenemedi" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json()
    const updatedSettings = await updateI18nSettings(settings)

    if (!updatedSettings) {
      return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 })
    }

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error("Error in PUT /api/admin/i18n/settings:", error)
    return NextResponse.json({ error: "Ayarlar güncellenemedi" }, { status: 500 })
  }
}
