import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock data - gerçek database bağlantısı olmadığı için
    const stats = {
      pages: 14,
      posts: 3,
      visitors: 1250,
      messages: 8,
      activeUsers: 45,
      totalViews: 15420,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Stats alınamadı" }, { status: 500 })
  }
}
