import { type NextRequest, NextResponse } from "next/server"
import { getFormById, updateForm, deleteForm } from "@/lib/forms"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const form = await getFormById(id)

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error("Form GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch form" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const updatedForm = await updateForm(id, data)

    if (!updatedForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json(updatedForm)
  } catch (error) {
    console.error("Form PUT Error:", error)
    return NextResponse.json({ error: "Failed to update form" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    const success = await deleteForm(id)

    if (!success) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Form deleted successfully" })
  } catch (error) {
    console.error("Form DELETE Error:", error)
    return NextResponse.json({ error: "Failed to delete form" }, { status: 500 })
  }
}
