"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Download,
  RefreshCw,
  Zap,
} from "lucide-react"

interface SEOSettings {
  siteName?: string
  siteDescription?: string
  defaultOgImage?: string
  googleAnalyticsId?: string
  googleTagManagerId?: string
  robotsTxt?: string
  enableBreadcrumbs?: boolean
  enableSchemaMarkup?: boolean
  enableOpenGraph?: boolean
  enableTwitterCards?: boolean
}

interface SEORedirect {
  id?: number
  fromUrl: string
  toUrl: string
  redirectType: number
  isActive: boolean
  hitCount?: number
}

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
    pages: Array<{ url: string; title: string }>
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
}

export default function SEOPage() {
  const [settings, setSettings] = useState<SEOSettings>({})
  const [redirects, setRedirects] = useState<SEORedirect[]>([])
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [toolsLoading, setToolsLoading] = useState<string | null>(null)
  const [newRedirect, setNewRedirect] = useState<Partial<SEORedirect>>({
    redirectType: 301,
    isActive: true,
  })

  useEffect(() => {
    fetchSEOSettings()
    fetchRedirects()
  }, [])

  const fetchSEOSettings = async () => {
    try {
      const response = await fetch("/api/admin/seo/settings")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error("SEO settings fetch error:", error)
      toast.error("SEO ayarları yüklenemedi")
      // Set default values on error
      setSettings({
        siteName: "Arkkontrol",
        siteDescription: "Endüstriyel otomasyon ve robotik kaynak çözümleri",
        enableBreadcrumbs: true,
        enableSchemaMarkup: true,
        enableOpenGraph: true,
        enableTwitterCards: true,
      })
    }
  }

  const fetchRedirects = async () => {
    try {
      const response = await fetch("/api/admin/seo/redirects")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setRedirects(data)
    } catch (error) {
      console.error("Redirects fetch error:", error)
      toast.error("Yönlendirmeler yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  const fetchAnalysis = async () => {
    setAnalysisLoading(true)
    try {
      const response = await fetch("/api/admin/seo/analysis")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setAnalysis(data)
      toast.success("SEO analizi tamamlandı")
    } catch (error) {
      console.error("Analysis fetch error:", error)
      toast.error("SEO analizi yüklenemedi")
    } finally {
      setAnalysisLoading(false)
    }
  }

  const saveSEOSettings = async () => {
    try {
      const response = await fetch("/api/admin/seo/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (!response.ok) throw new Error("Failed to save")

      const data = await response.json()
      setSettings(data)
      toast.success("SEO ayarları kaydedildi")
    } catch (error) {
      console.error("Settings save error:", error)
      toast.error("SEO ayarları kaydedilemedi")
    }
  }

  const createRedirect = async () => {
    if (!newRedirect.fromUrl || !newRedirect.toUrl) {
      toast.error("Kaynak ve hedef URL gerekli")
      return
    }

    try {
      const response = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRedirect),
      })

      if (!response.ok) throw new Error("Failed to create")

      toast.success("Yönlendirme oluşturuldu")
      setNewRedirect({ redirectType: 301, isActive: true })
      fetchRedirects()
    } catch (error) {
      console.error("Redirect create error:", error)
      toast.error("Yönlendirme oluşturulamadı")
    }
  }

  const deleteRedirect = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/seo/redirects/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      toast.success("Yönlendirme silindi")
      fetchRedirects()
    } catch (error) {
      console.error("Redirect delete error:", error)
      toast.error("Yönlendirme silinemedi")
    }
  }

  const executeTool = async (action: string, actionName: string) => {
    setToolsLoading(action)
    try {
      const response = await fetch("/api/admin/seo/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) throw new Error("Failed to execute tool")

      const data = await response.json()
      toast.success(data.message)

      if (action === "reanalyze") {
        setAnalysis(null)
        setTimeout(() => fetchAnalysis(), 1000)
      }
    } catch (error) {
      console.error(`Tool ${action} error:`, error)
      toast.error(`${actionName} başarısız`)
    } finally {
      setToolsLoading(null)
    }
  }

  const getIssueIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-4 w-4 text-green-500" />
      case "down":
        return <ArrowDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>SEO verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">SEO Yönetimi</h1>
        <p className="text-muted-foreground">Site SEO ayarları, yönlendirmeler ve optimizasyon araçları</p>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="redirects">Yönlendirmeler</TabsTrigger>
          <TabsTrigger value="analysis">SEO Analizi</TabsTrigger>
          <TabsTrigger value="tools">Araçlar</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Site Bilgileri</CardTitle>
              <CardDescription>Temel site bilgileri ve meta verileri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName || ""}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    placeholder="Arkkontrol"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription || ""}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    placeholder="Robotik otomasyon çözümleri"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultOgImage">Varsayılan Open Graph Resmi</Label>
                <Input
                  id="defaultOgImage"
                  value={settings.defaultOgImage || ""}
                  onChange={(e) => setSettings({ ...settings, defaultOgImage: e.target.value })}
                  placeholder="https://arkkontrol.com/og-image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analitik Kodları</CardTitle>
              <CardDescription>Google Analytics, Tag Manager ve diğer takip kodları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={settings.googleAnalyticsId || ""}
                    onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="googleTagManagerId">Google Tag Manager ID</Label>
                  <Input
                    id="googleTagManagerId"
                    value={settings.googleTagManagerId || ""}
                    onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })}
                    placeholder="GTM-XXXXXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Özellikleri</CardTitle>
              <CardDescription>SEO optimizasyon özelliklerini etkinleştirin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Breadcrumb Navigation</Label>
                  <p className="text-sm text-muted-foreground">Sayfalarda breadcrumb navigasyonu göster</p>
                </div>
                <Switch
                  checked={settings.enableBreadcrumbs || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableBreadcrumbs: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Schema Markup</Label>
                  <p className="text-sm text-muted-foreground">Yapılandırılmış veri işaretlemesi ekle</p>
                </div>
                <Switch
                  checked={settings.enableSchemaMarkup || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableSchemaMarkup: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Open Graph</Label>
                  <p className="text-sm text-muted-foreground">Sosyal medya paylaşım meta verileri</p>
                </div>
                <Switch
                  checked={settings.enableOpenGraph || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableOpenGraph: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Twitter Cards</Label>
                  <p className="text-sm text-muted-foreground">Twitter paylaşım kartları</p>
                </div>
                <Switch
                  checked={settings.enableTwitterCards || false}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableTwitterCards: checked })}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Robots.txt</CardTitle>
              <CardDescription>Arama motoru botları için yönergeler</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={settings.robotsTxt || ""}
                onChange={(e) => setSettings({ ...settings, robotsTxt: e.target.value })}
                placeholder={`User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://arkkontrol.com/sitemap.xml`}
                rows={8}
              />
            </CardContent>
          </Card>

          <Button onClick={saveSEOSettings} className="w-full">
            SEO Ayarlarını Kaydet
          </Button>
        </TabsContent>

        <TabsContent value="redirects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                URL Yönlendirmeleri
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni Yönlendirme
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Yeni Yönlendirme Oluştur</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromUrl">Kaynak URL</Label>
                        <Input
                          id="fromUrl"
                          value={newRedirect.fromUrl || ""}
                          onChange={(e) => setNewRedirect({ ...newRedirect, fromUrl: e.target.value })}
                          placeholder="/eski-sayfa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toUrl">Hedef URL</Label>
                        <Input
                          id="toUrl"
                          value={newRedirect.toUrl || ""}
                          onChange={(e) => setNewRedirect({ ...newRedirect, toUrl: e.target.value })}
                          placeholder="/yeni-sayfa"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="redirectType">Yönlendirme Tipi</Label>
                        <Select
                          value={newRedirect.redirectType?.toString()}
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
                          id="isActive"
                          checked={newRedirect.isActive || false}
                          onCheckedChange={(checked) => setNewRedirect({ ...newRedirect, isActive: checked })}
                        />
                        <Label htmlFor="isActive">Aktif</Label>
                      </div>
                      <Button onClick={createRedirect} className="w-full">
                        Yönlendirme Oluştur
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kaynak URL</TableHead>
                    <TableHead>Hedef URL</TableHead>
                    <TableHead>Tip</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Hit Sayısı</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {redirects.map((redirect) => (
                    <TableRow key={redirect.id}>
                      <TableCell className="font-mono text-sm">{redirect.fromUrl}</TableCell>
                      <TableCell className="font-mono text-sm">{redirect.toUrl}</TableCell>
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
                      <TableCell>{redirect.hitCount || 0}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => redirect.id && deleteRedirect(redirect.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {!analysis ? (
            <Card>
              <CardHeader>
                <CardTitle>SEO Analizi</CardTitle>
                <CardDescription>Site SEO performansını analiz edin</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={fetchAnalysis} disabled={analysisLoading}>
                  {analysisLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      SEO Analizi Başlat
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">SEO Skoru</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analysis.overview.seoScore}</div>
                    <Progress value={analysis.overview.seoScore} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Toplam Sayfa</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analysis.overview.totalPages}</div>
                    <p className="text-xs text-muted-foreground">
                      {analysis.overview.goodPages} iyi, {analysis.overview.warningPages} uyarı
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Eksik Meta</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analysis.overview.missingMeta}</div>
                    <p className="text-xs text-muted-foreground">Düzeltilmesi gereken</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hata Sayısı</CardTitle>
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{analysis.overview.errorPages}</div>
                    <p className="text-xs text-muted-foreground">Kritik sorunlar</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>SEO Sorunları</CardTitle>
                  <CardDescription>Düzeltilmesi gereken SEO sorunları</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysis.issues.map((issue) => (
                      <div key={issue.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                        {getIssueIcon(issue.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge
                              variant={
                                issue.priority === "high"
                                  ? "destructive"
                                  : issue.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {issue.priority === "high" ? "Yüksek" : issue.priority === "medium" ? "Orta" : "Düşük"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                          <p className="text-xs text-muted-foreground mt-2">Etki: {issue.impact}</p>
                          <div className="mt-2">
                            <p className="text-xs font-medium">Etkilenen sayfalar:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {issue.pages.slice(0, 3).map((page, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {page.url}
                                </Badge>
                              ))}
                              {issue.pages.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{issue.pages.length - 3} daha
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Düzelt
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Öneriler</CardTitle>
                    <CardDescription>SEO skorunuzu artırmak için öneriler</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.recommendations.map((rec) => (
                        <div key={rec.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-sm">{rec.title}</h5>
                            <Badge variant="outline" className="text-xs">
                              {rec.effort}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-green-600 font-medium">{rec.impact}</span>
                            <Badge variant="secondary" className="text-xs">
                              {rec.category}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Anahtar Kelime Performansı</CardTitle>
                    <CardDescription>Takip edilen anahtar kelimelerin durumu</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.keywords.map((keyword, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{keyword.keyword}</p>
                            <p className="text-xs text-muted-foreground">
                              Arama: {keyword.searchVolume.toLocaleString()} | Zorluk: {keyword.difficulty}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">#{keyword.position}</Badge>
                            {getTrendIcon(keyword.trend)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Sitemap Oluştur</CardTitle>
                <CardDescription>XML sitemap dosyasını yeniden oluştur</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => executeTool("generate_sitemap", "Sitemap oluşturma")}
                  disabled={toolsLoading === "generate_sitemap"}
                >
                  {toolsLoading === "generate_sitemap" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Sitemap Oluştur
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cache Temizle</CardTitle>
                <CardDescription>SEO verilerinin cache'ini temizle</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => executeTool("clear_cache", "Cache temizleme")}
                  disabled={toolsLoading === "clear_cache"}
                >
                  {toolsLoading === "clear_cache" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Temizleniyor...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Cache Temizle
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Raporu İndir</CardTitle>
                <CardDescription>Detaylı SEO raporunu PDF olarak indir</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => executeTool("generate_report", "Rapor oluşturma")}
                  disabled={toolsLoading === "generate_report"}
                >
                  {toolsLoading === "generate_report" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Hazırlanıyor...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Rapor İndir
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Yeniden Analiz Et</CardTitle>
                <CardDescription>Tüm sayfaları yeniden analiz et</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => executeTool("reanalyze", "Yeniden analiz")}
                  disabled={toolsLoading === "reanalyze"}
                >
                  {toolsLoading === "reanalyze" ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analiz ediliyor...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Yeniden Analiz Et
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
