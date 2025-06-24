import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { UpdateBlogPostSchema, IdSchema } from "@/lib/schemas" // Şemaları import et
import { ZodError } from "zod"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paramsValidation = IdSchema.safeParse(params)
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Geçersiz ID formatı.", details: paramsValidation.error.errors },
        { status: 400 },
      )
    }
    const id = paramsValidation.data.id

    const result = await sql`
      SELECT 
        bp.*, bc.name as category_name, bc.slug as category_slug,
        au.username as author_name
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      LEFT JOIN admin_users au ON bp.author_id = au.id
      WHERE bp.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (error) {
    console.error(`Blog Post [${params.id}] GET Error:`, error)
    return NextResponse.json({ error: "Yazı yüklenemedi." }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const currentUserIdHeader = request.headers.get("x-user-id")
  const currentUserRole = request.headers.get("x-user-role")

  if (!currentUserIdHeader || !currentUserRole) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }
  const currentUserId = Number(currentUserIdHeader)

  try {
    const paramsValidation = IdSchema.safeParse(params)
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Geçersiz ID formatı.", details: paramsValidation.error.errors },
        { status: 400 },
      )
    }
    const id = paramsValidation.data.id

    const body = await request.json()
    const validatedData = UpdateBlogPostSchema.partial().parse(body) // partial() ile tüm alanlar opsiyonel

    // Yazının sahibini kontrol et (admin değilse)
    if (currentUserRole !== "admin") {
      const postOwnerResult = await sql`SELECT author_id FROM blog_posts WHERE id = ${id}`
      if (postOwnerResult.length === 0) {
        return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 })
      }
      if (postOwnerResult[0].author_id !== currentUserId) {
        return NextResponse.json({ error: "Bu yazıyı güncelleme yetkiniz yok." }, { status: 403 })
      }
    }

    // Calculate reading time if content changed
    let readingTimeUpdateSql = ""
    if (validatedData.content && typeof validatedData.content === "string") {
      const wordsPerMinute = 200
      const wordCount = validatedData.content.split(/\s+/).length
      const newReadingTime = Math.ceil(wordCount / wordsPerMinute)
      readingTimeUpdateSql = `reading_time = ${newReadingTime},`
    }

    const { title, slug, excerpt, content, featured_image, category_id, status, tags, meta_title, meta_description } =
      validatedData

    const result = await sql`
      UPDATE blog_posts 
      SET 
        title = COALESCE(${title}, title),
        slug = COALESCE(${slug}, slug),
        excerpt = COALESCE(${excerpt}, excerpt),
        content = COALESCE(${content}, content),
        featured_image = COALESCE(${featured_image}, featured_image),
        category_id = COALESCE(${category_id}, category_id),
        status = COALESCE(${status}, status),
        published_at = CASE 
          WHEN ${status} = 'published' AND published_at IS NULL THEN CURRENT_TIMESTAMP 
          WHEN ${status} != 'published' THEN NULL -- Eğer draft veya archived yapılıyorsa yayın tarihini kaldır
          ELSE published_at 
        END,
        ${sql.raw(readingTimeUpdateSql)} -- Dinamik SQL parçası
        tags = COALESCE(${tags ? JSON.stringify(tags) : undefined}, tags),
        meta_title = COALESCE(${meta_title}, meta_title),
        meta_description = COALESCE(${meta_description}, meta_description),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Yazı bulunamadı veya güncellenemedi." }, { status: 404 })
    }

    return NextResponse.json(result[0])
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
    console.error(`Blog Post [${params.id}] PUT Error:`, error)
    return NextResponse.json({ error: "Yazı güncellenemedi." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const currentUserIdHeader = request.headers.get("x-user-id")
  const currentUserRole = request.headers.get("x-user-role")

  if (!currentUserIdHeader || !currentUserRole) {
    return NextResponse.json({ error: "Yetkisiz işlem." }, { status: 401 })
  }
  const currentUserId = Number(currentUserIdHeader)

  try {
    const paramsValidation = IdSchema.safeParse(params)
    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Geçersiz ID formatı.", details: paramsValidation.error.errors },
        { status: 400 },
      )
    }
    const id = paramsValidation.data.id

    // Yazının sahibini kontrol et (admin değilse)
    if (currentUserRole !== "admin") {
      const postOwnerResult = await sql`SELECT author_id FROM blog_posts WHERE id = ${id}`
      if (postOwnerResult.length === 0) {
        return NextResponse.json({ error: "Yazı bulunamadı." }, { status: 404 })
      }
      if (postOwnerResult[0].author_id !== currentUserId) {
        return NextResponse.json({ error: "Bu yazıyı silme yetkiniz yok." }, { status: 403 })
      }
    }

    const result = await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Yazı bulunamadı veya silinemedi." }, { status: 404 })
    }

    return NextResponse.json({ message: "Yazı başarıyla silindi." })
  } catch (error) {
    console.error(`Blog Post [${params.id}] DELETE Error:`, error)
    return NextResponse.json({ error: "Yazı silinemedi." }, { status: 500 })
  }
}
