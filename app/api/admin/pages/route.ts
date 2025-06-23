import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language")

    let query = `
      SELECT 
        id, title, slug, content, excerpt, status, language,
        seo_title, seo_description, template, views, 
        published_at, created_at, updated_at
      FROM pages 
    `

    const params: any[] = []
    if (language) {
      query += ` WHERE language = $1`
      params.push(language)
    }

    query += ` ORDER BY created_at DESC`

    const pages = await sql(query, params)
    return NextResponse.json(pages)
  } catch (error) {
    console.error("Pages API Error:", error)
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    const result = await sql`
      INSERT INTO pages (
        title, slug, content, excerpt, status, language, 
        seo_title, seo_description, template, author_id
      )
      VALUES (
        ${data.title}, ${data.slug}, ${data.content}, ${data.excerpt}, 
        ${data.status || "draft"}, ${data.language || "tr"},
        ${data.seo_title}, ${data.seo_description}, ${data.template || "page"}, 1
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Pages POST Error:", error)
    return NextResponse.json({ error: "Failed to create page" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 })
    }

    const result = await sql`
      UPDATE pages 
      SET 
        title = COALESCE(${data.title}, title),
        slug = COALESCE(${data.slug}, slug),
        content = COALESCE(${data.content}, content),
        excerpt = COALESCE(${data.excerpt}, excerpt),
        status = COALESCE(${data.status}, status),
        language = COALESCE(${data.language}, language),
        seo_title = COALESCE(${data.seo_title}, seo_title),
        seo_description = COALESCE(${data.seo_description}, seo_description),
        template = COALESCE(${data.template}, template),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Pages PUT Error:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}
