import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const folder_id = searchParams.get("folder_id")
    const file_type = searchParams.get("file_type")
    const search = searchParams.get("search")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    let query = `
      SELECT 
        mf.id, mf.filename, mf.original_filename, mf.file_path, mf.file_size,
        mf.mime_type, mf.file_type, mf.width, mf.height, mf.alt_text, mf.caption,
        mf.description, mf.tags, mf.folder_id, mf.is_public, mf.created_at, mf.updated_at,
        folder.name as folder_name
      FROM media_files mf
      LEFT JOIN media_folders folder ON mf.folder_id = folder.id
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (folder_id) {
      query += ` AND mf.folder_id = $${paramIndex}`
      params.push(Number.parseInt(folder_id))
      paramIndex++
    }

    if (file_type && file_type !== "all") {
      query += ` AND mf.file_type = $${paramIndex}`
      params.push(file_type)
      paramIndex++
    }

    if (search) {
      query += ` AND (mf.filename ILIKE $${paramIndex} OR mf.original_filename ILIKE $${paramIndex} OR mf.alt_text ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    query += ` ORDER BY mf.created_at DESC LIMIT $${paramIndex}`
    params.push(limit)

    const files = await sql.query(query, params)
    return NextResponse.json(files || [])
  } catch (error) {
    console.error("Media API Error:", error)
    return NextResponse.json({ error: "Failed to fetch media files" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      filename,
      original_filename,
      file_path,
      file_size,
      mime_type,
      file_type,
      width,
      height,
      alt_text,
      caption,
      description,
      tags,
      folder_id,
      uploaded_by,
      is_public,
    } = data

    if (!filename || !file_path || !file_size || !mime_type) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO media_files (
        filename, original_filename, file_path, file_size, mime_type, file_type,
        width, height, alt_text, caption, description, tags, folder_id, uploaded_by, is_public
      )
      VALUES (
        ${filename}, ${original_filename || filename}, ${file_path}, ${file_size}, ${mime_type}, ${file_type || "other"},
        ${width || null}, ${height || null}, ${alt_text || null}, ${caption || null}, ${description || null}, 
        ${tags || []}, ${folder_id || null}, ${uploaded_by || null}, ${is_public !== false}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Media file creation error:", error)
    return NextResponse.json({ error: "Failed to create media file" }, { status: 500 })
  }
}
