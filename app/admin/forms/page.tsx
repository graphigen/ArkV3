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
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Send,
  Users,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { toast } from "sonner"

interface FormData {
  id: number
  name: string
  title: string
  description?: string
  slug: string
  submit_message: string
  redirect_url?: string
  email_notifications: boolean
  notification_emails: string[]
  store_submissions: boolean
  status: string
  fields?: any[]
  submission_count?: number
  created_at: string
  updated_at: string
}

interface FormSubmission {
  id: number
  form_id: number
  form_name: string
  form_title: string
  data: Record<string, any>
  ip_address?: string
  user_agent?: string
  referrer?: string
  status: "new" | "read" | "replied" | "spam"
  created_at: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export default function FormsManagement() {
  const [forms, setForms] = useState<FormData[]>([])
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false)
  const [isEditFormOpen, setIsEditFormOpen] = useState(false)
  const [isViewSubmissionOpen, setIsViewSubmissionOpen] = useState(false)
  const [editingForm, setEditingForm] = useState<FormData | null>(null)
  const [viewingSubmission, setViewingSubmission] = useState<FormSubmission | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("forms")

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
    if (activeTab === "submissions") {
      fetchSubmissions()
    }
  }, [activeTab, pagination.page])

  const fetchForms = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/forms")
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setForms(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Forms fetch error:", error)
      toast.error("Formlar yüklenirken bir hata oluştu.")
      setForms([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/forms/submissions?page=${pagination.page}&limit=${pagination.limit}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      setSubmissions(data.submissions || [])
      setPagination(data.pagination || pagination)
    } catch (error) {
      console.error("Submissions fetch error:", error)
      toast.error("Form gönderimleri yüklenirken bir hata oluştu.")
      setSubmissions([])
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleCreateForm = async () => {
    if (!newForm.name.trim()) {
      toast.error("Form adı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newForm,
          slug: newForm.slug || generateSlug(newForm.name),
          notification_emails: newForm.notification_emails.filter((email) => email.trim()),
        }),
      })

      if (response.ok) {
        const createdForm = await response.json()
        setForms([createdForm, ...forms])
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
        toast.success("Form başarıyla oluşturuldu")
      } else {
        toast.error("Form oluşturulamadı")
      }
    } catch (error) {
      console.error("Form creation error:", error)
      toast.error("Form oluşturulamadı")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditForm = (form: FormData) => {
    setEditingForm(form)
    setNewForm({
      name: form.name,
      title: form.title,
      description: form.description || "",
      slug: form.slug,
      submit_message: form.submit_message,
      redirect_url: form.redirect_url || "",
      email_notifications: form.email_notifications,
      notification_emails: form.notification_emails.length > 0 ? form.notification_emails : [""],
      store_submissions: form.store_submissions,
    })
    setIsEditFormOpen(true)
  }

  const handleUpdateForm = async () => {
    if (!editingForm || !newForm.name.trim()) {
      toast.error("Form adı gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/forms/${editingForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newForm,
          notification_emails: newForm.notification_emails.filter((email) => email.trim()),
        }),
      })

      if (response.ok) {
        const updatedForm = await response.json()
        setForms(forms.map((f) => (f.id === editingForm.id ? updatedForm : f)))
        setIsEditFormOpen(false)
        setEditingForm(null)
        toast.success("Form başarıyla güncellendi")
      } else {
        toast.error("Form güncellenemedi")
      }
    } catch (error) {
      console.error("Form update error:", error)
      toast.error("Form güncellenirken hata oluştu")
    } finally {
      setIsSaving(false)
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

  const handleViewSubmission = async (submission: FormSubmission) => {
    setViewingSubmission(submission)
    setIsViewSubmissionOpen(true)

    // Mark as read if it's new
    if (submission.status === "new") {
      try {
        await fetch(`/api/admin/forms/submissions/${submission.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "read" }),
        })
        // Update local state
        setSubmissions(submissions.map((s) => (s.id === submission.id ? { ...s, status: "read" } : s)))
      } catch (error) {
        console.error("Error updating submission status:", error)
      }
    }
  }

  const handleDeleteSubmission = async (id: number) => {
    if (!confirm("Bu form gönderimini silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/forms/submissions/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSubmissions(submissions.filter((submission) => submission.id !== id))
        toast.success("Form gönderimi silindi")
      } else {
        toast.error("Form gönderimi silinirken hata oluştu")
      }
    } catch (error) {
      console.error("Submission deletion error:", error)
      toast.error("Form gönderimi silinirken hata oluştu")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      new: "destructive",
      read: "secondary",
      replied: "default",
      spam: "outline",
    } as const

    const labels = {
      new: "Yeni",
      read: "Okundu",
      replied: "Yanıtlandı",
      spam: "Spam",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const filteredForms = forms.filter(
    (form) =>
      form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
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
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                    onChange={(e) => {
                      const name = e.target.value
                      setNewForm({
                        ...newForm,
                        name,
                        slug: newForm.slug || generateSlug(name),
                      })
                    }}
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

              <Button onClick={handleCreateForm} disabled={isSaving} className="w-full">
                {isSaving ? "Oluşturuluyor..." : "Form Oluştur"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("forms")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "forms"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Formlar
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "submissions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Form Gönderimleri
          </button>
        </nav>
      </div>

      {activeTab === "forms" && (
        <>
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
                <div className="text-2xl font-bold">{submissions.length}</div>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Menüyü aç</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditForm(form)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.open(`/forms/${form.slug}`, "_blank")}>
                              <Eye className="mr-2 h-4 w-4" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteForm(form.id)}>
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
        </>
      )}

      {activeTab === "submissions" && (
        <>
          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Form Gönderimleri</CardTitle>
              <CardDescription>Tüm form gönderimlerini buradan görüntüleyebilirsiniz</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Form</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Gönderim Tarihi</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.form_name}</div>
                          <div className="text-sm text-muted-foreground">{submission.form_title}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell>
                        <code className="text-sm">{submission.ip_address || "N/A"}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(submission.created_at).toLocaleDateString("tr-TR")}
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
                            <DropdownMenuItem onClick={() => handleViewSubmission(submission)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteSubmission(submission.id)}
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Toplam {pagination.total} kayıt, sayfa {pagination.page} / {pagination.totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Önceki
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                    >
                      Sonraki
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Edit Form Dialog */}
      <Dialog open={isEditFormOpen} onOpenChange={setIsEditFormOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Düzenle</DialogTitle>
            <DialogDescription>Form bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-form-name">Form Adı</Label>
                <Input
                  id="edit-form-name"
                  value={newForm.name}
                  onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                  placeholder="İletişim Formu"
                />
              </div>
              <div>
                <Label htmlFor="edit-form-slug">Slug</Label>
                <Input
                  id="edit-form-slug"
                  value={newForm.slug}
                  onChange={(e) => setNewForm({ ...newForm, slug: e.target.value })}
                  placeholder="iletisim-formu"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="edit-form-title">Form Başlığı</Label>
              <Input
                id="edit-form-title"
                value={newForm.title}
                onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                placeholder="Bizimle İletişime Geçin"
              />
            </div>

            <div>
              <Label htmlFor="edit-form-description">Açıklama</Label>
              <Textarea
                id="edit-form-description"
                value={newForm.description}
                onChange={(e) => setNewForm({ ...newForm, description: e.target.value })}
                placeholder="Form açıklaması"
              />
            </div>

            <Button onClick={handleUpdateForm} disabled={isSaving} className="w-full">
              {isSaving ? "Güncelleniyor..." : "Form Güncelle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Submission Dialog */}
      <Dialog open={isViewSubmissionOpen} onOpenChange={setIsViewSubmissionOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Gönderimi Detayları</DialogTitle>
            <DialogDescription>{viewingSubmission?.form_name} formundan gelen gönderim</DialogDescription>
          </DialogHeader>
          {viewingSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Form</Label>
                  <p className="text-sm font-medium">{viewingSubmission.form_name}</p>
                </div>
                <div>
                  <Label>Durum</Label>
                  <div className="mt-1">{getStatusBadge(viewingSubmission.status)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>IP Adresi</Label>
                  <p className="text-sm">{viewingSubmission.ip_address || "N/A"}</p>
                </div>
                <div>
                  <Label>Gönderim Tarihi</Label>
                  <p className="text-sm">{new Date(viewingSubmission.created_at).toLocaleString("tr-TR")}</p>
                </div>
              </div>

              <div>
                <Label>Form Verileri</Label>
                <div className="mt-2 space-y-2">
                  {Object.entries(viewingSubmission.data).map(([key, value]) => (
                    <div key={key} className="border rounded p-3">
                      <Label className="text-sm font-medium">{key}</Label>
                      <p className="text-sm mt-1">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {viewingSubmission.user_agent && (
                <div>
                  <Label>Tarayıcı Bilgisi</Label>
                  <p className="text-xs text-muted-foreground mt-1">{viewingSubmission.user_agent}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
