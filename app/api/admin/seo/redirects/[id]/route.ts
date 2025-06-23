import { type NextRequest, NextResponse } from "next/server"

// Mock redirects data (same as in route.ts)
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const redirect = mockRedirects.find((r) => r.id === id)

    if (!redirect) {
      return NextResponse.json({ error: "Redirect not found" }, { status: 404 })
    }

    return NextResponse.json(redirect)
  } catch (error) {
    console.error("Error fetching redirect:", error)
    return NextResponse.json({ error: "Failed to fetch redirect" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const redirectIndex = mockRedirects.findIndex((r) => r.id === id)

    if (redirectIndex === -1) {
      return NextResponse.json({ error: "Redirect not found" }, { status: 404 })
    }

    // Update redirect
    mockRedirects[redirectIndex] = {
      ...mockRedirects[redirectIndex],
      ...data,
      id, // Keep original ID
      updatedAt: new Date(),
    }

    return NextResponse.json(mockRedirects[redirectIndex])
  } catch (error) {
    console.error("Error updating redirect:", error)
    return NextResponse.json({ error: "Failed to update redirect" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const redirectIndex = mockRedirects.findIndex((r) => r.id === id)

    if (redirectIndex === -1) {
      return NextResponse.json({ error: "Redirect not found" }, { status: 404 })
    }

    // Remove redirect
    mockRedirects.splice(redirectIndex, 1)

    return NextResponse.json({ message: "Redirect deleted successfully" })
  } catch (error) {
    console.error("Error deleting redirect:", error)
    return NextResponse.json({ error: "Failed to delete redirect" }, { status: 500 })
  }
}
