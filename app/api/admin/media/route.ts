import { type NextRequest, NextResponse } from "next/server"
import { createMediaItem, getMediaItems } from "@/lib/media"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || ""
    const folderId = searchParams.get("folder_id") ? Number.parseInt(searchParams.get("folder_id")!) : undefined
    const tags = searchParams.get("tags") ? searchParams.get("tags")!.split(",") : []
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const sortBy = searchParams.get("sort_by") || "created_at"
    const sortOrder = (searchParams.get("sort_order") || "desc") as "asc" | "desc"

    const result = await getMediaItems({
      search,
      type,
      folder_id: folderId,
      tags,
      page,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error fetching media:", error)
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

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert File to buffer for processing
    const buffer = Buffer.from(await file.arrayBuffer())

    // Extract metadata from formData
    const altText = (formData.get("alt_text") as string) || ""
    const title = (formData.get("title") as string) || ""
    const description = (formData.get("description") as string) || ""
    const tags = (formData.get("tags") as string) || ""
    const folderId = formData.get("folder_id") ? Number.parseInt(formData.get("folder_id") as string) : undefined

    // Create media item
    const mediaItem = await createMediaItem(
      {
        alt_text: altText,
        title: title,
        description: description,
        tags: tags ? tags.split(",") : [],
        folder_id: folderId,
        uploaded_by: session.user?.id,
      },
      {
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
        buffer,
      },
    )

    return NextResponse.json(mediaItem)
  } catch (error: any) {
    console.error("Error uploading media:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
