import { type NextRequest, NextResponse } from "next/server"
import { getAllCategories, createCategory } from "@/lib/blog"

export async function GET() {
  try {
    const categories = await getAllCategories()
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Blog Categories API Error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const newCategory = await createCategory(data)

    if (!newCategory) {
      return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    console.error("Blog Categories POST Error:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
