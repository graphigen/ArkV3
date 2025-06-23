import { type NextRequest, NextResponse } from "next/server"
import { getPage } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: { slug: string[] } }) {
  try {
    const slug = "/" + params.slug.join("/")
    const page = await getPage(slug)

    if (!page || page.status !== "published") {
      return NextResponse.json({ error: "Sayfa bulunamadı" }, { status: 404 })
    }

    // Increment view count
    // await incrementPageViews(page.id)

    return NextResponse.json(page)
  } catch (error) {
    console.error("Error in GET /api/pages/[...slug]:", error)
    return NextResponse.json({ error: "Sayfa yüklenemedi" }, { status: 500 })
  }
}
