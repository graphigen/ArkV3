import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      SELECT * FROM pages WHERE id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Page GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

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
    console.error("Page PUT Error:", error)
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const result = await sql`
      DELETE FROM pages WHERE id = ${id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Page deleted successfully" })
  } catch (error) {
    console.error("Page DELETE Error:", error)
    return NextResponse.json({ error: "Failed to delete page" }, { status: 500 })
  }
}
