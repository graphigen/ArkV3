import { type NextRequest, NextResponse } from "next/server"
import { getPageSEO, upsertPageSEO } from "@/lib/seo"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pageId = Number.parseInt(params.id)
    const { searchParams } = new URL(request.url)
    const languageCode = searchParams.get("lang") || "tr"

    const seoData = await getPageSEO(pageId, languageCode)
    return NextResponse.json(seoData || {})
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch page SEO" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const pageId = Number.parseInt(params.id)
    const data = await request.json()

    const seoData = {
      ...data,
      pageId,
    }

    const result = await upsertPageSEO(seoData)

    if (!result) {
      return NextResponse.json({ error: "Failed to update page SEO" }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update page SEO" }, { status: 500 })
  }
}
