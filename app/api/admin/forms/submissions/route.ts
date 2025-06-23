import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const formId = searchParams.get("form_id")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "15")
    const status = searchParams.get("status")

    const offset = (page - 1) * limit

    let whereClause = "WHERE 1=1"
    const params: any[] = []
    let paramIndex = 1

    if (formId) {
      whereClause += ` AND form_id = $${paramIndex}`
      params.push(Number.parseInt(formId))
      paramIndex++
    }

    if (status && status !== "all") {
      whereClause += ` AND status = $${paramIndex}`
      params.push(status)
      paramIndex++
    }

    // Get submissions with pagination
    const submissions = await sql.query(
      `
      SELECT 
        fs.id, fs.form_id, fs.data, fs.ip_address, fs.user_agent, 
        fs.referrer, fs.status, fs.created_at,
        f.name as form_name, f.title as form_title
      FROM form_submissions fs
      LEFT JOIN forms f ON fs.form_id = f.id
      ${whereClause}
      ORDER BY fs.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
      [...params, limit, offset],
    )

    // Get total count
    const [{ count }] = await sql.query(
      `
      SELECT COUNT(*) as count 
      FROM form_submissions fs
      ${whereClause}
    `,
      params,
    )

    const totalPages = Math.ceil(Number.parseInt(count) / limit)

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total: Number.parseInt(count),
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Form submissions fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch form submissions" }, { status: 500 })
  }
}
