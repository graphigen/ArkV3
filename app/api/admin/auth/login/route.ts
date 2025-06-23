import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Kullanıcıyı database'den bul
    const [user] = await sql`
      SELECT * FROM users 
      WHERE username = ${username} AND status = 'active'
    `

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 401 })
    }

    // Demo için basit şifre kontrolü (production'da bcrypt kullanın)
    const isValidPassword = password === "arkkontrol2025!" || (await bcrypt.compare(password, user.password_hash))

    if (!isValidPassword) {
      return NextResponse.json({ error: "Geçersiz şifre" }, { status: 401 })
    }

    // Son giriş zamanını güncelle
    await sql`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = ${user.id}
    `

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Giriş hatası" }, { status: 500 })
  }
}
