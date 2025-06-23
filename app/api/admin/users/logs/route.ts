import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const logs = await sql`
      SELECT 
        ll.id,
        ll.user_id,
        au.username,
        ll.ip_address,
        ll.user_agent,
        ll.success,
        ll.attempted_at
      FROM login_logs ll
      LEFT JOIN admin_users au ON ll.user_id = au.id
      ORDER BY ll.attempted_at DESC
      LIMIT 100
    `

    return NextResponse.json(logs)
  } catch (error) {
    console.error("Login logs fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch login logs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, username, ip_address, user_agent, success } = body

    const newLog = await sql`
      INSERT INTO login_logs (user_id, username, ip_address, user_agent, success, attempted_at)
      VALUES (${user_id}, ${username}, ${ip_address}, ${user_agent || ""}, ${success}, CURRENT_TIMESTAMP)
      RETURNING *
    `

    return NextResponse.json(newLog[0])
  } catch (error) {
    console.error("Login log creation error:", error)
    return NextResponse.json({ error: "Failed to create login log" }, { status: 500 })
  }
}
