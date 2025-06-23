import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 50

    let query = `
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
        bp.featured_image, bp.status, bp.published_at, 
        bp.views, bp.reading_time, bp.tags,
        bp.created_at, bp.updated_at,
        bp.author_id, bp.category_id,
        bc.name as category_name, bc.slug as category_slug,
        au.username as author_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN admin_users au ON bp.author_id = au.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (status && status !== "all") {
      query += ` AND bp.status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    if (category && category !== "all") {
      query += ` AND bp.category_id = $${paramIndex}`
      params.push(Number.parseInt(category))
      paramIndex++
    }

    if (search) {
      query += ` AND (bp.title ILIKE $${paramIndex} OR bp.content ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` ORDER BY bp.created_at DESC`

    if (limit) {
      query += ` LIMIT $${paramIndex}`
      params.push(limit)
    }

    const posts = await sql.query(query, params)
    return NextResponse.json(posts)
  } catch (error) {
    console.error("Blog Posts API Error:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
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

    // Calculate reading time
    if (!data.reading_time && data.content) {
      const wordsPerMinute = 200
      const wordCount = data.content.split(/\s+/).length
      data.reading_time = Math.ceil(wordCount / wordsPerMinute)
    }

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image, 
        category_id, author_id, status, published_at, 
        reading_time, tags, meta_title, meta_description
      ) VALUES (
        ${data.title}, ${data.slug}, ${data.excerpt}, ${data.content}, 
        ${data.featured_image || null}, ${data.category_id || null}, 
        ${data.author_id || 1}, ${data.status}, 
        ${data.status === "published" ? new Date() : null},
        ${data.reading_time || 5}, ${JSON.stringify(data.tags || [])},
        ${data.meta_title || data.title}, ${data.meta_description || data.excerpt}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Blog Posts POST Error:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
