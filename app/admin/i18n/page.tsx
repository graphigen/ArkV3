"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
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
import {
  Plus,
  Languages,
  Edit,
  Trash2,
  MoreHorizontal,
  Save,
  RefreshCw,
  AlertTriangle,
  Globe,
  FileText,
} from "lucide-react"
import { toast } from "sonner"

type Language = {
  id: number
  code: string
  name: string
  native_name: string
  flag_emoji?: string
  is_active: boolean
  is_default: boolean
  sort_order: number
}

type TranslationKey = {
  id: number
  key_name: string
  category?: string
  description?: string
  translations: Record<string, string>
}

type I18nSettings = {
  auto_detect_language: boolean
  use_browser_language: boolean
  use_ip_geolocation: boolean
  fallback_language: string
  url_strategy: string
}

export default function LocalizationManagement() {
  const [activeTab, setActiveTab] = useState("translations")
  const [languages, setLanguages] = useState<Language[]>([])
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>([])
  const [missingTranslations, setMissingTranslations] = useState<
    Array<{ key_name: string; missing_languages: string[] }>
  >([])
  const [settings, setSettings] = useState<I18nSettings>({
    auto_detect_language: true,
    use_browser_language: true,
    use_ip_geolocation: false,
    fallback_language: "tr",
    url_strategy: "prefix",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTranslation, setEditingTranslation] = useState<{
    keyName: string
    languageCode: string
    value: string
    category?: string
  } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const [newTranslation, setNewTranslation] = useState({
    keyName: "",
    category: "",
    translations: {} as Record<string, string>,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [languagesRes, translationsRes, missingRes, settingsRes] = await Promise.all([
        fetch("/api/admin/i18n/languages"),
        fetch("/api/admin/i18n/translations"),
        fetch("/api/admin/i18n/missing"),
        fetch("/api/admin/i18n/settings"),
      ])

      if (languagesRes.ok) {
        const languagesData = await languagesRes.json()
        setLanguages(languagesData)
      }

      if (translationsRes.ok) {
        const translationsData = await translationsRes.json()
        setTranslationKeys(translationsData)
      }

      if (missingRes.ok) {
        const missingData = await missingRes.json()
        setMissingTranslations(missingData)
      }

      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        if (settingsData) {
          setSettings(settingsData)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast.error("Veriler yüklenirken hata oluştu")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTranslation = async () => {
    if (!editingTranslation) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/i18n/translations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingTranslation),
      })

      if (response.ok) {
        toast.success("Çeviri başarıyla kaydedildi")
        await fetchData()
        setIsDialogOpen(false)
        setEditingTranslation(null)
      } else {
        toast.error("Çeviri kaydedilemedi")
      }
    } catch (error) {
      console.error("Error saving translation:", error)
      toast.error("Çeviri kaydedilemedi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateTranslation = async () => {
    if (!newTranslation.keyName) return

    setIsSaving(true)
    try {
      const promises = Object.entries(newTranslation.translations).map(([languageCode, value]) =>
        fetch("/api/admin/i18n/translations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            keyName: newTranslation.keyName,
            languageCode,
            value,
            category: newTranslation.category,
          }),
        }),
      )

      const results = await Promise.all(promises)
      const successCount = results.filter((res) => res.ok).length

      if (successCount > 0) {
        toast.success(`${successCount} çeviri başarıyla eklendi`)
        await fetchData()
        setNewTranslation({ keyName: "", category: "", translations: {} })
      } else {
        toast.error("Çeviriler eklenemedi")
      }
    } catch (error) {
      console.error("Error creating translations:", error)
      toast.error("Çeviriler eklenemedi")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTranslation = async (keyName: string, languageCode?: string) => {
    if (!confirm("Bu çeviriyi silmek istediğinizden emin misiniz?")) return

    try {
      let url = `/api/admin/i18n/translations?key=${encodeURIComponent(keyName)}`
      if (languageCode) {
        url += `&language=${languageCode}`
      }

      const response = await fetch(url, { method: "DELETE" })

      if (response.ok) {
        toast.success("Çeviri başarıyla silindi")
        await fetchData()
      } else {
        toast.error("Çeviri silinemedi")
      }
    } catch (error) {
      console.error("Error deleting translation:", error)
      toast.error("Çeviri silinemedi")
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/i18n/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (response.ok) {
        toast.success("Ayarlar başarıyla kaydedildi")
      } else {
        toast.error("Ayarlar kaydedilemedi")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("Ayarlar kaydedilemedi")
    } finally {
      setIsSaving(false)
    }
  }

  const filteredTranslations = translationKeys.filter((key) => {
    const matchesSearch = key.key_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || key.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(translationKeys.map((key) => key.category).filter(Boolean)))

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yerelleştirme</h1>
            <p className="text-muted-foreground">Çoklu dil desteği ve çevirileri yönetin</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Yerelleştirme</h1>
          <p className="text-muted-foreground">Çoklu dil desteği ve çevirileri yönetin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Yenile
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Çeviri
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Yeni Çeviri Ekle</DialogTitle>
                <DialogDescription>Tüm diller için yeni çeviri anahtarı oluşturun</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="key-name">Çeviri Anahtarı</Label>
                    <Input
                      id="key-name"
                      placeholder="örn: nav.home"
                      value={newTranslation.keyName}
                      onChange={(e) => setNewTranslation({ ...newTranslation, keyName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Input
                      id="category"
                      placeholder="örn: navigation"
                      value={newTranslation.category}
                      onChange={(e) => setNewTranslation({ ...newTranslation, category: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Çeviriler</Label>
                  {languages.map((lang) => (
                    <div key={lang.code} className="flex items-center space-x-2">
                      <span className="text-2xl">{lang.flag_emoji}</span>
                      <Label className="w-20">{lang.native_name}</Label>
                      <Input
                        placeholder={`${lang.name} çevirisi`}
                        value={newTranslation.translations[lang.code] || ""}
                        onChange={(e) =>
                          setNewTranslation({
                            ...newTranslation,
                            translations: { ...newTranslation.translations, [lang.code]: e.target.value },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setNewTranslation({ keyName: "", category: "", translations: {} })}
                >
                  İptal
                </Button>
                <Button onClick={handleCreateTranslation} disabled={!newTranslation.keyName || isSaving}>
                  {isSaving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Diller</CardTitle>
            <Languages className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languages.filter((l) => l.is_active).length}</div>
            <p className="text-xs text-muted-foreground">Toplam {languages.length} dil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Çeviri Anahtarları</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{translationKeys.length}</div>
            <p className="text-xs text-muted-foreground">{categories.length} kategori</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eksik Çeviriler</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{missingTranslations.length}</div>
            <p className="text-xs text-muted-foreground">Tamamlanması gereken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Varsayılan Dil</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{languages.find((l) => l.is_default)?.code.toUpperCase()}</div>
            <p className="text-xs text-muted-foreground">{languages.find((l) => l.is_default)?.native_name}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="translations">Çeviriler</TabsTrigger>
          <TabsTrigger value="missing">
            Eksik Çeviriler
            {missingTranslations.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {missingTranslations.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="translations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Çeviri Yönetimi</CardTitle>
                  <CardDescription>Tüm çeviri anahtarlarını ve değerlerini yönetin</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Kategoriler</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Çeviri ara..."
                    className="w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anahtar</TableHead>
                    <TableHead>Kategori</TableHead>
                    {languages.map((lang) => (
                      <TableHead key={lang.code} className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <span>{lang.flag_emoji}</span>
                          <span>{lang.code.toUpperCase()}</span>
                        </div>
                      </TableHead>
                    ))}
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTranslations.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.key_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{key.category || "genel"}</Badge>
                      </TableCell>
                      {languages.map((lang) => (
                        <TableCell key={lang.code} className="text-center">
                          {key.translations[lang.code] ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-1 text-xs max-w-[100px] truncate"
                              onClick={() => {
                                setEditingTranslation({
                                  keyName: key.key_name,
                                  languageCode: lang.code,
                                  value: key.translations[lang.code],
                                  category: key.category,
                                })
                                setIsDialogOpen(true)
                              }}
                            >
                              {key.translations[lang.code]}
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 px-2 text-xs text-orange-600"
                              onClick={() => {
                                setEditingTranslation({
                                  keyName: key.key_name,
                                  languageCode: lang.code,
                                  value: "",
                                  category: key.category,
                                })
                                setIsDialogOpen(true)
                              }}
                            >
                              Ekle
                            </Button>
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteTranslation(key.key_name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Tümünü Sil
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

        <TabsContent value="missing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eksik Çeviriler</CardTitle>
              <CardDescription>Tamamlanması gereken çevirileri görüntüleyin ve düzenleyin</CardDescription>
            </CardHeader>
            <CardContent>
              {missingTranslations.length === 0 ? (
                <div className="text-center py-8">
                  <Languages className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Tüm çeviriler tamamlanmış! 🎉</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Çeviri Anahtarı</TableHead>
                      <TableHead>Eksik Diller</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {missingTranslations.map((item) => (
                      <TableRow key={item.key_name}>
                        <TableCell className="font-medium">{item.key_name}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {item.missing_languages.map((langCode) => {
                              const lang = languages.find((l) => l.code === langCode)
                              return (
                                <Badge key={langCode} variant="destructive" className="text-xs">
                                  {lang?.flag_emoji} {langCode.toUpperCase()}
                                </Badge>
                              )
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => {
                              const firstMissingLang = item.missing_languages[0]
                              setEditingTranslation({
                                keyName: item.key_name,
                                languageCode: firstMissingLang,
                                value: "",
                              })
                              setIsDialogOpen(true)
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Düzenle
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Dil Ayarları</CardTitle>
              <CardDescription>Çoklu dil desteği ve otomatik algılama ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Otomatik Dil Algılama</Label>
                    <p className="text-sm text-muted-foreground">Kullanıcı dilini otomatik olarak algıla</p>
                  </div>
                  <Switch
                    checked={settings.auto_detect_language}
                    onCheckedChange={(checked) => setSettings({ ...settings, auto_detect_language: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tarayıcı Dili Kullan</Label>
                    <p className="text-sm text-muted-foreground">Tarayıcı dil ayarlarını dikkate al</p>
                  </div>
                  <Switch
                    checked={settings.use_browser_language}
                    onCheckedChange={(checked) => setSettings({ ...settings, use_browser_language: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>IP Coğrafi Konum</Label>
                    <p className="text-sm text-muted-foreground">IP adresine göre ülke tespiti yap</p>
                  </div>
                  <Switch
                    checked={settings.use_ip_geolocation}
                    onCheckedChange={(checked) => setSettings({ ...settings, use_ip_geolocation: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Varsayılan Dil</Label>
                  <Select
                    value={settings.fallback_language}
                    onValueChange={(value) => setSettings({ ...settings, fallback_language: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.flag_emoji} {lang.native_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>URL Stratejisi</Label>
                  <Select
                    value={settings.url_strategy}
                    onValueChange={(value) => setSettings({ ...settings, url_strategy: value })}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prefix">Prefix (/tr/sayfa)</SelectItem>
                      <SelectItem value="domain">Domain (tr.site.com)</SelectItem>
                      <SelectItem value="subdomain">Subdomain (tr.site.com)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Kaydediliyor...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Ayarları Kaydet
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Translation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Çeviri Düzenle</DialogTitle>
            <DialogDescription>
              {editingTranslation?.keyName} anahtarı için {editingTranslation?.languageCode.toUpperCase()} çevirisini
              düzenleyin
            </DialogDescription>
          </DialogHeader>
          {editingTranslation && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Çeviri Anahtarı</Label>
                <Input value={editingTranslation.keyName} disabled />
              </div>
              <div className="space-y-2">
                <Label>Dil</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {languages.find((l) => l.code === editingTranslation.languageCode)?.flag_emoji}
                  </span>
                  <span>{languages.find((l) => l.code === editingTranslation.languageCode)?.native_name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Çeviri</Label>
                <Textarea
                  placeholder="Çeviri metnini girin..."
                  value={editingTranslation.value}
                  onChange={(e) => setEditingTranslation({ ...editingTranslation, value: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                setEditingTranslation(null)
              }}
            >
              İptal
            </Button>
            <Button onClick={handleSaveTranslation} disabled={isSaving}>
              {isSaving ? "Kaydediliyor..." : "Kaydet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
