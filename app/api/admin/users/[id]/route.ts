import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    const user = await sql`
      SELECT 
        id, 
        username, 
        email, 
        first_name, 
        last_name, 
        role, 
        is_active, 
        last_login, 
        created_at,
        updated_at
      FROM admin_users 
      WHERE id = ${userId}
    `

    if (user.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user[0],
    })
  } catch (error) {
    console.error("User fetch error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)
    const body = await request.json()
    const { username, email, first_name, last_name, role, is_active } = body

    if (!username || !email) {
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 })
    }

    const updatedUser = await sql`
      UPDATE admin_users 
      SET 
        username = ${username},
        email = ${email},
        first_name = ${first_name || ""},
        last_name = ${last_name || ""},
        role = ${role},
        is_active = ${is_active},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, username, email, first_name, last_name, role, is_active, updated_at
    `

    if (updatedUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser[0])
  } catch (error) {
    console.error("User update error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = Number.parseInt(params.id)

    // Check if user exists
    const existingUser = await sql`
      SELECT id FROM admin_users WHERE id = ${userId}
    `

    if (existingUser.length === 0) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    await sql`DELETE FROM admin_users WHERE id = ${userId}`

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("User deletion error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete user" }, { status: 500 })
  }
}
