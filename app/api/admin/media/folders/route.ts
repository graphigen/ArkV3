import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const folders = await sql`
      SELECT 
        mf.id, mf.name, mf.slug, mf.parent_id, mf.path, mf.created_at,
        COUNT(files.id) as file_count
      FROM media_folders mf
      LEFT JOIN media_files files ON mf.id = files.folder_id
      GROUP BY mf.id, mf.name, mf.slug, mf.parent_id, mf.path, mf.created_at
      ORDER BY mf.path
    `
    return NextResponse.json(folders)
  } catch (error) {
    console.error("Media folders API Error:", error)
    return NextResponse.json({ error: "Failed to fetch media folders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { name, slug, parent_id, created_by } = data

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    // Generate path
    let path = `/${slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`
    if (parent_id) {
      const parent = await sql`SELECT path FROM media_folders WHERE id = ${parent_id}`
      if (parent[0]) {
        path = `${parent[0].path}${path}`
      }
    }

    const result = await sql`
      INSERT INTO media_folders (name, slug, parent_id, path, created_by)
      VALUES (${name}, ${slug || name.toLowerCase().replace(/[^a-z0-9]/g, "-")}, ${parent_id || null}, ${path}, ${created_by || null})
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Media folder creation error:", error)
    return NextResponse.json({ error: "Failed to create media folder" }, { status: 500 })
  }
}
