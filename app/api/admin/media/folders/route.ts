import { type NextRequest, NextResponse } from "next/server"
import { getMediaFolders, createMediaFolder } from "@/lib/media"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const folders = await getMediaFolders()
    return NextResponse.json(folders)
  } catch (error: any) {
    console.error("Error fetching media folders:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { name, parent_id } = data

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const folder = await createMediaFolder(name, parent_id)
    return NextResponse.json(folder)
  } catch (error: any) {
    console.error("Error creating media folder:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
