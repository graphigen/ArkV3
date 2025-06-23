"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Menu,
  Edit,
  Trash2,
  MoreHorizontal,
  GripVertical,
  ExternalLink,
  FileText,
  Save,
  RefreshCw,
  Eye,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface MenuItem {
  id: number
  menu_location: string
  title: string
  url?: string
  page_id?: number
  parent_id?: number
  menu_order: number
  target: string
  css_class?: string
  icon?: string
  is_active: boolean
  language: string
  visibility: string
  children?: MenuItem[]
  created_at: Date
  updated_at: Date
}

interface MenuLocation {
  location_key: string
  location_name: string
  description?: string
}

interface Page {
  id: number
  title: string
  slug: string
  status: string
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuLocations, setMenuLocations] = useState<MenuLocation[]>([])
  const [pages, setPages] = useState<Page[]>([])
  const [selectedLocation, setSelectedLocation] = useState("header")
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [draggedItem, setDraggedItem] = useState<MenuItem | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const [formData, setFormData] = useState({
    title: "",
    url: "",
    page_id: "",
    parent_id: "",
    target: "_self",
    css_class: "",
    icon: "",
    is_active: true,
    visibility: "public",
  })

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [menuResponse, locationsResponse, pagesResponse] = await Promise.all([
        fetch(`/api/admin/menus?location=${selectedLocation}`),
        fetch("/api/admin/menus/locations"),
        fetch("/api/admin/pages"),
      ])

      if (menuResponse.ok) {
        const menuData = await menuResponse.json()
        setMenuItems(menuData)
        // Tüm ana menüleri genişletilmiş olarak başlat
        const parentIds = menuData.filter((item: MenuItem) => !item.parent_id).map((item: MenuItem) => item.id)
        setExpandedItems(new Set(parentIds))
      }

      if (locationsResponse.ok) {
        const locationsData = await locationsResponse.json()
        setMenuLocations(locationsData)
      }

      if (pagesResponse.ok) {
        const pagesData = await pagesResponse.json()
        setPages(pagesData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Hata",
        description: "Veriler yüklenirken bir hata oluştu",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [selectedLocation])

  const handleSave = async () => {
    try {
      const itemData = {
        ...formData,
        menu_location: selectedLocation,
        page_id: formData.page_id ? Number.parseInt(formData.page_id) : null,
        parent_id: formData.parent_id ? Number.parseInt(formData.parent_id) : null,
        menu_order: editingItem ? editingItem.menu_order : menuItems.length + 1,
        language: "tr",
      }

      const url = editingItem ? `/api/admin/menus/${editingItem.id}` : "/api/admin/menus"
      const method = editingItem ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      })

      if (response.ok) {
        await fetchData()
        setIsDialogOpen(false)
        resetForm()
        toast({
          title: "Başarılı",
          description: editingItem ? "Menü öğesi güncellendi" : "Menü öğesi eklendi",
        })
      } else {
        throw new Error("API hatası")
      }
    } catch (error) {
      console.error("Error saving menu item:", error)
      toast({
        title: "Hata",
        description: "Menü öğesi kaydedilirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bu menü öğesini ve alt menülerini silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/menus/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchData()
        toast({
          title: "Başarılı",
          description: "Menü öğesi silindi",
        })
      } else {
        throw new Error("API hatası")
      }
    } catch (error) {
      console.error("Error deleting menu item:", error)
      toast({
        title: "Hata",
        description: "Menü öğesi silinirken bir hata oluştu",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      url: item.url || "",
      page_id: item.page_id?.toString() || "",
      parent_id: item.parent_id?.toString() || "",
      target: item.target,
      css_class: item.css_class || "",
      icon: item.icon || "",
      is_active: item.is_active,
      visibility: item.visibility,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      title: "",
      url: "",
      page_id: "",
      parent_id: "",
      target: "_self",
      css_class: "",
      icon: "",
      is_active: true,
      visibility: "public",
    })
  }

  const handleDragStart = (e: React.DragEvent, item: MenuItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = async (e: React.DragEvent, targetItem: MenuItem) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.id === targetItem.id) return

    try {
      const newItems = [...menuItems]
      const draggedIndex = newItems.findIndex((item) => item.id === draggedItem.id)
      const targetIndex = newItems.findIndex((item) => item.id === targetItem.id)

      // Remove dragged item and insert at new position
      const [removed] = newItems.splice(draggedIndex, 1)
      newItems.splice(targetIndex, 0, removed)

      // Update menu_order for all items
      const reorderedItems = newItems.map((item, index) => ({
        id: item.id,
        menu_order: index + 1,
        parent_id: item.parent_id,
      }))

      const response = await fetch("/api/admin/menus", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", items: reorderedItems }),
      })

      if (response.ok) {
        await fetchData()
        toast({
          title: "Başarılı",
          description: "Menü sıralaması güncellendi",
        })
      } else {
        throw new Error("API hatası")
      }
    } catch (error) {
      console.error("Error reordering menu items:", error)
      toast({
        title: "Hata",
        description: "Menü sıralaması güncellenirken bir hata oluştu",
        variant: "destructive",
      })
    }

    setDraggedItem(null)
  }

  const toggleExpanded = (itemId: number) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId)
    } else {
      newExpanded.add(itemId)
    }
    setExpandedItems(newExpanded)
  }

  const getItemDepth = (item: MenuItem): number => {
    if (!item.parent_id) return 0
    const parent = menuItems.find((i) => i.id === item.parent_id)
    return parent ? getItemDepth(parent) + 1 : 0
  }

  const getParentMenuItems = () => {
    return menuItems.filter((item) => !item.parent_id)
  }

  const getChildMenuItems = (parentId: number) => {
    return menuItems.filter((item) => item.parent_id === parentId)
  }

  const renderMenuRow = (item: MenuItem, depth = 0) => {
    const hasChildren = menuItems.some((child) => child.parent_id === item.id)
    const isExpanded = expandedItems.has(item.id)
    const children = getChildMenuItems(item.id)

    return (
      <React.Fragment key={item.id}>
        <TableRow
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
          className="cursor-move hover:bg-muted/50"
        >
          <TableCell>
            <div className="flex items-center space-x-2" style={{ paddingLeft: `${depth * 20}px` }}>
              <GripVertical className="h-4 w-4 text-muted-foreground" />
              {hasChildren && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleExpanded(item.id)}>
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
              <span className="text-sm font-mono">{item.menu_order}</span>
            </div>
          </TableCell>
          <TableCell className="font-medium">
            <div className="flex items-center space-x-2">
              {item.icon && <span className="text-sm">{item.icon}</span>}
              <span>{item.title}</span>
              {depth > 0 && <Badge variant="outline">Alt Menü</Badge>}
              {hasChildren && <Badge variant="secondary">{children.length} alt öğe</Badge>}
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              {item.page_id ? <FileText className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
              <code className="text-sm bg-muted px-2 py-1 rounded max-w-[200px] truncate">{item.url}</code>
            </div>
          </TableCell>
          <TableCell>
            <Badge variant={item.target === "_blank" ? "secondary" : "outline"}>
              {item.target === "_blank" ? "Yeni Pencere" : "Aynı Pencere"}
            </Badge>
          </TableCell>
          <TableCell>
            <Badge variant={item.is_active ? "default" : "secondary"}>{item.is_active ? "Aktif" : "Pasif"}</Badge>
          </TableCell>
          <TableCell className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => window.open(item.url, item.target)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Görüntüle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
        {hasChildren && isExpanded && children.map((child) => renderMenuRow(child, depth + 1))}
      </React.Fragment>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Menü Yönetimi</h1>
            <p className="text-muted-foreground">Site menülerini yönetin</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menü Yönetimi</h1>
          <p className="text-muted-foreground">Site menülerini yönetin ve düzenleyin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Yenile
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Menü Öğesi Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingItem ? "Menü Öğesini Düzenle" : "Yeni Menü Öğesi"}</DialogTitle>
                <DialogDescription>
                  {selectedLocation} menüsü için {editingItem ? "mevcut öğeyi düzenleyin" : "yeni öğe ekleyin"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Başlık</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Menü başlığı"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="parent_id">Üst Menü</Label>
                  <Select
                    value={formData.parent_id}
                    onValueChange={(value) => setFormData({ ...formData, parent_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ana menü (üst menü yok)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Ana menü (üst menü yok)</SelectItem>
                      {getParentMenuItems().map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Link Türü</Label>
                  <Tabs defaultValue={formData.page_id ? "page" : "url"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="page">Sayfa</TabsTrigger>
                      <TabsTrigger value="url">URL</TabsTrigger>
                    </TabsList>
                    <TabsContent value="page" className="space-y-2">
                      <Label htmlFor="page_id">Sayfa Seç</Label>
                      <Select
                        value={formData.page_id}
                        onValueChange={(value) => setFormData({ ...formData, page_id: value, url: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sayfa seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {pages.map((page) => (
                            <SelectItem key={page.id} value={page.id.toString()}>
                              {page.title} ({page.slug})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TabsContent>
                    <TabsContent value="url" className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value, page_id: "" })}
                        placeholder="https://example.com veya /sayfa-adi"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="target">Hedef</Label>
                    <Select
                      value={formData.target}
                      onValueChange={(value) => setFormData({ ...formData, target: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_self">Aynı Pencere</SelectItem>
                        <SelectItem value="_blank">Yeni Pencere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="visibility">Görünürlük</Label>
                    <Select
                      value={formData.visibility}
                      onValueChange={(value) => setFormData({ ...formData, visibility: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Herkese Açık</SelectItem>
                        <SelectItem value="logged_in">Sadece Üyeler</SelectItem>
                        <SelectItem value="logged_out">Sadece Ziyaretçiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="css_class">CSS Sınıfı</Label>
                    <Input
                      id="css_class"
                      value={formData.css_class}
                      onChange={(e) => setFormData({ ...formData, css_class: e.target.value })}
                      placeholder="custom-class"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="icon">İkon</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="home, user, settings"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                  <Label htmlFor="is_active">Aktif</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  İptal
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingItem ? "Güncelle" : "Kaydet"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Menu Location Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Menü Konumu</CardTitle>
          <CardDescription>Düzenlemek istediğiniz menü konumunu seçin</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {menuLocations.map((location) => (
                <SelectItem key={location.location_key} value={location.location_key}>
                  <div className="flex items-center space-x-2">
                    <Menu className="h-4 w-4" />
                    <span>{location.location_name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Menu Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>{menuLocations.find((l) => l.location_key === selectedLocation)?.location_name} Menüsü</CardTitle>
          <CardDescription>
            Menü öğelerini sürükleyerek sıralayabilir, düzenleyebilir veya silebilirsiniz. Alt menüleri görmek için
            genişlet butonuna tıklayın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Sıra</TableHead>
                <TableHead>Başlık</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Hedef</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{getParentMenuItems().map((item) => renderMenuRow(item))}</TableBody>
          </Table>
          {menuItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Bu menü konumunda henüz öğe bulunmuyor. Yeni öğe eklemek için yukarıdaki butonu kullanın.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
