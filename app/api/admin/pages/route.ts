import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "15")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    console.log("Pages API GET: Starting with params:", { language, page, limit, search, status })

    // Build WHERE clause with tagged template literals
    let baseQuery = sql`SELECT * FROM pages WHERE 1=1`
    let countQuery = sql`SELECT COUNT(*) as total FROM pages WHERE 1=1`

    // Apply filters using Neon's tagged template approach
    if (language && language !== "all") {
      baseQuery = sql`SELECT * FROM pages WHERE language = ${language}`
      countQuery = sql`SELECT COUNT(*) as total FROM pages WHERE language = ${language}`
    } else {
      baseQuery = sql`SELECT * FROM pages WHERE 1=1`
      countQuery = sql`SELECT COUNT(*) as total FROM pages WHERE 1=1`
    }

    // Get total count first
    console.log("Pages API GET: Executing count query")
    const countResult = await countQuery
    console.log("Pages API GET: Count result:", countResult)

    // Neon returns array directly, not { rows: [] }
    const total = Number.parseInt(countResult[0]?.total || "0")
    console.log("Pages API GET: Total pages:", total)

    // Get pages with pagination
    const offset = (page - 1) * limit

    let pagesQuery
    if (language && language !== "all") {
      pagesQuery = sql`
        SELECT 
          id, title, slug, content, excerpt, status, language,
          seo_title, seo_description, template, views, 
          published_at, created_at, updated_at, author_id, parent_id, menu_order,
          noindex, canonical_url, og_title, og_description, og_image,
          custom_css, custom_js, featured_image
        FROM pages 
        WHERE language = ${language}
        ORDER BY menu_order ASC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    } else {
      pagesQuery = sql`
        SELECT 
          id, title, slug, content, excerpt, status, language,
          seo_title, seo_description, template, views, 
          published_at, created_at, updated_at, author_id, parent_id, menu_order,
          noindex, canonical_url, og_title, og_description, og_image,
          custom_css, custom_js, featured_image
        FROM pages 
        ORDER BY menu_order ASC, created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    }

    console.log("Pages API GET: Executing pages query")
    const pagesResult = await pagesQuery
    console.log("Pages API GET: Pages result length:", pagesResult?.length || 0)

    // Apply additional filters in JavaScript if needed
    let pages = pagesResult || []

    if (status && status !== "all") {
      pages = pages.filter((p: any) => p.status === status)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      pages = pages.filter(
        (p: any) => p.title?.toLowerCase().includes(searchLower) || p.slug?.toLowerCase().includes(searchLower),
      )
    }

    console.log("Pages API GET: Final pages count:", pages.length)

    // Return with pagination info
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error: any) {
    console.error("Pages API GET Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      cause: error.cause,
    })
    return NextResponse.json(
      {
        error: "Failed to fetch pages",
        details: error.message,
        type: error.name,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Pages API POST: Received data:", data)

    // Generate slug if not provided
    if (!data.slug && data.title) {
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
        seo_title, seo_description, template, author_id, menu_order, noindex
      )
      VALUES (
        ${data.title || "Untitled Page"}, 
        ${data.slug || `page-${Date.now()}`}, 
        ${data.content || ""}, 
        ${data.excerpt || ""}, 
        ${data.status || "draft"}, 
        ${data.language || "tr"},
        ${data.seo_title || data.title || ""}, 
        ${data.seo_description || data.excerpt || ""}, 
        ${data.template || "page"}, 
        ${data.author_id || 1}, 
        ${data.menu_order || 0}, 
        ${data.noindex || false}
      )
      RETURNING *
    `

    console.log("Pages API POST: Page created successfully:", result[0])
    return NextResponse.json(result[0], { status: 201 })
  } catch (error: any) {
    console.error("Pages API POST Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return NextResponse.json({ error: "Failed to create page", details: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updateData } = await request.json()
    console.log("Pages API PUT: Updating page", id, "with data:", updateData)

    if (!id) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 })
    }

    // For updates, we'll use a simpler approach with individual field updates
    const allowedFields = [
      "title",
      "slug",
      "content",
      "excerpt",
      "status",
      "language",
      "seo_title",
      "seo_description",
      "template",
      "menu_order",
      "noindex",
    ]

    // Build update object with only allowed fields
    const updateFields: any = {}
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field]
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 })
    }

    // Use a simple UPDATE with individual fields
    const result = await sql`
      UPDATE pages 
      SET 
        title = COALESCE(${updateFields.title}, title),
        slug = COALESCE(${updateFields.slug}, slug),
        content = COALESCE(${updateFields.content}, content),
        excerpt = COALESCE(${updateFields.excerpt}, excerpt),
        status = COALESCE(${updateFields.status}, status),
        language = COALESCE(${updateFields.language}, language),
        seo_title = COALESCE(${updateFields.seo_title}, seo_title),
        seo_description = COALESCE(${updateFields.seo_description}, seo_description),
        template = COALESCE(${updateFields.template}, template),
        menu_order = COALESCE(${updateFields.menu_order}, menu_order),
        noindex = COALESCE(${updateFields.noindex}, noindex),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    console.log("Pages API PUT: Page updated successfully:", result[0])
    return NextResponse.json(result[0])
  } catch (error: any) {
    console.error("Pages API PUT Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return NextResponse.json({ error: "Failed to update page", details: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Page ID is required" }, { status: 400 })
    }

    const result = await sql`DELETE FROM pages WHERE id = ${Number.parseInt(id)} RETURNING id`

    if (result.length === 0) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    console.log("Pages API DELETE: Page deleted successfully:", id)
    return NextResponse.json({ success: true, id: Number.parseInt(id) })
  } catch (error: any) {
    console.error("Pages API DELETE Error:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    return NextResponse.json({ error: "Failed to delete page", details: error.message }, { status: 500 })
  }
}
