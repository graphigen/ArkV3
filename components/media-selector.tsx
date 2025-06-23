"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ImageIcon,
  Upload,
  FolderPlus,
  Search,
  X,
  FileIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

type MediaItem = {
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
  created_at: string
  updated_at: string
  url: string
}

type MediaFolder = {
  id: number
  name: string
  parent_id: number | null
  item_count: number
}

type MediaSelectorProps = {
  onSelect: (media: MediaItem | null) => void
  selectedId?: number
  buttonLabel?: string
  allowClear?: boolean
  showPreview?: boolean
  filter?: {
    type?: "image" | "video" | "audio" | "document" | "all"
  }
}

export function MediaSelector({
  onSelect,
  selectedId,
  buttonLabel = "Select Media",
  allowClear = true,
  showPreview = true,
  filter = { type: "all" },
}: MediaSelectorProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("browse")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(undefined)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [fileTypeFilter, setFileTypeFilter] = useState(filter.type || "all")

  // Fetch selected media if selectedId is provided
  useEffect(() => {
    if (selectedId) {
      fetchMediaItem(selectedId)
    }
  }, [selectedId])

  // Fetch media items when parameters change
  useEffect(() => {
    if (open) {
      fetchMediaItems()
      fetchFolders()
    }
  }, [open, selectedFolder, search, page, fileTypeFilter])

  const fetchMediaItem = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/media/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedMedia(data)
      }
    } catch (error) {
      console.error("Error fetching media item:", error)
    }
  }

  const fetchMediaItems = async () => {
    setLoading(true)
    try {
      let url = `/api/admin/media?page=${page}&limit=20`

      if (search) {
        url += `&search=${encodeURIComponent(search)}`
      }

      if (selectedFolder !== undefined) {
        url += `&folder_id=${selectedFolder}`
      }

      if (fileTypeFilter !== "all") {
        url += `&type=${fileTypeFilter}`
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data.items)
        setTotalItems(data.total)
      }
    } catch (error) {
      console.error("Error fetching media items:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFolders = async () => {
    try {
      const response = await fetch("/api/admin/media/folders")
      if (response.ok) {
        const data = await response.json()
        setFolders(data)
      }
    } catch (error) {
      console.error("Error fetching folders:", error)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", e.target.files[0])

      if (selectedFolder !== undefined) {
        formData.append("folder_id", selectedFolder.toString())
      }

      const response = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setMediaItems((prev) => [data, ...prev])
        setActiveTab("browse")
        // Clear the input
        e.target.value = ""
      }
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setUploading(false)
    }
  }

  const handleSelect = (media: MediaItem) => {
    setSelectedMedia(media)
    onSelect(media)
    setOpen(false)
  }

  const handleClear = () => {
    setSelectedMedia(null)
    onSelect(null)
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <FileImage className="h-6 w-6" />
    if (mimeType.startsWith("video/")) return <FileVideo className="h-6 w-6" />
    if (mimeType.startsWith("audio/")) return <FileAudio className="h-6 w-6" />
    if (mimeType.startsWith("text/") || mimeType.includes("pdf")) return <FileText className="h-6 w-6" />
    return <FileIcon className="h-6 w-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {buttonLabel}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Media Library</DialogTitle>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="browse">Browse</TabsTrigger>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <div className="flex items-center gap-2">
                  <Select value={fileTypeFilter} onValueChange={setFileTypeFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="File Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Files</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="application">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search media..."
                      className="pl-8 w-[200px]"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mb-4">
                <Select
                  value={selectedFolder?.toString()}
                  onValueChange={(value) => setSelectedFolder(value ? Number.parseInt(value) : undefined)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select Folder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Folders</SelectItem>
                    {folders.map((folder) => (
                      <SelectItem key={folder.id} value={folder.id.toString()}>
                        {folder.name} ({folder.item_count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="browse" className="flex-1">
                <ScrollArea className="h-[400px] border rounded-md">
                  {loading ? (
                    <div className="grid grid-cols-4 gap-4 p-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-[100px] w-full rounded-md" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                      ))}
                    </div>
                  ) : mediaItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                      <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No media files found</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-4 p-4">
                      {mediaItems.map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-md overflow-hidden cursor-pointer transition-all hover:border-primary ${
                            selectedMedia?.id === item.id ? "ring-2 ring-primary" : ""
                          }`}
                          onClick={() => handleSelect(item)}
                        >
                          {item.mime_type.startsWith("image/") ? (
                            <div className="aspect-square bg-muted relative">
                              <img
                                src={item.url || "/placeholder.svg"}
                                alt={item.alt_text || item.original_filename}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <div className="aspect-square bg-muted flex items-center justify-center">
                              {getFileIcon(item.mime_type)}
                            </div>
                          )}
                          <div className="p-2">
                            <p className="text-sm font-medium truncate">{item.original_filename}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(item.file_size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {totalItems > 0 && (
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {mediaItems.length} of {totalItems} items
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={mediaItems.length < 20}
                        onClick={() => setPage((p) => p + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload" className="flex-1">
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={uploading} />
                  <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mb-4">SVG, PNG, JPG, GIF, PDF, DOC up to 10MB</p>
                    <Button disabled={uploading}>{uploading ? "Uploading..." : "Select File"}</Button>
                  </label>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {allowClear && selectedMedia && (
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showPreview && selectedMedia && (
        <div className="border rounded-md p-2 flex items-center gap-4">
          {selectedMedia.mime_type.startsWith("image/") ? (
            <img
              src={selectedMedia.url || "/placeholder.svg"}
              alt={selectedMedia.alt_text || selectedMedia.original_filename}
              className="h-16 w-16 object-cover rounded"
            />
          ) : (
            <div className="h-16 w-16 bg-muted rounded flex items-center justify-center">
              {getFileIcon(selectedMedia.mime_type)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{selectedMedia.original_filename}</p>
            <p className="text-sm text-muted-foreground">{formatFileSize(selectedMedia.file_size)}</p>
            {selectedMedia.tags && selectedMedia.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {selectedMedia.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
