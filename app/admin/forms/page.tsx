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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Edit, Trash2, Eye, Calendar, FileText, Send, Users } from "lucide-react"
import type { FormData } from "@/types/admin"
import { ErrorMessage } from "@/components/error-message"
import { LoadingSpinner } from "@/components/loading-spinner"
import { toast } from "sonner"

export default function FormsManagement() {
  const [forms, setForms] = useState<FormData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [newForm, setNewForm] = useState({
    name: "",
    title: "",
    description: "",
    slug: "",
    submit_message: "Mesajınız başarıyla gönderildi!",
    redirect_url: "",
    email_notifications: true,
    notification_emails: [""],
    store_submissions: true,
  })

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/forms")

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setForms(data)
    } catch (error) {
      console.error("Forms fetch error:", error)
      setError("Formlar yüklenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateForm = async () => {
    try {
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newForm,
          notification_emails: newForm.notification_emails.filter((email) => email.trim()),
        }),
      })

      if (response.ok) {
        setIsCreateFormOpen(false)
        setNewForm({
          name: "",
          title: "",
          description: "",
          slug: "",
          submit_message: "Mesajınız başarıyla gönderildi!",
          redirect_url: "",
          email_notifications: true,
          notification_emails: [""],
          store_submissions: true,
        })
        fetchForms()
        toast.success("Form başarıyla oluşturuldu")
      } else {
        toast.error("Form oluşturulamadı")
      }
    } catch (error) {
      console.error("Form creation error:", error)
      toast.error("Form oluşturulamadı")
    }
  }

  const handleDeleteForm = async (id: number) => {
    if (!confirm("Bu formu silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/forms/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setForms(forms.filter((form) => form.id !== id))
        toast.success("Form başarıyla silindi")
      } else {
        toast.error("Form silinirken hata oluştu")
      }
    } catch (error) {
      console.error("Form deletion error:", error)
      toast.error("Form silinirken hata oluştu")
    }
  }

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Formlar yükleniyor..." />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchForms} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Form Yönetimi</h1>
        <Dialog open={isCreateFormOpen} onOpenChange={setIsCreateFormOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Form
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Yeni Form Oluştur</DialogTitle>
              <DialogDescription>Yeni bir form oluşturun ve alanlarını düzenleyin</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="form-name">Form Adı</Label>
                  <Input
                    id="form-name"
                    value={newForm.name}
                    onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    placeholder="İletişim Formu"
                  />
                </div>
                <div>
                  <Label htmlFor="form-slug">Slug</Label>
                  <Input
                    id="form-slug"
                    value={newForm.slug}
                    onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
                    placeholder="iletisim-formu"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="form-title">Form Başlığı</Label>
                <Input
                  id="form-title"
                  value={newForm.title}
                  onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                  placeholder="Bizimle İletişime Geçin"
                />
              </div>

              <div>
                <Label htmlFor="form-description">Açıklama</Label>
                <Textarea
                  id="form-description"
                  value={newForm.description}
                  onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                  placeholder="Form açıklaması"
                />
              </div>

              <div>
                <Label htmlFor="submit-message">Başarı Mesajı</Label>
                <Input
                  id="submit-message"
                  value={newForm.submit_message}
                  onChange={(e) => setNewForm({ ...newForm, submit_message: e.target.value })}
                  placeholder="Mesajınız başarıyla gönderildi!"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="email-notifications"
                  checked={newForm.email_notifications}
                  onCheckedChange={(checked) => setNewForm({ ...newForm, email_notifications: checked })}
                />
                <Label htmlFor="email-notifications">E-posta bildirimleri gönder</Label>
              </div>

              {newForm.email_notifications && (
                <div>
                  <Label>Bildirim E-postaları</Label>
                  {newForm.notification_emails.map((email, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...newForm.notification_emails]
                          newEmails[index] = e.target.value
                          setNewForm({ ...newForm, notification_emails: newEmails })
                        }}
                        placeholder="email@example.com"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const newEmails = [...newForm.notification_emails, ""]
                          setNewForm({ ...newForm, notification_emails: newEmails })
                        }}
                      >
                        +
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <Button onClick={handleCreateForm} className="w-full">
                Form Oluştur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Form</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Formlar</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{forms.filter((f) => f.status === "active").length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bu Ay Gönderim</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Gönderim</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Formları Ara</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Form ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardHeader>
          <CardTitle>Formlar</CardTitle>
          <CardDescription>Tüm formlarınızı buradan yönetebilirsiniz</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Form Adı</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Alan Sayısı</TableHead>
                <TableHead>Oluşturma Tarihi</TableHead>
                <TableHead>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{form.name}</div>
                      <div className="text-sm text-muted-foreground">{form.title}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">/{form.slug}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant={form.status === "active" ? "default" : "secondary"}>
                      {form.status === "active" ? "Aktif" : "Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1 text-muted-foreground" />
                      {form.fields?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(form.created_at).toLocaleDateString("tr-TR")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteForm(form.id)}>
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
    </div>
  )
}
