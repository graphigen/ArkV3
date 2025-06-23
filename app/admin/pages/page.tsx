"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Calendar,
  Globe,
  FileText,
  RefreshCw,
  Copy,
} from "lucide-react"
import { toast } from "sonner"

interface Page {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  status: string
  language: string
  seo_title?: string
  seo_description?: string
  template: string
  views?: number
  published_at?: string
  created_at: string
  updated_at: string
  author_id?: number
  parent_id?: number
  menu_order?: number
  noindex?: boolean
  canonical_url?: string
  og_title?: string
  og_description?: string
  og_image?: string
  custom_css?: string
  custom_js?: string
  featured_image?: string
}

export default function PagesManagement() {
  const [pages, setPages] = useState<Page[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [newPage, setNewPage] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    status: "draft",
    language: "tr",
    seo_title: "",
    seo_description: "",
    template: "page",
    menu_order: 0,
    noindex: false,
  })

  const fetchPages = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()

      if (languageFilter !== "all") params.append("language", languageFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchTerm) params.append("search", searchTerm)

      const url = `/api/admin/pages?${params.toString()}`
      console.log("Fetching pages from:", url)

      const response = await fetch(url)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("API Error Response:", errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Received data:", data)

      // API artık pagination objesi döndürüyor
      if (data.pages && Array.isArray(data.pages)) {
        setPages(data.pages)
      } else if (Array.isArray(data)) {
        // Backward compatibility
        setPages(data)
      } else {
        console.error("Unexpected data format:", data)
        setPages([])
      }
    } catch (error) {
      console.error("Error fetching pages:", error)
      toast.error("Sayfalar yüklenirken hata oluştu: " + error.message)
      setPages([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPages()
  }, [])

  const handleCreatePage = async () => {
    if (!newPage.title.trim()) {
      toast.error("Sayfa başlığı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      // Mock data için direkt ekleme
      const createdPage = {
        id: pages.length + 1,
        ...newPage,
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setPages([createdPage, ...pages])
      setIsCreateDialogOpen(false)
      setNewPage({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        status: "draft",
        language: "tr",
        seo_title: "",
        seo_description: "",
        template: "page",
        menu_order: 0,
        noindex: false,
      })
      toast.success("Sayfa başarıyla oluşturuldu")
    } catch (error) {
      console.error("Error creating page:", error)
      toast.error("Sayfa oluşturulurken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditPage = (page: Page) => {
    setEditingPage(page)
    setNewPage({
      title: page.title,
      slug: page.slug,
      content: page.content || "",
      excerpt: page.excerpt || "",
      status: page.status,
      language: page.language,
      seo_title: page.seo_title || "",
      seo_description: page.seo_description || "",
      template: page.template,
      menu_order: page.menu_order || 0,
      noindex: page.noindex || false,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdatePage = async () => {
    if (!editingPage || !newPage.title.trim()) {
      toast.error("Sayfa başlığı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingPage.id, ...newPage }),
      })

      if (response.ok) {
        const updatedPage = await response.json()
        setPages(pages.map((p) => (p.id === editingPage.id ? updatedPage : p)))
        setIsEditDialogOpen(false)
        setEditingPage(null)
        toast.success("Sayfa başarıyla güncellendi")
      } else {
        throw new Error("Sayfa güncellenemedi")
      }
    } catch (error) {
      console.error("Error updating page:", error)
      toast.error("Sayfa güncellenirken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePage = async (id: number) => {
    if (!confirm("Bu sayfayı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPages(pages.filter((page) => page.id !== id))
        toast.success("Sayfa başarıyla silindi")
      } else {
        throw new Error("Sayfa silinemedi")
      }
    } catch (error) {
      console.error("Error deleting page:", error)
      toast.error("Sayfa silinirken hata oluştu")
    }
  }

  const handleDuplicatePage = async (page: Page) => {
    setIsSaving(true)
    try {
      const duplicateData = {
        title: `${page.title} (Kopya)`,
        slug: `${page.slug}-kopya-${Date.now()}`,
        content: page.content || "",
        excerpt: page.excerpt || "",
        status: "draft",
        language: page.language,
        seo_title: page.seo_title || "",
        seo_description: page.seo_description || "",
        template: page.template,
        menu_order: (page.menu_order || 0) + 1,
        noindex: true,
      }

      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      })

      if (response.ok) {
        const duplicatedPage = await response.json()
        setPages([duplicatedPage, ...pages])
        toast.success("Sayfa başarıyla kopyalandı")
      } else {
        throw new Error("Sayfa kopyalanamadı")
      }
    } catch (error) {
      console.error("Error duplicating page:", error)
      toast.error("Sayfa kopyalanırken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewPage = (page: Page) => {
    window.open(`/${page.slug}`, "_blank")
  }

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || page.status === statusFilter
    const matchesLanguage = languageFilter === "all" || page.language === languageFilter

    return matchesSearch && matchesStatus && matchesLanguage
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="default">Yayında</Badge>
      case "draft":
        return <Badge variant="secondary">Taslak</Badge>
      case "scheduled":
        return <Badge variant="outline">Zamanlanmış</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sayfa Yönetimi</h1>
          <p className="text-muted-foreground">Web sitenizdeki tüm sayfaları yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchPages} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Yenile
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Sayfa
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Sayfa Oluştur</DialogTitle>
                <DialogDescription>Yeni bir sayfa oluşturun ve içeriğini düzenleyin</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Sayfa Başlığı</Label>
                    <Input
                      id="title"
                      value={newPage.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setNewPage({
                          ...newPage,
                          title,
                          slug: newPage.slug || generateSlug(title),
                        })
                      }}
                      placeholder="Sayfa başlığı"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={newPage.slug}
                      onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                      placeholder="sayfa-url"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="excerpt">Özet</Label>
                  <Textarea
                    id="excerpt"
                    value={newPage.excerpt}
                    onChange={(e) => setNewPage({ ...newPage, excerpt: e.target.value })}
                    placeholder="Sayfa özeti"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="content">İçerik</Label>
                  <Textarea
                    id="content"
                    value={newPage.content}
                    onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                    placeholder="Sayfa içeriği"
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="status">Durum</Label>
                    <Select value={newPage.status} onValueChange={(value) => setNewPage({ ...newPage, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Taslak</SelectItem>
                        <SelectItem value="published">Yayında</SelectItem>
                        <SelectItem value="scheduled">Zamanlanmış</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Dil</Label>
                    <Select
                      value={newPage.language}
                      onValueChange={(value) => setNewPage({ ...newPage, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="template">Şablon</Label>
                    <Select
                      value={newPage.template}
                      onValueChange={(value) => setNewPage({ ...newPage, template: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="page">Sayfa</SelectItem>
                        <SelectItem value="landing">Landing</SelectItem>
                        <SelectItem value="contact">İletişim</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seo-title">SEO Başlık</Label>
                    <Input
                      id="seo-title"
                      value={newPage.seo_title}
                      onChange={(e) => setNewPage({ ...newPage, seo_title: e.target.value })}
                      placeholder="SEO başlığı"
                    />
                  </div>
                  <div>
                    <Label htmlFor="menu-order">Menü Sırası</Label>
                    <Input
                      id="menu-order"
                      type="number"
                      value={newPage.menu_order}
                      onChange={(e) => setNewPage({ ...newPage, menu_order: Number.parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="seo-description">SEO Açıklama</Label>
                  <Textarea
                    id="seo-description"
                    value={newPage.seo_description}
                    onChange={(e) => setNewPage({ ...newPage, seo_description: e.target.value })}
                    placeholder="SEO açıklaması"
                    rows={3}
                  />
                </div>

                <Button onClick={handleCreatePage} disabled={isSaving} className="w-full">
                  {isSaving ? "Oluşturuluyor..." : "Sayfa Oluştur"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Sayfa ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Durumlar</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="scheduled">Zamanlanmış</SelectItem>
              </SelectContent>
            </Select>
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Dil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Diller</SelectItem>
                <SelectItem value="tr">Türkçe</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pages Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sayfalar ({filteredPages.length})</CardTitle>
          <CardDescription>Toplam {pages.length} sayfa bulunuyor</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Dil</TableHead>
                  <TableHead>Son Güncelleme</TableHead>
                  <TableHead>Görüntülenme</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span>{page.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{page.slug}</code>
                    </TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {page.language}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(page.updated_at).toLocaleDateString("tr-TR")}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span>{page.views?.toLocaleString() || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menüyü aç</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditPage(page)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewPage(page)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicatePage(page)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Kopyala
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePage(page.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Sil
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sayfa Düzenle</DialogTitle>
            <DialogDescription>Sayfa bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-title">Sayfa Başlığı</Label>
                <Input
                  id="edit-title"
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  placeholder="Sayfa başlığı"
                />
              </div>
              <div>
                <Label htmlFor="edit-slug">URL Slug</Label>
                <Input
                  id="edit-slug"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  placeholder="sayfa-url"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-excerpt">Özet</Label>
              <Textarea
                id="edit-excerpt"
                value={newPage.excerpt}
                onChange={(e) => setNewPage({ ...newPage, excerpt: e.target.value })}
                placeholder="Sayfa özeti"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="edit-content">İçerik</Label>
              <Textarea
                id="edit-content"
                value={newPage.content}
                onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                placeholder="Sayfa içeriği"
                rows={6}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-status">Durum</Label>
                <Select value={newPage.status} onValueChange={(value) => setNewPage({ ...newPage, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="published">Yayında</SelectItem>
                    <SelectItem value="scheduled">Zamanlanmış</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-language">Dil</Label>
                <Select value={newPage.language} onValueChange={(value) => setNewPage({ ...newPage, language: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-template">Şablon</Label>
                <Select value={newPage.template} onValueChange={(value) => setNewPage({ ...newPage, template: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Sayfa</SelectItem>
                    <SelectItem value="landing">Landing</SelectItem>
                    <SelectItem value="contact">İletişim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={handleUpdatePage} disabled={isSaving} className="w-full">
              {isSaving ? "Güncelleniyor..." : "Sayfa Güncelle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Sayfa</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yayında</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter((p) => p.status === "published").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taslak</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pages.filter((p) => p.status === "draft").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pages.reduce((acc, p) => acc + (p.views || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
