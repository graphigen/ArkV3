import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const result = await sql`
      SELECT 
        bp.*, bc.name as category_name, bc.slug as category_slug,
        au.username as author_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN admin_users au ON bp.author_id = au.id
      WHERE bp.id = ${id}
    `

    if (!result[0]) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Blog Post [${params.id}] GET Error:`, error)
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    // Calculate reading time if content changed
    if (data.content && !data.reading_time) {
      const wordsPerMinute = 200
      const wordCount = data.content.split(/\s+/).length
      data.reading_time = Math.ceil(wordCount / wordsPerMinute)
    }

    const result = await sql`
      UPDATE blog_posts 
      SET 
        title = COALESCE(${data.title}, title),
        slug = COALESCE(${data.slug}, slug),
        excerpt = COALESCE(${data.excerpt}, excerpt),
        content = COALESCE(${data.content}, content),
        featured_image = COALESCE(${data.featured_image}, featured_image),
        category_id = COALESCE(${data.category_id}, category_id),
        status = COALESCE(${data.status}, status),
        published_at = CASE 
          WHEN ${data.status} = 'published' AND published_at IS NULL 
          THEN CURRENT_TIMESTAMP 
          ELSE published_at 
        END,
        reading_time = COALESCE(${data.reading_time}, reading_time),
        tags = COALESCE(${JSON.stringify(data.tags)}, tags),
        meta_title = COALESCE(${data.meta_title}, meta_title),
        meta_description = COALESCE(${data.meta_description}, meta_description),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (!result[0]) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Blog Post [${params.id}] PUT Error:`, error)
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const result = await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING id`

    if (!result[0]) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    console.error(`Blog Post [${params.id}] DELETE Error:`, error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
