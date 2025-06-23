"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import type { Page } from "@/lib/admin-data"

export default function EditPage() {
  const router = useRouter()
  const params = useParams()
  const [page, setPage] = useState<Page | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/admin/pages/${params.id}`)
        if (response.ok) {
          const pageData = await response.json()
          setPage(pageData)
        }
      } catch (error) {
        console.error("Sayfa yüklenemedi:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchPage()
    }
  }, [params.id])

  const handleSave = async () => {
    if (!page) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/pages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(page),
      })

      if (response.ok) {
        setMessage("Sayfa başarıyla güncellendi!")
        setTimeout(() => setMessage(""), 3000)
      } else {
        setMessage("Güncelleme sırasında hata oluştu.")
      }
    } catch (error) {
      setMessage("Güncelleme sırasında hata oluştu.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Yükleniyor...</div>
  }

  if (!page) {
    return <div className="flex items-center justify-center h-64">Sayfa bulunamadı</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Sayfa Düzenle</h1>
            <p className="text-muted-foreground">{page.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Önizle
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </div>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sayfa İçeriği</CardTitle>
              <CardDescription>Sayfa başlığı ve içeriğini düzenleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Sayfa Başlığı</Label>
                <Input id="title" value={page.title} onChange={(e) => setPage({ ...page, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" value={page.slug} onChange={(e) => setPage({ ...page, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">İçerik</Label>
                <Textarea
                  id="content"
                  value={page.content}
                  onChange={(e) => setPage({ ...page, content: e.target.value })}
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
              <CardDescription>Arama motoru optimizasyonu ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Başlık</Label>
                <Input
                  id="seoTitle"
                  value={page.seoTitle || ""}
                  onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Açıklama</Label>
                <Textarea
                  id="seoDescription"
                  value={page.seoDescription || ""}
                  onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sayfa Ayarları</CardTitle>
              <CardDescription>Durum ve dil ayarları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Durum</Label>
                <Select
                  value={page.status}
                  onValueChange={(value: "published" | "draft") => setPage({ ...page, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Yayında</SelectItem>
                    <SelectItem value="draft">Taslak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Dil</Label>
                <Select value={page.language} onValueChange={(value) => setPage({ ...page, language: value })}>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
