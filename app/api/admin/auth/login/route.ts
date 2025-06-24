import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { setAuthCookie } from "@/lib/auth"
import bcrypt from "bcryptjs" // bcryptjs import edildi

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const users = await sql`
      SELECT id, email, password_hash, role, status 
      FROM admin_users 
      WHERE email = ${email.toLowerCase()}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    if (user.status !== "active") {
      return NextResponse.json({ error: "User account is not active. Please contact administrator." }, { status: 403 })
    }

    const passwordMatch = bcrypt.compareSync(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Set auth cookie with user ID and role
    setAuthCookie(user.id, user.role)

    return NextResponse.json({ success: true, message: "Login successful", role: user.role, userId: user.id })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
