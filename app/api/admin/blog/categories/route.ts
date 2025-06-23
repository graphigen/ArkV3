import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const categories = await sql`
      SELECT 
        bc.id, bc.name, bc.slug, bc.description, bc.color,
        COUNT(bp.id) as post_count
      FROM blog_categories bc
      LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.status = 'published'
      GROUP BY bc.id, bc.name, bc.slug, bc.description, bc.color
      ORDER BY bc.name
    `
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Blog Categories API Error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    const result = await sql`
      INSERT INTO blog_categories (name, slug, description, color)
      VALUES (${data.name}, ${data.slug}, ${data.description || null}, ${data.color || "#6B7280"})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Blog Categories POST Error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
