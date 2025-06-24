import { NextResponse } from "next/server"
import { removeAuthCookie } from "@/lib/auth"

export async function POST() {
  try {
    removeAuthCookie()
    return NextResponse.json({ success: true, message: "Logout successful" })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
