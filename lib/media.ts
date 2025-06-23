import { db } from "./database"
import { v4 as uuidv4 } from "uuid"
import path from "path"
import fs from "fs"

export interface MediaFile {
  id: number
  filename: string
  original_name: string
  file_path: string
  file_url: string
  file_type: "image" | "document" | "video" | "audio"
  file_size: number
  mime_type: string
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  description?: string
  tags: string[]
  is_used: boolean
  usage_count: number
  uploaded_by: string
  created_at: string
  updated_at: string
}

export interface MediaUsage {
  id: number
  media_id: number
  content_type: string
  content_id?: number
  field_name?: string
  created_at: string
}

export interface MediaUploadResponse {
  success: boolean
  file?: MediaFile
  error?: string
}

export interface MediaStats {
  total_files: number
  total_size: number
  by_type: Record<string, number>
  unused_files: number
  recent_uploads: number
}

export type MediaItem = {
  id: number
  filename: string
  original_filename: string
  file_path: string
  file_size: number
  mime_type: string
  extension: string
  width?: number
  height?: number
  alt_text?: string
  title?: string
  description?: string
  tags?: string[]
  uploaded_by?: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  folder_id?: number
  url: string
}

export type MediaFolder = {
  id: number
  name: string
  parent_id: number | null
  created_at: string
  updated_at: string
  item_count?: number
}

export type MediaFilter = {
  search?: string
  type?: string
  folder_id?: number
  tags?: string[]
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: "asc" | "desc"
}

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

export const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
  document: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  video: ["video/mp4", "video/webm", "video/ogg"],
  audio: ["audio/mp3", "audio/wav", "audio/ogg"],
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function getFileType(mimeType: string): MediaFile["file_type"] {
  for (const [type, mimes] of Object.entries(ALLOWED_FILE_TYPES)) {
    if (mimes.includes(mimeType)) {
      return type as MediaFile["file_type"]
    }
  }
  return "document"
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function isImageFile(mimeType: string): boolean {
  return ALLOWED_FILE_TYPES.image.includes(mimeType)
}

export async function getMediaItems(filter: MediaFilter = {}): Promise<{ items: MediaItem[]; total: number }> {
  const {
    search = "",
    type = "",
    folder_id,
    tags = [],
    page = 1,
    limit = 20,
    sort_by = "created_at",
    sort_order = "desc",
  } = filter

  const offset = (page - 1) * limit

  let query = `
    SELECT m.*, COUNT(*) OVER() as total_count
    FROM media m
    WHERE m.is_deleted = false
  `

  const params: any[] = []
  let paramIndex = 1

  if (search) {
    query += ` AND (
      m.original_filename ILIKE $${paramIndex} 
      OR m.alt_text ILIKE $${paramIndex}
      OR m.title ILIKE $${paramIndex}
      OR m.description ILIKE $${paramIndex}
    )`
    params.push(`%${search}%`)
    paramIndex++
  }

  if (type) {
    query += ` AND m.mime_type LIKE $${paramIndex}`
    params.push(`${type}%`)
    paramIndex++
  }

  if (folder_id !== undefined) {
    query += ` AND m.folder_id = $${paramIndex}`
    params.push(folder_id)
    paramIndex++
  }

  if (tags.length > 0) {
    query += ` AND m.tags && $${paramIndex}`
    params.push(tags)
    paramIndex++
  }

  query += ` ORDER BY ${sort_by} ${sort_order} LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
  params.push(limit, offset)

  const result = await db.query(query, params)

  const items = result.rows.map((item) => ({
    ...item,
    url: `/uploads/${item.filename}`,
    total: undefined,
  }))

  const total = result.rows.length > 0 ? Number.parseInt(result.rows[0].total_count) : 0

  return { items, total }
}

export async function getMediaItem(id: number): Promise<MediaItem | null> {
  const result = await db.query("SELECT * FROM media WHERE id = $1 AND is_deleted = false", [id])

  if (result.rows.length === 0) {
    return null
  }

  const item = result.rows[0]
  return {
    ...item,
    url: `/uploads/${item.filename}`,
  }
}

export async function createMediaItem(data: Partial<MediaItem>, file: any): Promise<MediaItem> {
  // Generate unique filename
  const extension = path.extname(file.originalname)
  const filename = `${uuidv4()}${extension}`
  const filePath = path.join(UPLOAD_DIR, filename)

  // Save file to disk
  await fs.promises.writeFile(filePath, file.buffer)

  // Get file metadata
  const fileSize = file.size
  const mimeType = file.mimetype

  // Insert into database
  const result = await db.query(
    `INSERT INTO media (
      filename, original_filename, file_path, file_size, mime_type, extension,
      width, height, alt_text, title, description, tags, uploaded_by, folder_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *`,
    [
      filename,
      file.originalname,
      `/uploads/${filename}`,
      fileSize,
      mimeType,
      extension.replace(".", ""),
      data.width || null,
      data.height || null,
      data.alt_text || file.originalname.replace(extension, ""),
      data.title || file.originalname.replace(extension, ""),
      data.description || null,
      data.tags || [],
      data.uploaded_by || null,
      data.folder_id || 1, // Default to root folder
    ],
  )

  const item = result.rows[0]
  return {
    ...item,
    url: `/uploads/${item.filename}`,
  }
}

export async function updateMediaItem(id: number, data: Partial<MediaItem>): Promise<MediaItem | null> {
  const fields: string[] = []
  const values: any[] = []
  let paramIndex = 1

  // Build dynamic update query
  Object.entries(data).forEach(([key, value]) => {
    if (["alt_text", "title", "description", "tags", "folder_id"].includes(key)) {
      fields.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  if (fields.length === 0) {
    return await getMediaItem(id)
  }

  fields.push(`updated_at = CURRENT_TIMESTAMP`)

  const query = `
    UPDATE media
    SET ${fields.join(", ")}
    WHERE id = $${paramIndex} AND is_deleted = false
    RETURNING *
  `
  values.push(id)

  const result = await db.query(query, values)

  if (result.rows.length === 0) {
    return null
  }

  const item = result.rows[0]
  return {
    ...item,
    url: `/uploads/${item.filename}`,
  }
}

export async function deleteMediaItem(id: number): Promise<boolean> {
  // Soft delete
  const result = await db.query("UPDATE media SET is_deleted = true WHERE id = $1 RETURNING id", [id])

  return result.rows.length > 0
}

export async function getMediaFolders(): Promise<MediaFolder[]> {
  const result = await db.query(`
    SELECT f.*, COUNT(m.id) as item_count
    FROM media_folders f
    LEFT JOIN media m ON m.folder_id = f.id AND m.is_deleted = false
    GROUP BY f.id
    ORDER BY f.name ASC
  `)

  return result.rows
}

export async function createMediaFolder(name: string, parent_id?: number): Promise<MediaFolder> {
  const result = await db.query("INSERT INTO media_folders (name, parent_id) VALUES ($1, $2) RETURNING *", [
    name,
    parent_id || null,
  ])

  return {
    ...result.rows[0],
    item_count: 0,
  }
}

export async function updateMediaFolder(id: number, name: string): Promise<MediaFolder | null> {
  const result = await db.query(
    "UPDATE media_folders SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
    [name, id],
  )

  if (result.rows.length === 0) {
    return null
  }

  return result.rows[0]
}

export async function deleteMediaFolder(id: number): Promise<boolean> {
  // Check if folder has media items
  const mediaCount = await db.query("SELECT COUNT(*) FROM media WHERE folder_id = $1 AND is_deleted = false", [id])

  if (Number.parseInt(mediaCount.rows[0].count) > 0) {
    throw new Error("Cannot delete folder with media items")
  }

  // Check if folder has subfolders
  const subfolderCount = await db.query("SELECT COUNT(*) FROM media_folders WHERE parent_id = $1", [id])

  if (Number.parseInt(subfolderCount.rows[0].count) > 0) {
    throw new Error("Cannot delete folder with subfolders")
  }

  const result = await db.query("DELETE FROM media_folders WHERE id = $1 RETURNING id", [id])

  return result.rows.length > 0
}

export async function getUnusedMedia(): Promise<MediaItem[]> {
  const result = await db.query(`
    SELECT m.*, COUNT(*) OVER() as total_count
    FROM media m
    LEFT JOIN media_usage mu ON m.id = mu.media_id
    WHERE m.is_deleted = false AND mu.id IS NULL
    ORDER BY m.created_at DESC
  `)

  return result.rows.map((item) => ({
    ...item,
    url: `/uploads/${item.filename}`,
    total: undefined,
  }))
}

export async function trackMediaUsage(
  mediaId: number,
  entityType: string,
  entityId: number,
  context?: string,
): Promise<void> {
  await db.query("INSERT INTO media_usage (media_id, entity_type, entity_id, context) VALUES ($1, $2, $3, $4)", [
    mediaId,
    entityType,
    entityId,
    context || null,
  ])
}

export async function removeMediaUsage(mediaId: number, entityType: string, entityId: number): Promise<void> {
  await db.query("DELETE FROM media_usage WHERE media_id = $1 AND entity_type = $2 AND entity_id = $3", [
    mediaId,
    entityType,
    entityId,
  ])
}
