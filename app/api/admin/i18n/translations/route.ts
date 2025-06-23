import { type NextRequest, NextResponse } from "next/server"
import { getAllTranslationKeys, upsertTranslation, deleteTranslation } from "@/lib/i18n"

export async function GET(request: NextRequest) {
  try {
    const translationKeys = await getAllTranslationKeys()
    return NextResponse.json(translationKeys)
  } catch (error) {
    console.error("Error in GET /api/admin/i18n/translations:", error)
    return NextResponse.json({ error: "Çeviriler yüklenemedi" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { keyName, languageCode, value, category } = await request.json()

    if (!keyName || !languageCode || !value) {
      return NextResponse.json({ error: "Gerekli alanlar eksik" }, { status: 400 })
    }

    const success = await upsertTranslation(keyName, languageCode, value, category)

    if (!success) {
      return NextResponse.json({ error: "Çeviri kaydedilemedi" }, { status: 500 })
    }

    return NextResponse.json({ message: "Çeviri başarıyla kaydedildi" })
  } catch (error) {
    console.error("Error in POST /api/admin/i18n/translations:", error)
    return NextResponse.json({ error: "Çeviri kaydedilemedi" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const keyName = searchParams.get("key")
    const languageCode = searchParams.get("language")

    if (!keyName) {
      return NextResponse.json({ error: "Çeviri anahtarı gerekli" }, { status: 400 })
    }

    const success = await deleteTranslation(keyName, languageCode || undefined)

    if (!success) {
      return NextResponse.json({ error: "Çeviri silinemedi" }, { status: 500 })
    }

    return NextResponse.json({ message: "Çeviri başarıyla silindi" })
  } catch (error) {
    console.error("Error in DELETE /api/admin/i18n/translations:", error)
    return NextResponse.json({ error: "Çeviri silinemedi" }, { status: 500 })
  }
}
