"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  MoreHorizontal,
  RefreshCw,
  Settings,
  Zap,
  Globe,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

interface SEOAnalysis {
  overview: {
    totalPages: number
    seoScore: number
    missingMeta: number
    goodPages: number
    warningPages: number
    errorPages: number
  }
  issues: Array<{
    id: number
    type: "error" | "warning" | "info"
    title: string
    description: string
    pages: Array<{
      url: string
      title: string
    }>
    priority: "high" | "medium" | "low"
    impact: string
  }>
  recommendations: Array<{
    id: number
    title: string
    description: string
    impact: string
    effort: string
    category: string
  }>
  keywords: Array<{
    keyword: string
    position: number
    searchVolume: number
    difficulty: number
    trend: "up" | "down" | "stable"
  }>
  competitors: Array<{
    domain: string
    score: number
    commonKeywords: number
    backlinks: number
  }>
}

interface SEORedirect {
  id: number
  fromUrl: string
  toUrl: string
  redirectType: number
  isActive: boolean
  hitCount: number
  createdAt: string
  updatedAt: string
}

export default function SEOPage() {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [redirects, setRedirects] = useState<SEORedirect[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateRedirectOpen, setIsCreateRedirectOpen] = useState(false)
  const [isEditRedirectOpen, setIsEditRedirectOpen] = useState(false)
  const [editingRedirect, setEditingRedirect] = useState<SEORedirect | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isRunningTools, setIsRunningTools] = useState(false)

  const [newRedirect, setNewRedirect] = useState({
    fromUrl: "",
    toUrl: "",
    redirectType: 301,
    isActive: true,
  })

  useEffect(() => {
    fetchSEOAnalysis()
    fetchRedirects()
  }, [])

  const fetchSEOAnalysis = async () => {
    try {
      const response = await fetch("/api/admin/seo/analysis")
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data)
      }
    } catch (error) {
      console.error("SEO analysis fetch error:", error)
      toast.error("SEO analizi yüklenirken hata oluştu")
    }
  }

  const fetchRedirects = async () => {
    try {
      const response = await fetch("/api/admin/seo/redirects")
      if (response.ok) {
        const data = await response.json()
        setRedirects(data)
      }
    } catch (error) {
      console.error("Redirects fetch error:", error)
      toast.error("Yönlendirmeler yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRedirect = async () => {
    if (!newRedirect.fromUrl || !newRedirect.toUrl) {
      toast.error("Kaynak ve hedef URL gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRedirect),
      })

      if (response.ok) {
        const createdRedirect = await response.json()
        setRedirects([createdRedirect, ...redirects])
        setIsCreateRedirectOpen(false)
        setNewRedirect({ fromUrl: "", toUrl: "", redirectType: 301, isActive: true })
        toast.success("Yönlendirme başarıyla oluşturuldu")
      } else {
        toast.error("Yönlendirme oluşturulamadı")
      }
    } catch (error) {
      console.error("Redirect creation error:", error)
      toast.error("Yönlendirme oluşturulamadı")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditRedirect = (redirect: SEORedirect) => {
    setEditingRedirect(redirect)
    setNewRedirect({
      fromUrl: redirect.fromUrl,
      toUrl: redirect.toUrl,
      redirectType: redirect.redirectType,
      isActive: redirect.isActive,
    })
    setIsEditRedirectOpen(true)
  }

  const handleUpdateRedirect = async () => {
    if (!editingRedirect) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/seo/redirects/${editingRedirect.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRedirect),
      })

      if (response.ok) {
        const updatedRedirect = await response.json()
        setRedirects(redirects.map((r) => (r.id === editingRedirect.id ? updatedRedirect : r)))
        setIsEditRedirectOpen(false)
        setEditingRedirect(null)
        toast.success("Yönlendirme başarıyla güncellendi")
      } else {
        toast.error("Yönlendirme güncellenemedi")
      }
    } catch (error) {
      console.error("Redirect update error:", error)
      toast.error("Yönlendirme güncellenirken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRedirect = async (id: number) => {
    if (!confirm("Bu yönlendirmeyi silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setRedirects(redirects.filter((redirect) => redirect.id !== id))
        toast.success("Yönlendirme silindi")
      } else {
        toast.error("Yönlendirme silinirken hata oluştu")
      }
    } catch (error) {
      console.error("Redirect deletion error:", error)
      toast.error("Yönlendirme silinirken hata oluştu")
    }
  }

  const runSEOTool = async (action: string) => {
    setIsRunningTools(true)
    try {
      const response = await fetch("/api/admin/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(result.message)
        if (action === "generate_sitemap" && result.sitemap) {
          // Show sitemap in a dialog or download it
          const blob = new Blob([result.sitemap], { type: "application/xml" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = "sitemap.xml"
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("SEO tool error:", error)
      toast.error("İşlem gerçekleştirilirken hata oluştu")
    } finally {
      setIsRunningTools(false)
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getIssueBadge = (type: string) => {
    const variants = {
      error: "destructive",
      warning: "secondary",
      info: "outline",
    } as const

    return <Badge variant={variants[type as keyof typeof variants]}>{type.toUpperCase()}</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">SEO Yönetimi</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">SEO Yönetimi</h1>
          <p className="text-muted-foreground">Sitenizin SEO performansını optimize edin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSEOAnalysis}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Analizi Yenile
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                SEO Araçları
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>SEO Araçları</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => runSEOTool("generate_sitemap")} disabled={isRunningTools}>
                <FileText className="mr-2 h-4 w-4" />
                Sitemap Oluştur
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => runSEOTool("clear_cache")} disabled={isRunningTools}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Cache Temizle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => runSEOTool("test_robots")} disabled={isRunningTools}>
                <Settings className="mr-2 h-4 w-4" />
                Robots.txt Test
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => runSEOTool("submit_sitemap")} disabled={isRunningTools}>
                <Globe className="mr-2 h-4 w-4" />
                Google'a Sitemap Gönder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {analysis && (
        <>
          {/* SEO Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">SEO Skoru</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.overview.seoScore}/100</div>
                <div className="text-xs text-muted-foreground">
                  {analysis.overview.seoScore >= 80
                    ? "Mükemmel"
                    : analysis.overview.seoScore >= 60
                      ? "İyi"
                      : "Geliştirilmeli"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Sayfa</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis.overview.totalPages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">İyi Sayfalar</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{analysis.overview.goodPages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uyarı</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{analysis.overview.warningPages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hata</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{analysis.overview.errorPages}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Eksik Meta</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{analysis.overview.missingMeta}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="analysis" className="space-y-4">
            <TabsList>
              <TabsTrigger value="analysis">Analiz</TabsTrigger>
              <TabsTrigger value="redirects">Yönlendirmeler</TabsTrigger>
              <TabsTrigger value="keywords">Anahtar Kelimeler</TabsTrigger>
              <TabsTrigger value="competitors">Rakipler</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Issues */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Sorunları</CardTitle>
                    <CardDescription>Düzeltilmesi gereken sorunlar</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.issues.map((issue) => (
                        <div key={issue.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getIssueIcon(issue.type)}
                              <span className="font-medium">{issue.title}</span>
                            </div>
                            {getIssueBadge(issue.type)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                          <div className="text-xs text-muted-foreground">
                            <strong>Etki:</strong> {issue.impact}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <strong>Etkilenen sayfalar:</strong> {issue.pages.length}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Öneriler</CardTitle>
                    <CardDescription>SEO performansını artırmak için öneriler</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.recommendations.map((rec) => (
                        <div key={rec.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium">{rec.title}</span>
                            <Badge variant="outline">{rec.category}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              <strong>Etki:</strong> {rec.impact}
                            </span>
                            <span>
                              <strong>Zorluk:</strong> {rec.effort}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="redirects">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>URL Yönlendirmeleri</CardTitle>
                      <CardDescription>301 ve 302 yönlendirmelerini yönetin</CardDescription>
                    </div>
                    <Dialog open={isCreateRedirectOpen} onOpenChange={setIsCreateRedirectOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Yeni Yönlendirme
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Yeni Yönlendirme</DialogTitle>
                          <DialogDescription>URL yönlendirmesi oluşturun</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="from-url">Kaynak URL</Label>
                            <Input
                              id="from-url"
                              value={newRedirect.fromUrl}
                              onChange={(e) => setNewRedirect({ ...newRedirect, fromUrl: e.target.value })}
                              placeholder="/eski-sayfa"
                            />
                          </div>
                          <div>
                            <Label htmlFor="to-url">Hedef URL</Label>
                            <Input
                              id="to-url"
                              value={newRedirect.toUrl}
                              onChange={(e) => setNewRedirect({ ...newRedirect, toUrl: e.target.value })}
                              placeholder="/yeni-sayfa"
                            />
                          </div>
                          <div>
                            <Label htmlFor="redirect-type">Yönlendirme Türü</Label>
                            <Select
                              value={newRedirect.redirectType.toString()}
                              onValueChange={(value) =>
                                setNewRedirect({ ...newRedirect, redirectType: Number.parseInt(value) })
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="301">301 - Kalıcı Yönlendirme</SelectItem>
                                <SelectItem value="302">302 - Geçici Yönlendirme</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="is-active"
                              checked={newRedirect.isActive}
                              onCheckedChange={(checked) => setNewRedirect({ ...newRedirect, isActive: checked })}
                            />
                            <Label htmlFor="is-active">Aktif</Label>
                          </div>
                          <Button onClick={handleCreateRedirect} disabled={isSaving} className="w-full">
                            {isSaving ? "Oluşturuluyor..." : "Yönlendirme Oluştur"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kaynak URL</TableHead>
                        <TableHead>Hedef URL</TableHead>
                        <TableHead>Tür</TableHead>
                        <TableHead>Durum</TableHead>
                        <TableHead>Hit Sayısı</TableHead>
                        <TableHead>İşlemler</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {redirects.map((redirect) => (
                        <TableRow key={redirect.id}>
                          <TableCell>
                            <code className="text-sm">{redirect.fromUrl}</code>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm">{redirect.toUrl}</code>
                          </TableCell>
                          <TableCell>
                            <Badge variant={redirect.redirectType === 301 ? "default" : "secondary"}>
                              {redirect.redirectType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={redirect.isActive ? "default" : "secondary"}>
                              {redirect.isActive ? "Aktif" : "Pasif"}
                            </Badge>
                          </TableCell>
                          <TableCell>{redirect.hitCount}</TableCell>
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
                                <DropdownMenuItem onClick={() => handleEditRedirect(redirect)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Düzenle
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(redirect.fromUrl, "_blank")}>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Test Et
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDeleteRedirect(redirect.id)}
                                >
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords">
              <Card>
                <CardHeader>
                  <CardTitle>Anahtar Kelime Performansı</CardTitle>
                  <CardDescription>Anahtar kelimelerinizin sıralama performansı</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Anahtar Kelime</TableHead>
                        <TableHead>Pozisyon</TableHead>
                        <TableHead>Arama Hacmi</TableHead>
                        <TableHead>Zorluk</TableHead>
                        <TableHead>Trend</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.keywords.map((keyword, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{keyword.keyword}</TableCell>
                          <TableCell>
                            <Badge variant={keyword.position <= 10 ? "default" : "secondary"}>
                              #{keyword.position}
                            </Badge>
                          </TableCell>
                          <TableCell>{keyword.searchVolume.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                keyword.difficulty <= 30
                                  ? "default"
                                  : keyword.difficulty <= 60
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {keyword.difficulty}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {keyword.trend === "up" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : keyword.trend === "down" ? (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            ) : (
                              <div className="h-4 w-4 bg-gray-300 rounded-full" />
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors">
              <Card>
                <CardHeader>
                  <CardTitle>Rakip Analizi</CardTitle>
                  <CardDescription>Rakiplerinizin SEO performansı</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>SEO Skoru</TableHead>
                        <TableHead>Ortak Anahtar Kelime</TableHead>
                        <TableHead>Backlink Sayısı</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysis.competitors.map((competitor, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{competitor.domain}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                competitor.score >= 80
                                  ? "default"
                                  : competitor.score >= 60
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {competitor.score}/100
                            </Badge>
                          </TableCell>
                          <TableCell>{competitor.commonKeywords}</TableCell>
                          <TableCell>{competitor.backlinks.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Edit Redirect Dialog */}
      <Dialog open={isEditRedirectOpen} onOpenChange={setIsEditRedirectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yönlendirme Düzenle</DialogTitle>
            <DialogDescription>Yönlendirme bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-from-url">Kaynak URL</Label>
              <Input
                id="edit-from-url"
                value={newRedirect.fromUrl}
                onChange={(e) => setNewRedirect({ ...newRedirect, fromUrl: e.target.value })}
                placeholder="/eski-sayfa"
              />
            </div>
            <div>
              <Label htmlFor="edit-to-url">Hedef URL</Label>
              <Input
                id="edit-to-url"
                value={newRedirect.toUrl}
                onChange={(e) => setNewRedirect({ ...newRedirect, toUrl: e.target.value })}
                placeholder="/yeni-sayfa"
              />
            </div>
            <div>
              <Label htmlFor="edit-redirect-type">Yönlendirme Türü</Label>
              <Select
                value={newRedirect.redirectType.toString()}
                onValueChange={(value) => setNewRedirect({ ...newRedirect, redirectType: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="301">301 - Kalıcı Yönlendirme</SelectItem>
                  <SelectItem value="302">302 - Geçici Yönlendirme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is-active"
                checked={newRedirect.isActive}
                onCheckedChange={(checked) => setNewRedirect({ ...newRedirect, isActive: checked })}
              />
              <Label htmlFor="edit-is-active">Aktif</Label>
            </div>
            <Button onClick={handleUpdateRedirect} disabled={isSaving} className="w-full">
              {isSaving ? "Güncelleniyor..." : "Yönlendirme Güncelle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
