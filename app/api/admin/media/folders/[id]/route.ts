import { type NextRequest, NextResponse } from "next/server"
import { updateMediaFolder, deleteMediaFolder } from "@/lib/media"
import { auth } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)
    const data = await request.json()
    const { name } = data

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const folder = await updateMediaFolder(id, name)

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    return NextResponse.json(folder)
  } catch (error: any) {
    console.error("Error updating media folder:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = Number.parseInt(params.id)

    try {
      const success = await deleteMediaFolder(id)

      if (!success) {
        return NextResponse.json({ error: "Folder not found" }, { status: 404 })
      }

      return NextResponse.json({ success: true })
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
  } catch (error: any) {
    console.error("Error deleting media folder:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
