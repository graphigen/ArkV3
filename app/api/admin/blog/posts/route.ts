import { type NextRequest, NextResponse } from "next/server"
import { getAllBlogPosts, createBlogPost, calculateReadingTime, generateSlug } from "@/lib/blog"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const status = searchParams.get("status") || undefined
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

    const posts = await getAllBlogPosts({ category, status, limit })

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
      data.slug = generateSlug(data.title)
    }

    // Calculate reading time
    if (!data.readingTime && data.content) {
      data.readingTime = calculateReadingTime(data.content)
    }

    const newPost = await createBlogPost({
      ...data,
      authorId: data.authorId || 1,
      publishedAt: data.status === "published" ? new Date() : null,
    })

    if (!newPost) {
      return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
    }

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Blog Posts POST Error:", error)
    return NextResponse.json({ error: "Failed to create blog post" }, { status: 500 })
  }
}
