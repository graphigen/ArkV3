import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { CreateBlogPostSchema, PaginationSchema } from "@/lib/schemas" // Şemaları import et
import { ZodError } from "zod"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const validationResult = PaginationSchema.safeParse(Object.fromEntries(searchParams))

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Geçersiz sayfalama parametreleri.", details: validationResult.error.errors },
        { status: 400 },
      )
    }
    const { page, limit, search } = validationResult.data

    const categoryFilter = searchParams.get("category") // Bunlar özel filtreler, şemaya eklenebilir
    const statusFilter = searchParams.get("status")

    const offset = (page - 1) * limit

    let query = `
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, 
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

    if (statusFilter && statusFilter !== "all") {
      query += ` AND bp.status = $${params.length + 1}`
      params.push(statusFilter)
    }

    if (categoryFilter && categoryFilter !== "all") {
      query += ` AND bp.category_id = $${params.length + 1}`
      params.push(Number(categoryFilter))
    }

    if (search) {
      query += ` AND (bp.title ILIKE $${params.length + 1} OR bp.content ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    const countQuery = `SELECT COUNT(*) FROM (${query.replace(/SELECT.*?FROM/s, "SELECT bp.id FROM")}) AS subquery_count`
    const totalPostsResult = await sql.query(countQuery, params)
    const totalPosts = Number(totalPostsResult[0].count)

    query += ` ORDER BY bp.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const posts = await sql.query(query, params)

    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        totalItems: totalPosts,
        totalPages: Math.ceil(totalPosts / limit),
      },
    })
  } catch (error) {
    console.error("Blog Posts API GET Error:", error)
    return NextResponse.json({ error: "Blog yazıları yüklenemedi." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const authorIdHeader = request.headers.get("x-user-id")
  if (!authorIdHeader) {
    return NextResponse.json({ error: "Yetkisiz işlem: Kullanıcı ID bulunamadı." }, { status: 401 })
  }
  const authorId = Number(authorIdHeader)

  try {
    const body = await request.json()
    const validatedData = CreateBlogPostSchema.parse(body)

    // Slug zaten şemada zorunlu ve regex ile kontrol ediliyor.
    // Reading time
    let readingTime = 5 // default
    if (validatedData.content) {
      const wordsPerMinute = 200
      const wordCount = validatedData.content.split(/\s+/).length
      readingTime = Math.ceil(wordCount / wordsPerMinute)
    }

    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image, 
        category_id, author_id, status, published_at, 
        reading_time, tags, meta_title, meta_description
      ) VALUES (
        ${validatedData.title}, ${validatedData.slug}, ${validatedData.excerpt || null}, ${validatedData.content}, 
        ${validatedData.featured_image || null}, ${validatedData.category_id || null}, 
        ${authorId}, ${validatedData.status}, 
        ${validatedData.status === "published" ? new Date() : null},
        ${readingTime}, ${JSON.stringify(validatedData.tags || [])},
        ${validatedData.meta_title || validatedData.title}, 
        ${validatedData.meta_description || validatedData.excerpt || ""}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz veri.", details: error.errors }, { status: 400 })
    }
    if (error instanceof Error && error.message.includes("unique constraint")) {
      if (error.message.includes("blog_posts_slug_key")) {
        return NextResponse.json({ error: "Bu slug zaten kullanımda." }, { status: 409 })
      }
      return NextResponse.json({ error: "Benzersizlik kısıtlaması ihlal edildi." }, { status: 409 })
    }
    console.error("Blog Posts API POST Error:", error)
    return NextResponse.json({ error: "Blog yazısı oluşturulamadı." }, { status: 500 })
  }
}
