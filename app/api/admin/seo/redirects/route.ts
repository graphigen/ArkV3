import { type NextRequest, NextResponse } from "next/server"

// Mock redirects data
const mockRedirects = [
  {
    id: 1,
    fromUrl: "/eski-sayfa",
    toUrl: "/yeni-sayfa",
    redirectType: 301,
    isActive: true,
    hitCount: 45,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    fromUrl: "/old-product",
    toUrl: "/urunler/yeni-urun",
    redirectType: 301,
    isActive: true,
    hitCount: 23,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    fromUrl: "/temp-page",
    toUrl: "/hakkimizda",
    redirectType: 302,
    isActive: false,
    hitCount: 12,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
]

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(mockRedirects)
  } catch (error) {
    console.error("Error fetching redirects:", error)
    return NextResponse.json({ error: "Failed to fetch redirects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.fromUrl || !data.toUrl) {
      return NextResponse.json({ error: "fromUrl and toUrl are required" }, { status: 400 })
    }

    // Create new redirect
    const newRedirect = {
      id: Math.max(...mockRedirects.map((r) => r.id), 0) + 1,
      fromUrl: data.fromUrl,
      toUrl: data.toUrl,
      redirectType: data.redirectType || 301,
      isActive: data.isActive !== undefined ? data.isActive : true,
      hitCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockRedirects.push(newRedirect)

    return NextResponse.json(newRedirect, { status: 201 })
  } catch (error) {
    console.error("Error creating redirect:", error)
    return NextResponse.json({ error: "Failed to create redirect" }, { status: 500 })
  }
}
