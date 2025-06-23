"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
  Search,
  Upload,
  FolderPlus,
  Trash2,
  FileIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileText,
  X,
  Save,
  Loader2,
  RefreshCw,
  Pencil,
} from "lucide-react"

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

export default function MediaManager() {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [selectedFolder, setSelectedFolder] = useState<number | undefined>(undefined)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [fileTypeFilter, setFileTypeFilter] = useState("all")
  const [isEditingMedia, setIsEditingMedia] = useState(false)
  const [editForm, setEditForm] = useState({
    alt_text: "",
    title: "",
    description: "",
    tags: "",
  })
  const [newFolderName, setNewFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch media items when parameters change
  useEffect(() => {
    fetchMediaItems()
    fetchFolders()
  }, [selectedFolder, search, page, fileTypeFilter, activeTab])

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

      if (activeTab === "unused") {
        url = "/api/admin/media/unused"
      }

      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        setMediaItems(data.items)
        setTotalItems(data.total)
      }
    } catch (error) {
      console.error("Error fetching media items:", error)
      toast.error("Failed to load media items")
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
      toast.error("Failed to load folders")
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
        toast.success("File uploaded successfully")
        // Clear the input
        e.target.value = ""
      } else {
        toast.error("Failed to upload file")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Failed to upload file")
    } finally {
      setUploading(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return

    setIsCreatingFolder(true)

    try {
      const response = await fetch("/api/admin/media/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newFolderName,
          parent_id: selectedFolder,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFolders((prev) => [...prev, data])
        setNewFolderName("")
        toast.success("Folder created successfully")
      } else {
        toast.error("Failed to create folder")
      }
    } catch (error) {
      console.error("Error creating folder:", error)
      toast.error("Failed to create folder")
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleSelectMedia = (media: MediaItem) => {
    setSelectedMedia(media)
    setEditForm({
      alt_text: media.alt_text || "",
      title: media.title || "",
      description: media.description || "",
      tags: media.tags ? media.tags.join(", ") : "",
    })
  }

  const handleUpdateMedia = async () => {
    if (!selectedMedia) return

    setIsEditingMedia(true)

    try {
      const response = await fetch(`/api/admin/media/${selectedMedia.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alt_text: editForm.alt_text,
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        const updatedMedia = await response.json()
        setMediaItems((prev) => prev.map((item) => (item.id === updatedMedia.id ? updatedMedia : item)))
        setSelectedMedia(updatedMedia)
        toast.success("Media updated successfully")
      } else {
        toast.error("Failed to update media")
      }
    } catch (error) {
      console.error("Error updating media:", error)
      toast.error("Failed to update media")
    } finally {
      setIsEditingMedia(false)
    }
  }

  const handleDeleteMedia = async (id: number) => {
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setMediaItems((prev) => prev.filter((item) => item.id !== id))
        if (selectedMedia?.id === id) {
          setSelectedMedia(null)
        }
        toast.success("Media deleted successfully")
      } else {
        toast.error("Failed to delete media")
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      toast.error("Failed to delete media")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return

    setIsDeleting(true)

    try {
      const promises = selectedItems.map((id) => fetch(`/api/admin/media/${id}`, { method: "DELETE" }))

      const results = await Promise.allSettled(promises)
      const successCount = results.filter((result) => result.status === "fulfilled").length

      if (successCount > 0) {
        setMediaItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
        if (selectedMedia && selectedItems.includes(selectedMedia.id)) {
          setSelectedMedia(null)
        }
        toast.success(`${successCount} items deleted successfully`)
      }

      if (successCount < selectedItems.length) {
        toast.error(`Failed to delete ${selectedItems.length - successCount} items`)
      }

      setSelectedItems([])
    } catch (error) {
      console.error("Error deleting media items:", error)
      toast.error("Failed to delete media items")
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleSelectItem = (id: number) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]))
  }

  const selectAllItems = () => {
    if (selectedItems.length === mediaItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(mediaItems.map((item) => item.id))
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your images, videos, and other media files</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Folder Name</Label>
                  <Input
                    id="folder-name"
                    placeholder="Enter folder name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent-folder">Parent Folder (Optional)</Label>
                  <Select
                    value={selectedFolder?.toString() || "0"}
                    onValueChange={(value) => setSelectedFolder(value ? Number.parseInt(value) : undefined)}
                  >
                    <SelectTrigger id="parent-folder">
                      <SelectValue placeholder="Select Parent Folder" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Root</SelectItem>
                      {folders.map((folder) => (
                        <SelectItem key={folder.id} value={folder.id.toString()}>
                          {folder.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || isCreatingFolder}>
                  {isCreatingFolder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Folder"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="relative">
            <Input type="file" id="file-upload" className="hidden" onChange={handleUpload} disabled={uploading} />
            <label htmlFor="file-upload">
              <Button asChild>
                <span>
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </span>
              </Button>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="unused">Unused</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select
            value={selectedFolder?.toString() || "0"}
            onValueChange={(value) => setSelectedFolder(value ? Number.parseInt(value) : undefined)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Folders" />
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

          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              className="pl-8 w-[200px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                onClick={() => setSearch("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={() => fetchMediaItems()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader className="py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Selected ({selectedItems.length})
                        </>
                      )}
                    </Button>
                  )}
                  <Checkbox
                    checked={selectedItems.length === mediaItems.length && mediaItems.length > 0}
                    onCheckedChange={selectAllItems}
                    aria-label="Select all"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : mediaItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No media files found</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                    {mediaItems.map((item) => (
                      <div
                        key={item.id}
                        className={`border rounded-md overflow-hidden cursor-pointer transition-all hover:border-primary relative ${
                          selectedMedia?.id === item.id ? "ring-2 ring-primary" : ""
                        }`}
                        onClick={() => handleSelectMedia(item)}
                      >
                        <div className="absolute top-2 left-2 z-10">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => toggleSelectItem(item.id)}
                            onClick={(e) => e.stopPropagation()}
                            aria-label={`Select ${item.original_filename}`}
                          />
                        </div>

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
                </ScrollArea>
              )}
            </CardContent>
          </Card>

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
        </div>

        <div className="w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle>Media Details</CardTitle>
              <CardDescription>
                {selectedMedia ? "View and edit media information" : "Select a media item to view details"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMedia ? (
                <div className="space-y-4">
                  <div className="flex justify-center">{getFileIcon(selectedMedia.mime_type)}</div>
                  <div className="space-y-2">
                    <Label htmlFor="media-title">Title</Label>
                    <Input
                      id="media-title"
                      placeholder="Enter title"
                      value={editForm.title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-alt-text">Alt Text</Label>
                    <Input
                      id="media-alt-text"
                      placeholder="Enter alt text"
                      value={editForm.alt_text}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, alt_text: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-description">Description</Label>
                    <Textarea
                      id="media-description"
                      placeholder="Enter description"
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-tags">Tags</Label>
                    <Input
                      id="media-tags"
                      placeholder="Enter tags separated by commas"
                      value={editForm.tags}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button variant="outline" onClick={() => setIsEditingMedia(false)} disabled={isEditingMedia}>
                      Cancel
                    </Button>
                    <Button variant="default" onClick={handleUpdateMedia} disabled={isEditingMedia}>
                      {isEditingMedia ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Pencil className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Select a media item to edit</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
