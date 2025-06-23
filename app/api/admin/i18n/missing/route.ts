import { type NextRequest, NextResponse } from "next/server"
import { getMissingTranslations } from "@/lib/i18n"

export async function GET(request: NextRequest) {
  try {
    const missingTranslations = await getMissingTranslations()
    return NextResponse.json(missingTranslations)
  } catch (error) {
    console.error("Error in GET /api/admin/i18n/missing:", error)
    return NextResponse.json({ error: "Eksik çeviriler yüklenemedi" }, { status: 500 })
  }
}
