import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { CreateBlogCategorySchema } from "@/lib/schemas" // Şemayı import et
import { ZodError } from "zod"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Middleware zaten rol kontrolü yapıyor
    // const userId = request.headers.get('x-user-id'); // Gerekirse kullanıcı ID'sini al
    // const userRole = request.headers.get('x-user-role'); // Gerekirse kullanıcı rolünü al

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
    console.error("Blog Categories API GET Error:", error)
    return NextResponse.json({ error: "Kategoriler yüklenemedi." }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateBlogCategorySchema.parse(body) // Veriyi doğrula

    // Slug zaten şemada zorunlu ve regex ile kontrol ediliyor.
    // Eğer slug client'tan gelmiyorsa ve sunucuda oluşturulacaksa:
    // let slug = validatedData.slug;
    // if (!slug) {
    //   slug = validatedData.name
    //     .toLowerCase()
    //     .replace(/[^a-z0-9\s-]/g, "")
    //     .replace(/\s+/g, "-")
    //     .replace(/-+/g, "-")
    //     .trim();
    // }

    const result = await sql`
      INSERT INTO blog_categories (name, slug, description, color)
      VALUES (${validatedData.name}, ${validatedData.slug}, ${validatedData.description || null}, ${validatedData.color})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Geçersiz veri.", details: error.errors }, { status: 400 })
    }
    if (error instanceof Error && error.message.includes("unique constraint")) {
      if (error.message.includes("blog_categories_slug_key")) {
        return NextResponse.json({ error: "Bu slug zaten kullanımda." }, { status: 409 })
      }
      if (error.message.includes("blog_categories_name_key")) {
        return NextResponse.json({ error: "Bu kategori adı zaten kullanımda." }, { status: 409 })
      }
      return NextResponse.json({ error: "Benzersizlik kısıtlaması ihlal edildi." }, { status: 409 })
    }
    console.error("Blog Categories API POST Error:", error)
    return NextResponse.json({ error: "Kategori oluşturulamadı." }, { status: 500 })
  }
}
