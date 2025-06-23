import { type NextRequest, NextResponse } from "next/server"
import { getAllForms, createForm } from "@/lib/forms"

export async function GET() {
  try {
    const forms = await getAllForms()
    return NextResponse.json(forms)
  } catch (error) {
    console.error("Forms API Error:", error)
    return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    const newForm = await createForm({
      ...data,
      status: data.status || "active",
    })

    if (!newForm) {
      return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
    }

    return NextResponse.json(newForm, { status: 201 })
  } catch (error) {
    console.error("Forms POST Error:", error)
    return NextResponse.json({ error: "Failed to create form" }, { status: 500 })
  }
}
