import { type NextRequest, NextResponse } from "next/server"
import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

let sql: NeonQueryFunction<false, false>

try {
  if (!process.env.DATABASE_URL) {
    console.error("CRITICAL: PAGES/[id] API - DATABASE_URL not set.")
    throw new Error("DATABASE_URL not set")
  }
  sql = neon(process.env.DATABASE_URL!)
} catch (e: any) {
  console.error("CRITICAL: PAGES/[id] API - Failed to initialize Neon SQL client:", e.message)
  // sql kalacak tanımsız veya hatalı, aşağıdaki handler'lar bunu kontrol etmeli
}

// Belirli bir sayfayı ID ile getir
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!sql || typeof sql !== "function") {
    console.error("PAGES/[id] API GET: SQL client not initialized.")
    return NextResponse.json({ error: "Database connection failed." }, { status: 500 })
  }
  try {
    const id = Number.parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 })
    }

    const page = await sql`
      SELECT 
        id, title, slug, content, excerpt, status, language,
        seo_title, seo_description, template, views, 
        published_at, created_at, updated_at, author_id, parent_id, menu_order,
        noindex, canonical_url, og_title, og_description, og_image,
        custom_css, custom_js, featured_image
      FROM pages 
      WHERE id = ${id}
    `

    if (page.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }
    return NextResponse.json(page[0])
  } catch (error: any) {
    console.error(`PAGES/[id] API GET Error (ID: ${params.id}):`, {
      message: error.message,
      stack: error.stack,
      pgErrorCode: error.code,
    })
    return NextResponse.json({ error: "Failed to fetch page." }, { status: 500 })
  }
}

// Belirli bir sayfayı ID ile sil
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!sql || typeof sql !== "function") {
    console.error("PAGES/[id] API DELETE: SQL client not initialized.")
    return NextResponse.json({ error: "Database connection failed." }, { status: 500 })
  }
  try {
    const id = Number.parseInt(params.id)
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid page ID" }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM pages 
      WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found or could not be deleted" }, { status: 404 })
    }
    return NextResponse.json({ message: "Page deleted successfully", id: result[0].id })
  } catch (error: any) {
    console.error(`PAGES/[id] API DELETE Error (ID: ${params.id}):`, {
      message: error.message,
      stack: error.stack,
      pgErrorCode: error.code,
    })
    return NextResponse.json({ error: "Failed to delete page." }, { status: 500 })
  }
}
