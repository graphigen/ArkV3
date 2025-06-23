import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock analytics data
    const mockData = {
      stats: {
        visitors: 1250,
        pageViews: 3420,
        bounceRate: 35.2,
        avgSessionDuration: 245,
      },
      chartData: [
        { name: "Pzt", visitors: 120, pageViews: 340 },
        { name: "Sal", visitors: 150, pageViews: 420 },
        { name: "Çar", visitors: 180, pageViews: 380 },
        { name: "Per", visitors: 200, pageViews: 450 },
        { name: "Cum", visitors: 170, pageViews: 390 },
        { name: "Cmt", visitors: 220, pageViews: 520 },
        { name: "Paz", visitors: 190, pageViews: 480 },
      ],
      topPages: [
        { page: "/", views: 850, bounce: "32%" },
        { page: "/hakkimizda", views: 420, bounce: "28%" },
        { page: "/projeler/robotik-kaynak", views: 380, bounce: "45%" },
        { page: "/urunler/tiger-torc", views: 320, bounce: "38%" },
        { page: "/iletisim", views: 280, bounce: "25%" },
      ],
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
