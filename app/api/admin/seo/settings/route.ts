import { type NextRequest, NextResponse } from "next/server"

// Mock SEO settings data
let mockSEOSettings = {
  id: 1,
  siteName: "Arkkontrol",
  siteDescription: "Endüstriyel otomasyon ve robotik kaynak çözümleri",
  defaultOgImage: "https://arkkontrol.com/og-image.jpg",
  defaultTwitterImage: "https://arkkontrol.com/twitter-image.jpg",
  googleAnalyticsId: "G-XXXXXXXXXX",
  googleTagManagerId: "GTM-XXXXXXX",
  googleSearchConsoleCode: "",
  bingWebmasterCode: "",
  yandexVerificationCode: "",
  facebookAppId: "",
  twitterUsername: "@arkkontrol",
  robotsTxt: `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://arkkontrol.com/sitemap.xml`,
  customHeadCode: "",
  customBodyCode: "",
  enableBreadcrumbs: true,
  enableSchemaMarkup: true,
  enableOpenGraph: true,
  enableTwitterCards: true,
  updatedAt: new Date().toISOString(),
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockSEOSettings)
  } catch (error) {
    console.error("Error fetching SEO settings:", error)
    return NextResponse.json({ error: "Failed to fetch SEO settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Update mock data
    mockSEOSettings = {
      ...mockSEOSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockSEOSettings)
  } catch (error) {
    console.error("Error updating SEO settings:", error)
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Update mock data
    mockSEOSettings = {
      ...mockSEOSettings,
      ...data,
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json(mockSEOSettings)
  } catch (error) {
    console.error("Error updating SEO settings:", error)
    return NextResponse.json({ error: "Failed to update SEO settings" }, { status: 500 })
  }
}
