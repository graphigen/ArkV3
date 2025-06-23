import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const [submission] = await sql`
      SELECT 
        fs.id, fs.form_id, fs.data, fs.ip_address, fs.user_agent, 
        fs.referrer, fs.status, fs.created_at,
        f.name as form_name, f.title as form_title
      FROM form_submissions fs
      LEFT JOIN forms f ON fs.form_id = f.id
      WHERE fs.id = ${id}
    `

    if (!submission) {
      return NextResponse.json({ error: "Form submission not found" }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Form submission fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch form submission" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const { status } = await request.json()

    const [submission] = await sql`
      UPDATE form_submissions 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    return NextResponse.json(submission)
  } catch (error) {
    console.error("Form submission update error:", error)
    return NextResponse.json({ error: "Failed to update form submission" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await sql`DELETE FROM form_submissions WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Form submission delete error:", error)
    return NextResponse.json({ error: "Failed to delete form submission" }, { status: 500 })
  }
}
