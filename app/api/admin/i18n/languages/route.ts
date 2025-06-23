import { type NextRequest, NextResponse } from "next/server"
import { getLanguages } from "@/lib/i18n"

export async function GET(request: NextRequest) {
  try {
    const languages = await getLanguages()
    return NextResponse.json(languages)
  } catch (error) {
    console.error("Error in GET /api/admin/i18n/languages:", error)
    return NextResponse.json({ error: "Diller yüklenemedi" }, { status: 500 })
  }
}
