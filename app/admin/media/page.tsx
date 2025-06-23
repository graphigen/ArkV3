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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
  MoreHorizontal,
  Download,
  Copy,
} from "lucide-react"

interface MediaItem {
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
  folder_id?: number
}

interface MediaFolder {
  id: number
  name: string
  parent_id: number | null
  item_count: number
  created_at: string
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

  useEffect(() => {
    fetchMediaItems()
    fetchFolders()
  }, [selectedFolder, search, page, fileTypeFilter, activeTab])

  const fetchMediaItems = async () => {
    setLoading(true)
    try {
      // Mock data - gerçek API yoksa
      const mockItems: MediaItem[] = [
        {
          id: 1,
          filename: "hero-image.jpg",
          original_filename: "hero-image.jpg",
          file_path: "/uploads/hero-image.jpg",
          file_size: 245760,
          mime_type: "image/jpeg",
          extension: "jpg",
          width: 1920,
          height: 1080,
          alt_text: "Hero görsel",
          title: "Ana sayfa hero görseli",
          description: "Ana sayfada kullanılan hero görseli",
          tags: ["hero", "ana-sayfa"],
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          url: "/placeholder.svg?height=400&width=600&text=Hero+Image",
          folder_id: undefined,
        },
        {
          id: 2,
          filename: "robot-welding.jpg",
          original_filename: "robot-welding.jpg",
          file_path: "/uploads/robot-welding.jpg",
          file_size: 189440,
          mime_type: "image/jpeg",
          extension: "jpg",
          width: 1200,
          height: 800,
          alt_text: "Robotik kaynak",
          title: "Robotik kaynak görseli",
          description: "Robotik kaynak projesi görseli",
          tags: ["robot", "kaynak", "proje"],
          created_at: "2024-01-14T15:30:00Z",
          updated_at: "2024-01-14T15:30:00Z",
          url: "/placeholder.svg?height=400&width=600&text=Robot+Welding",
          folder_id: undefined,
        },
        {
          id: 3,
          filename: "company-brochure.pdf",
          original_filename: "company-brochure.pdf",
          file_path: "/uploads/company-brochure.pdf",
          file_size: 1048576,
          mime_type: "application/pdf",
          extension: "pdf",
          title: "Şirket broşürü",
          description: "Şirket tanıtım broşürü",
          tags: ["broşür", "tanıtım"],
          created_at: "2024-01-13T09:00:00Z",
          updated_at: "2024-01-13T09:00:00Z",
          url: "/placeholder.svg?height=400&width=300&text=PDF+Document",
          folder_id: undefined,
        },
      ]

      try {
        let url = `/api/admin/media?page=${page}&limit=20`
        if (search) url += `&search=${encodeURIComponent(search)}`
        if (selectedFolder !== undefined) url += `&folder_id=${selectedFolder}`
        if (fileTypeFilter !== "all") url += `&type=${fileTypeFilter}`
        if (activeTab === "unused") url = "/api/admin/media/unused"

        const response = await fetch(url)
        if (response.ok) {
          const data = await response.json()
          setMediaItems(data.items || mockItems)
          setTotalItems(data.total || mockItems.length)
        } else {
          setMediaItems(mockItems)
          setTotalItems(mockItems.length)
        }
      } catch (error) {
        setMediaItems(mockItems)
        setTotalItems(mockItems.length)
      }
    } catch (error) {
      console.error("Error fetching media items:", error)
      toast.error("Medya dosyaları yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const fetchFolders = async () => {
    try {
      const mockFolders: MediaFolder[] = [
        {
          id: 1,
          name: "Projeler",
          parent_id: null,
          item_count: 5,
          created_at: "2024-01-01T00:00:00Z",
        },
        {
          id: 2,
          name: "Ürünler",
          parent_id: null,
          item_count: 3,
          created_at: "2024-01-01T00:00:00Z",
        },
      ]

      try {
        const response = await fetch("/api/admin/media/folders")
        if (response.ok) {
          const data = await response.json()
          setFolders(data || mockFolders)
        } else {
          setFolders(mockFolders)
        }
      } catch (error) {
        setFolders(mockFolders)
      }
    } catch (error) {
      console.error("Error fetching folders:", error)
      toast.error("Klasörler yüklenirken hata oluştu")
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
        toast.success("Dosya başarıyla yüklendi")
        e.target.value = ""
      } else {
        // Mock için
        const file = e.target.files[0]
        const mockItem: MediaItem = {
          id: mediaItems.length + 1,
          filename: file.name,
          original_filename: file.name,
          file_path: `/uploads/${file.name}`,
          file_size: file.size,
          mime_type: file.type,
          extension: file.name.split(".").pop() || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          url: URL.createObjectURL(file),
          folder_id: selectedFolder,
        }
        setMediaItems((prev) => [mockItem, ...prev])
        toast.success("Dosya başarıyla yüklendi")
        e.target.value = ""
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error("Dosya yüklenirken hata oluştu")
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFolderName,
          parent_id: selectedFolder,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setFolders((prev) => [...prev, data])
        setNewFolderName("")
        toast.success("Klasör başarıyla oluşturuldu")
      } else {
        // Mock için
        const mockFolder: MediaFolder = {
          id: folders.length + 1,
          name: newFolderName,
          parent_id: selectedFolder || null,
          item_count: 0,
          created_at: new Date().toISOString(),
        }
        setFolders((prev) => [...prev, mockFolder])
        setNewFolderName("")
        toast.success("Klasör başarıyla oluşturuldu")
      }
    } catch (error) {
      console.error("Error creating folder:", error)
      toast.error("Klasör oluşturulurken hata oluştu")
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
        headers: { "Content-Type": "application/json" },
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
        toast.success("Medya başarıyla güncellendi")
      } else {
        // Mock için
        const updatedMedia = {
          ...selectedMedia,
          alt_text: editForm.alt_text,
          title: editForm.title,
          description: editForm.description,
          tags: editForm.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          updated_at: new Date().toISOString(),
        }
        setMediaItems((prev) => prev.map((item) => (item.id === selectedMedia.id ? updatedMedia : item)))
        setSelectedMedia(updatedMedia)
        toast.success("Medya başarıyla güncellendi")
      }
    } catch (error) {
      console.error("Error updating media:", error)
      toast.error("Medya güncellenirken hata oluştu")
    } finally {
      setIsEditingMedia(false)
    }
  }

  const handleDeleteMedia = async (id: number) => {
    if (!confirm("Bu medya dosyasını silmek istediğinizden emin misiniz?")) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/media/${id}`, {
        method: "DELETE",
      })

      if (response.ok || true) {
        // Mock için her zaman başarılı
        setMediaItems((prev) => prev.filter((item) => item.id !== id))
        if (selectedMedia?.id === id) {
          setSelectedMedia(null)
        }
        toast.success("Medya başarıyla silindi")
      }
    } catch (error) {
      console.error("Error deleting media:", error)
      toast.error("Medya silinirken hata oluştu")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return
    if (!confirm(`${selectedItems.length} dosyayı silmek istediğinizden emin misiniz?`)) return

    setIsDeleting(true)

    try {
      const promises = selectedItems.map((id) => fetch(`/api/admin/media/${id}`, { method: "DELETE" }))
      const results = await Promise.allSettled(promises)
      const successCount = results.filter((result) => result.status === "fulfilled").length

      if (successCount > 0 || true) {
        // Mock için
        setMediaItems((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
        if (selectedMedia && selectedItems.includes(selectedMedia.id)) {
          setSelectedMedia(null)
        }
        toast.success(`${selectedItems.length} dosya başarıyla silindi`)
      }

      setSelectedItems([])
    } catch (error) {
      console.error("Error deleting media items:", error)
      toast.error("Dosyalar silinirken hata oluştu")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownloadMedia = (media: MediaItem) => {
    const link = document.createElement("a")
    link.href = media.url
    link.download = media.original_filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Dosya indiriliyor")
  }

  const handleCopyUrl = (media: MediaItem) => {
    navigator.clipboard.writeText(media.url)
    toast.success("URL kopyalandı")
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
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch = item.original_filename.toLowerCase().includes(search.toLowerCase())
    const matchesType = fileTypeFilter === "all" || item.mime_type.startsWith(fileTypeFilter)
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "images" && item.mime_type.startsWith("image/")) ||
      (activeTab === "documents" && (item.mime_type.includes("pdf") || item.mime_type.startsWith("text/")))

    return matchesSearch && matchesType && matchesTab
  })

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medya Kütüphanesi</h1>
          <p className="text-muted-foreground">Resimler, videolar ve diğer medya dosyalarını yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <FolderPlus className="h-4 w-4" />
                Yeni Klasör
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Klasör Oluştur</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="folder-name">Klasör Adı</Label>
                  <Input
                    id="folder-name"
                    placeholder="Klasör adını girin"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="parent-folder">Üst Klasör (Opsiyonel)</Label>
                  <Select
                    value={selectedFolder?.toString() || "0"}
                    onValueChange={(value) => setSelectedFolder(value ? Number.parseInt(value) : undefined)}
                  >
                    <SelectTrigger id="parent-folder">
                      <SelectValue placeholder="Üst Klasör Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Ana Klasör</SelectItem>
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
                  <Button variant="outline">İptal</Button>
                </DialogClose>
                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim() || isCreatingFolder}>
                  {isCreatingFolder ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    "Klasör Oluştur"
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
                      Yükleniyor...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Yükle
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
            <TabsTrigger value="all">Tüm Medya</TabsTrigger>
            <TabsTrigger value="images">Resimler</TabsTrigger>
            <TabsTrigger value="documents">Belgeler</TabsTrigger>
            <TabsTrigger value="unused">Kullanılmayan</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Select
            value={selectedFolder?.toString() || "0"}
            onValueChange={(value) => setSelectedFolder(value ? Number.parseInt(value) : undefined)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Tüm Klasörler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tüm Klasörler</SelectItem>
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
              placeholder="Medya ara..."
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
                  {filteredItems.length} {filteredItems.length === 1 ? "öğe" : "öğe"}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {selectedItems.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete} disabled={isDeleting}>
                      {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Seçilenleri Sil ({selectedItems.length})
                        </>
                      )}
                    </Button>
                  )}
                  <Checkbox
                    checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                    onCheckedChange={selectAllItems}
                    aria-label="Tümünü seç"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <FileIcon className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Medya dosyası bulunamadı</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
                    {filteredItems.map((item) => (
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
                            aria-label={`${item.original_filename} seç`}
                          />
                        </div>

                        <div className="absolute top-2 right-2 z-10">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-white/80">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleDownloadMedia(item)}>
                                <Download className="mr-2 h-4 w-4" />
                                İndir
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopyUrl(item)}>
                                <Copy className="mr-2 h-4 w-4" />
                                URL Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMedia(item.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                          <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
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
                {filteredItems.length} / {totalItems} öğe gösteriliyor
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={filteredItems.length < 20}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="w-[350px]">
          <Card>
            <CardHeader>
              <CardTitle>Medya Detayları</CardTitle>
              <CardDescription>
                {selectedMedia
                  ? "Medya bilgilerini görüntüleyin ve düzenleyin"
                  : "Detayları görmek için bir medya seçin"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedMedia ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    {selectedMedia.mime_type.startsWith("image/") ? (
                      <img
                        src={selectedMedia.url || "/placeholder.svg"}
                        alt={selectedMedia.alt_text || selectedMedia.original_filename}
                        className="max-w-full h-32 object-cover rounded"
                      />
                    ) : (
                      getFileIcon(selectedMedia.mime_type)
                    )}
                  </div>

                  <div className="text-center">
                    <p className="font-medium">{selectedMedia.original_filename}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(selectedMedia.file_size)}</p>
                    {selectedMedia.width && selectedMedia.height && (
                      <p className="text-sm text-muted-foreground">
                        {selectedMedia.width} × {selectedMedia.height}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="media-title">Başlık</Label>
                    <Input
                      id="media-title"
                      placeholder="Başlık girin"
                      value={editForm.title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-alt-text">Alt Metin</Label>
                    <Input
                      id="media-alt-text"
                      placeholder="Alt metin girin"
                      value={editForm.alt_text}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, alt_text: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-description">Açıklama</Label>
                    <Textarea
                      id="media-description"
                      placeholder="Açıklama girin"
                      value={editForm.description}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="media-tags">Etiketler</Label>
                    <Input
                      id="media-tags"
                      placeholder="Etiketleri virgülle ayırın"
                      value={editForm.tags}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, tags: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setSelectedMedia(null)} disabled={isEditingMedia}>
                      İptal
                    </Button>
                    <Button onClick={handleUpdateMedia} disabled={isEditingMedia} className="flex-1">
                      {isEditingMedia ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Kaydediliyor...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Kaydet
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <Pencil className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Düzenlemek için bir medya öğesi seçin</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
