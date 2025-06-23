import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const users = await sql`
      SELECT 
        id, 
        username, 
        email, 
        first_name, 
        last_name, 
        role, 
        is_active, 
        last_login, 
        login_attempts,
        created_at,
        updated_at
      FROM admin_users 
      ORDER BY created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Users fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, first_name, last_name, role = "editor", is_active = true } = body

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM admin_users 
      WHERE username = ${username} OR email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "User with this username or email already exists" }, { status: 409 })
    }

    // Simple password hash (in production, use bcrypt)
    const passwordHash = Buffer.from(password).toString("base64")

    const newUser = await sql`
      INSERT INTO admin_users (username, email, password_hash, first_name, last_name, role, is_active)
      VALUES (${username}, ${email}, ${passwordHash}, ${first_name || ""}, ${last_name || ""}, ${role}, ${is_active})
      RETURNING id, username, email, first_name, last_name, role, is_active, created_at
    `

    return NextResponse.json(newUser[0])
  } catch (error) {
    console.error("User creation error:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
