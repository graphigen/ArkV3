import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  featuredImage?: string
  authorId: number
  categoryId?: number
  tags?: string[]
  status: "draft" | "published" | "scheduled"
  publishedAt?: Date
  scheduledAt?: Date
  metaTitle?: string
  metaDescription?: string
  readingTime?: number
  viewCount?: number
  likeCount?: number
  commentCount?: number
  isCommentEnabled?: boolean
  isFeatured?: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface BlogCategory {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  postCount?: number
  isActive?: boolean
}

export interface BlogComment {
  id: number
  postId: number
  parentId?: number
  authorName: string
  authorEmail: string
  authorWebsite?: string
  content: string
  status: "pending" | "approved" | "spam" | "rejected"
  ipAddress?: string
  userAgent?: string
  createdAt?: Date
}

// Blog Posts Functions
export async function getAllBlogPosts(options?: {
  category?: string
  status?: string
  limit?: number
  page?: number
}): Promise<BlogPost[]> {
  try {
    let query = `
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
        bp.featured_image as "featuredImage", bp.status, bp.published_at as "publishedAt", 
        bp.views as "viewCount", bp.reading_time as "readingTime", bp.tags,
        bp.created_at as "createdAt", bp.updated_at as "updatedAt",
        bp.author_id as "authorId", bp.category_id as "categoryId",
        bc.name as category_name, bc.slug as category_slug
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE 1=1
    `

    const params: any[] = []
    let paramIndex = 1

    if (options?.status && options.status !== "all") {
      query += ` AND bp.status = $${paramIndex}`
      params.push(options.status)
      paramIndex++
    }

    if (options?.category && options.category !== "all") {
      query += ` AND bp.category_id = $${paramIndex}`
      params.push(Number.parseInt(options.category))
      paramIndex++
    }

    query += ` ORDER BY bp.created_at DESC`

    if (options?.limit) {
      query += ` LIMIT $${paramIndex}`
      params.push(options.limit)
      paramIndex++
    }

    const result = await sql(query, params)
    return result as BlogPost[]
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const result = await sql`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.content,
        bp.featured_image as "featuredImage", bp.status, bp.published_at as "publishedAt",
        bp.views as "viewCount", bp.reading_time as "readingTime", bp.tags,
        bp.created_at as "createdAt", bp.updated_at as "updatedAt",
        bp.author_id as "authorId", bp.category_id as "categoryId",
        bc.name as category_name, bc.slug as category_slug
      FROM blog_posts bp
      LEFT JOIN blog_categories bc ON bp.category_id = bc.id
      WHERE bp.slug = ${slug} AND bp.status = 'published'
    `

    if (result[0]) {
      // Increment view count
      await sql`
        UPDATE blog_posts 
        SET views = COALESCE(views, 0) + 1 
        WHERE id = ${result[0].id}
      `
    }

    return result[0] || null
  } catch (error) {
    console.error("Error fetching post by slug:", error)
    return null
  }
}

export async function createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost | null> {
  try {
    const result = await sql`
      INSERT INTO blog_posts (
        title, slug, excerpt, content, featured_image, author_id, category_id,
        tags, status, published_at, meta_title, meta_description,
        reading_time
      ) VALUES (
        ${post.title}, ${post.slug}, ${post.excerpt}, ${post.content},
        ${post.featuredImage}, ${post.authorId}, ${post.categoryId},
        ${JSON.stringify(post.tags)}, ${post.status}, ${post.publishedAt},
        ${post.metaTitle}, ${post.metaDescription}, ${post.readingTime}
      )
      RETURNING *
    `
    return result[0] as BlogPost
  } catch (error) {
    console.error("Error creating blog post:", error)
    return null
  }
}

export async function updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const result = await sql`
      UPDATE blog_posts 
      SET 
        title = COALESCE(${post.title}, title),
        slug = COALESCE(${post.slug}, slug),
        excerpt = COALESCE(${post.excerpt}, excerpt),
        content = COALESCE(${post.content}, content),
        featured_image = COALESCE(${post.featuredImage}, featured_image),
        category_id = COALESCE(${post.categoryId}, category_id),
        tags = COALESCE(${JSON.stringify(post.tags)}, tags),
        status = COALESCE(${post.status}, status),
        published_at = COALESCE(${post.publishedAt}, published_at),
        meta_title = COALESCE(${post.metaTitle}, meta_title),
        meta_description = COALESCE(${post.metaDescription}, meta_description),
        reading_time = COALESCE(${post.readingTime}, reading_time),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `
    return result[0] as BlogPost
  } catch (error) {
    console.error("Error updating blog post:", error)
    return null
  }
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  try {
    await sql`DELETE FROM blog_posts WHERE id = ${id}`
    return true
  } catch (error) {
    console.error("Error deleting blog post:", error)
    return false
  }
}

// Blog Categories Functions
export async function getAllCategories(): Promise<BlogCategory[]> {
  try {
    const result = await sql`
      SELECT 
        bc.id, bc.name, bc.slug, bc.description, bc.color,
        COUNT(bp.id) as "postCount"
      FROM blog_categories bc
      LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.status = 'published'
      GROUP BY bc.id, bc.name, bc.slug, bc.description, bc.color
      ORDER BY bc.name
    `
    return result as BlogCategory[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function createCategory(category: Omit<BlogCategory, "id" | "postCount">): Promise<BlogCategory | null> {
  try {
    const result = await sql`
      INSERT INTO blog_categories (name, slug, description, color)
      VALUES (${category.name}, ${category.slug}, ${category.description}, ${category.color})
      RETURNING *
    `
    return result[0] as BlogCategory
  } catch (error) {
    console.error("Error creating category:", error)
    return null
  }
}

// Utility Functions
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}
