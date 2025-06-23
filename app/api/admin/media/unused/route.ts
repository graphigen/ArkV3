import { type NextRequest, NextResponse } from "next/server"
import { getUnusedMedia } from "@/lib/media"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const unusedMedia = await getUnusedMedia()
    return NextResponse.json({ items: unusedMedia, total: unusedMedia.length })
  } catch (error: any) {
    console.error("Error fetching unused media:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
