import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const folderId = formData.get("folder_id") as string

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    // File validation
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "Dosya boyutu çok büyük (max 10MB)" }, { status: 400 })
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Desteklenmeyen dosya türü" }, { status: 400 })
    }

    // Create upload directory
    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${originalName}`
    const filepath = join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Get file info
    const fileInfo = {
      filename: filename,
      original_filename: file.name,
      file_path: `/uploads/${filename}`,
      file_size: file.size,
      mime_type: file.type,
      file_type: getFileType(file.type),
      folder_id: folderId ? Number.parseInt(folderId) : null,
      uploaded_by: 1, // TODO: Get from session
      is_public: true,
    }

    // Get image dimensions if it's an image
    if (file.type.startsWith("image/")) {
      try {
        // You can use sharp or other image processing library here
        // For now, we'll set default dimensions
        fileInfo.width = 800
        fileInfo.height = 600
      } catch (error) {
        console.log("Could not get image dimensions")
      }
    }

    // Save to database
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/media`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fileInfo),
      })

      if (response.ok) {
        const savedFile = await response.json()
        return NextResponse.json({
          success: true,
          message: "Dosya başarıyla yüklendi",
          file: savedFile,
        })
      }
    } catch (dbError) {
      console.error("Database save error:", dbError)
    }

    // Return file info even if database save fails
    return NextResponse.json({
      success: true,
      message: "Dosya yüklendi (veritabanı kaydı başarısız)",
      file: {
        ...fileInfo,
        id: Date.now(), // Temporary ID
        url: fileInfo.file_path,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Dosya yüklenirken hata oluştu" }, { status: 500 })
  }
}

function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType.startsWith("video/")) return "video"
  if (mimeType.startsWith("audio/")) return "audio"
  if (mimeType.includes("pdf")) return "document"
  if (mimeType.includes("word") || mimeType.includes("text")) return "document"
  return "other"
}
