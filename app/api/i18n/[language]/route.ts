import { type NextRequest, NextResponse } from "next/server"
import { getTranslations, getLanguageByCode } from "@/lib/i18n"

export async function GET(request: NextRequest, { params }: { params: { language: string } }) {
  try {
    const language = await getLanguageByCode(params.language)
    if (!language) {
      return NextResponse.json({ error: "Dil bulunamadı" }, { status: 404 })
    }

    const translations = await getTranslations(params.language)
    return NextResponse.json({
      language,
      translations,
    })
  } catch (error) {
    console.error("Error in GET /api/i18n/[language]:", error)
    return NextResponse.json({ error: "Çeviriler yüklenemedi" }, { status: 500 })
  }
}
