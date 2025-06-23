"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MediaSelector } from "@/components/media-selector"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Tag,
  MessageSquare,
  Loader2,
  MoreHorizontal,
  Copy,
  ExternalLink,
  ImageIcon,
} from "lucide-react"
import { toast } from "sonner"

interface Post {
  id: number
  title: string
  slug: string
  content?: string
  excerpt?: string
  featured_image?: string
  status: string
  category_id?: number
  category_name?: string
  author_name?: string
  tags?: string[]
  views?: number
  reading_time?: number
  created_at: string
  updated_at: string
  published_at?: string
}

interface Category {
  id: number
  name: string
  slug: string
  description?: string
  post_count?: number
}

interface MediaItem {
  id: number
  url: string
  filename: string
  alt_text?: string
}

export default function BlogManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)
  const [isEditPostOpen, setIsEditPostOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [newPost, setNewPost] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featured_image: "",
    category_id: "",
    status: "draft" as "draft" | "published",
    tags: "",
    meta_title: "",
    meta_description: "",
  })

  const [newCategory, setNewCategory] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#6B7280",
  })

  useEffect(() => {
    fetchPosts()
    fetchCategories()
  }, [selectedCategory, selectedStatus, searchTerm])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (selectedStatus !== "all") params.append("status", selectedStatus)
      if (searchTerm) params.append("search", searchTerm)

      const response = await fetch(`/api/admin/blog/posts?${params}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Posts fetch error:", error)
      toast.error("Blog yazıları yüklenirken hata oluştu")
      setPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog/categories")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Categories fetch error:", error)
      toast.error("Kategoriler yüklenirken hata oluştu")
      setCategories([])
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

  const handleCreatePost = async () => {
    if (!newPost.title.trim()) {
      toast.error("Yazı başlığı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          category_id: newPost.category_id ? Number.parseInt(newPost.category_id) : null,
          tags: newPost.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        const createdPost = await response.json()
        setPosts([createdPost, ...posts])
        setIsCreatePostOpen(false)
        setNewPost({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          featured_image: "",
          category_id: "",
          status: "draft",
          tags: "",
          meta_title: "",
          meta_description: "",
        })
        toast.success("Blog yazısı başarıyla oluşturuldu")
      } else {
        throw new Error("Post creation failed")
      }
    } catch (error) {
      console.error("Post creation error:", error)
      toast.error("Blog yazısı oluşturulurken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setNewPost({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || "",
      content: post.content || "",
      featured_image: post.featured_image || "",
      category_id: post.category_id?.toString() || "",
      status: post.status as "draft" | "published",
      tags: post.tags?.join(", ") || "",
      meta_title: "",
      meta_description: "",
    })
    setIsEditPostOpen(true)
  }

  const handleUpdatePost = async () => {
    if (!editingPost || !newPost.title.trim()) {
      toast.error("Yazı başlığı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/blog/posts/${editingPost.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          category_id: newPost.category_id ? Number.parseInt(newPost.category_id) : null,
          tags: newPost.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (response.ok) {
        const updatedPost = await response.json()
        setPosts(posts.map((p) => (p.id === editingPost.id ? updatedPost : p)))
        setIsEditPostOpen(false)
        setEditingPost(null)
        toast.success("Blog yazısı başarıyla güncellendi")
      } else {
        throw new Error("Post update failed")
      }
    } catch (error) {
      console.error("Post update error:", error)
      toast.error("Blog yazısı güncellenirken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) {
      toast.error("Kategori adı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newCategory,
          slug: newCategory.slug || generateSlug(newCategory.name),
        }),
      })

      if (response.ok) {
        const createdCategory = await response.json()
        setCategories([...categories, createdCategory])
        setIsCreateCategoryOpen(false)
        setNewCategory({ name: "", slug: "", description: "", color: "#6B7280" })
        toast.success("Kategori başarıyla oluşturuldu")
      } else {
        throw new Error("Category creation failed")
      }
    } catch (error) {
      console.error("Category creation error:", error)
      toast.error("Kategori oluşturulurken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePost = async (id: number) => {
    if (!confirm("Bu blog yazısını silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id))
        toast.success("Blog yazısı silindi")
      } else {
        toast.error("Blog yazısı silinirken hata oluştu")
      }
    } catch (error) {
      console.error("Post deletion error:", error)
      toast.error("Blog yazısı silinirken hata oluştu")
    }
  }

  const handleDuplicatePost = async (post: Post) => {
    setIsSaving(true)
    try {
      const duplicateData = {
        title: `${post.title} (Kopya)`,
        slug: `${post.slug}-kopya-${Date.now()}`,
        excerpt: post.excerpt || "",
        content: post.content || "",
        featured_image: post.featured_image || "",
        category_id: post.category_id,
        status: "draft",
        tags: post.tags || [],
      }

      const response = await fetch("/api/admin/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      })

      if (response.ok) {
        const duplicatedPost = await response.json()
        setPosts([duplicatedPost, ...posts])
        toast.success("Blog yazısı başarıyla kopyalandı")
      } else {
        throw new Error("Post duplication failed")
      }
    } catch (error) {
      console.error("Post duplication error:", error)
      toast.error("Blog yazısı kopyalanırken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewPost = (post: Post) => {
    window.open(`/blog/${post.slug}`, "_blank")
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      published: "default",
      draft: "secondary",
      archived: "outline",
    } as const

    const labels = {
      published: "Yayında",
      draft: "Taslak",
      archived: "Arşiv",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || post.category_id?.toString() === selectedCategory
    const matchesStatus = selectedStatus === "all" || post.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Blog Yönetimi</h1>
        <div className="flex gap-2">
          <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setIsCreateCategoryOpen(true)}>
                <Tag className="h-4 w-4 mr-2" />
                Kategori Ekle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Yeni Kategori</DialogTitle>
                <DialogDescription>Blog için yeni kategori oluşturun</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-name">Kategori Adı</Label>
                  <Input
                    id="category-name"
                    value={newCategory.name}
                    onChange={(e) => {
                      const name = e.target.value
                      setNewCategory({
                        ...newCategory,
                        name,
                        slug: newCategory.slug || generateSlug(name),
                      })
                    }}
                    placeholder="Kategori adı"
                  />
                </div>
                <div>
                  <Label htmlFor="category-slug">Slug</Label>
                  <Input
                    id="category-slug"
                    value={newCategory.slug}
                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    placeholder="kategori-slug"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">Açıklama</Label>
                  <Textarea
                    id="category-description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    placeholder="Kategori açıklaması"
                  />
                </div>
                <Button onClick={handleCreateCategory} disabled={isSaving} className="w-full">
                  {isSaving ? "Oluşturuluyor..." : "Kategori Oluştur"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreatePostOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Yazı
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yeni Blog Yazısı</DialogTitle>
                <DialogDescription>Blog için yeni yazı oluşturun</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="post-title">Başlık *</Label>
                    <Input
                      id="post-title"
                      value={newPost.title}
                      onChange={(e) => {
                        const title = e.target.value
                        setNewPost({
                          ...newPost,
                          title,
                          slug: newPost.slug || generateSlug(title),
                          meta_title: newPost.meta_title || title,
                        })
                      }}
                      placeholder="Yazı başlığı"
                    />
                  </div>
                  <div>
                    <Label htmlFor="post-slug">Slug</Label>
                    <Input
                      id="post-slug"
                      value={newPost.slug}
                      onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                      placeholder="yazi-slug"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="post-excerpt">Özet</Label>
                  <Textarea
                    id="post-excerpt"
                    value={newPost.excerpt}
                    onChange={(e) => {
                      const excerpt = e.target.value
                      setNewPost({
                        ...newPost,
                        excerpt,
                        meta_description: newPost.meta_description || excerpt,
                      })
                    }}
                    placeholder="Yazı özeti (SEO için önemli)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Öne Çıkan Fotoğraf</Label>
                  <MediaSelector
                    onSelect={(media) => setNewPost({ ...newPost, featured_image: media?.url || "" })}
                    buttonLabel="Fotoğraf Seç"
                    allowClear={true}
                    showPreview={true}
                    filter={{ type: "image" }}
                  />
                </div>

                <div>
                  <Label htmlFor="post-content">İçerik *</Label>
                  <Textarea
                    id="post-content"
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Yazı içeriği (HTML desteklenir)"
                    rows={12}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    HTML etiketleri kullanabilirsiniz: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;,
                    &lt;ul&gt;, &lt;ol&gt;, &lt;li&gt;, &lt;a&gt;, &lt;ImageIcon&gt;
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="post-category">Kategori</Label>
                    <Select
                      value={newPost.category_id}
                      onValueChange={(value) => setNewPost({ ...newPost, category_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="post-status">Durum</Label>
                    <Select
                      value={newPost.status}
                      onValueChange={(value: "draft" | "published") => setNewPost({ ...newPost, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Taslak</SelectItem>
                        <SelectItem value="published">Yayında</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="post-tags">Etiketler (virgülle ayırın)</Label>
                  <Input
                    id="post-tags"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                    placeholder="etiket1, etiket2, etiket3"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="meta-title">SEO Başlık</Label>
                    <Input
                      id="meta-title"
                      value={newPost.meta_title}
                      onChange={(e) => setNewPost({ ...newPost, meta_title: e.target.value })}
                      placeholder="SEO için özel başlık (boş bırakılırsa yazı başlığı kullanılır)"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-description">SEO Açıklama</Label>
                    <Textarea
                      id="meta-description"
                      value={newPost.meta_description}
                      onChange={(e) => setNewPost({ ...newPost, meta_description: e.target.value })}
                      placeholder="SEO için özel açıklama (boş bırakılırsa özet kullanılır)"
                      rows={2}
                    />
                  </div>
                </div>

                <Button onClick={handleCreatePost} disabled={isSaving} className="w-full">
                  {isSaving ? "Oluşturuluyor..." : "Yazı Oluştur"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Yazı</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yayında</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((p) => p.status === "published").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taslak</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posts.filter((p) => p.status === "draft").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategoriler</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Yazı ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Kategoriler</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tümü</SelectItem>
                <SelectItem value="published">Yayında</SelectItem>
                <SelectItem value="draft">Taslak</SelectItem>
                <SelectItem value="archived">Arşiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Blog Yazıları</CardTitle>
          <CardDescription>Tüm blog yazılarınızı buradan yönetebilirsiniz</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Henüz blog yazısı bulunmuyor</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Görüntülenme</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {post.featured_image && (
                          <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                            <ImageIcon
                              src={post.featured_image || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{post.title}</div>
                          <div className="text-sm text-muted-foreground">/{post.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.category_name || "Kategori Yok"}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(post.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1 text-muted-foreground" />
                        {post.views || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.created_at).toLocaleDateString("tr-TR")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menüyü aç</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditPost(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </DropdownMenuItem>
                          {post.status === "published" && (
                            <DropdownMenuItem onClick={() => handleViewPost(post)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Yayınlanan Yazıyı Görüntüle
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDuplicatePost(post)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Kopyala
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePost(post.id)}>
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

      {/* Edit Post Dialog */}
      <Dialog open={isEditPostOpen} onOpenChange={setIsEditPostOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Blog Yazısını Düzenle</DialogTitle>
            <DialogDescription>Blog yazısı bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-post-title">Başlık *</Label>
                <Input
                  id="edit-post-title"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Yazı başlığı"
                />
              </div>
              <div>
                <Label htmlFor="edit-post-slug">Slug</Label>
                <Input
                  id="edit-post-slug"
                  value={newPost.slug}
                  onChange={(e) => setNewPost({ ...newPost, slug: e.target.value })}
                  placeholder="yazi-slug"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-post-excerpt">Özet</Label>
              <Textarea
                id="edit-post-excerpt"
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Yazı özeti"
                rows={3}
              />
            </div>

            <div>
              <Label>Öne Çıkan Fotoğraf</Label>
              <MediaSelector
                onSelect={(media) => setNewPost({ ...newPost, featured_image: media?.url || "" })}
                buttonLabel="Fotoğraf Seç"
                allowClear={true}
                showPreview={true}
                filter={{ type: "image" }}
              />
            </div>

            <div>
              <Label htmlFor="edit-post-content">İçerik *</Label>
              <Textarea
                id="edit-post-content"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Yazı içeriği"
                rows={12}
                className="font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-post-category">Kategori</Label>
                <Select
                  value={newPost.category_id}
                  onValueChange={(value) => setNewPost({ ...newPost, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-post-status">Durum</Label>
                <Select
                  value={newPost.status}
                  onValueChange={(value: "draft" | "published") => setNewPost({ ...newPost, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="published">Yayında</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="edit-post-tags">Etiketler (virgülle ayırın)</Label>
              <Input
                id="edit-post-tags"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                placeholder="etiket1, etiket2, etiket3"
              />
            </div>

            <Button onClick={handleUpdatePost} disabled={isSaving} className="w-full">
              {isSaving ? "Güncelleniyor..." : "Yazı Güncelle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
