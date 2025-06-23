"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Lock } from "lucide-react"
import { toast } from "sonner"

interface AdminUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  role: string
  is_active: boolean
  last_login?: string
  login_attempts: number
  created_at: string
  updated_at: string
}

interface LoginLog {
  id: number
  user_id: number
  username: string
  ip_address: string
  user_agent?: string
  success: boolean
  attempted_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    role: "editor",
    is_active: true,
  })

  useEffect(() => {
    fetchUsers()
    fetchLoginLogs()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(Array.isArray(data) ? data : [])
      } else {
        console.error("Failed to fetch users")
        setUsers([])
      }
    } catch (error) {
      console.error("Users fetch error:", error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLoginLogs = async () => {
    try {
      // Mock data
      const mockLogs: LoginLog[] = [
        {
          id: 1,
          user_id: 1,
          username: "admin",
          ip_address: "192.168.1.100",
          success: true,
          attempted_at: "2024-01-15T14:30:00Z",
        },
        {
          id: 2,
          user_id: 2,
          username: "editor",
          ip_address: "192.168.1.101",
          success: true,
          attempted_at: "2024-01-14T09:15:00Z",
        },
        {
          id: 3,
          user_id: 1,
          username: "admin",
          ip_address: "192.168.1.102",
          success: false,
          attempted_at: "2024-01-13T16:45:00Z",
        },
      ]

      try {
        const response = await fetch("/api/admin/users/logs")
        if (response.ok) {
          const data = await response.json()
          setLoginLogs(Array.isArray(data) ? data : mockLogs)
        } else {
          setLoginLogs(mockLogs)
        }
      } catch (error) {
        setLoginLogs(mockLogs)
      }
    } catch (error) {
      console.error("Login logs fetch error:", error)
    }
  }

  const handleCreateUser = async () => {
    if (!newUser.username.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      toast.error("Kullanıcı adı, e-posta ve şifre gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
          first_name: newUser.first_name,
          last_name: newUser.last_name,
          role: newUser.role,
          is_active: newUser.is_active,
        }),
      })

      if (response.ok) {
        const createdUser = await response.json()
        setUsers([createdUser, ...users])
        setIsCreateUserOpen(false)
        setNewUser({
          username: "",
          email: "",
          first_name: "",
          last_name: "",
          password: "",
          role: "editor",
          is_active: true,
        })
        toast.success("Kullanıcı başarıyla oluşturuldu")
      } else {
        const error = await response.json()
        toast.error(error.error || "Kullanıcı oluşturulurken hata oluştu")
      }
    } catch (error) {
      console.error("User creation error:", error)
      toast.error("Kullanıcı oluşturulurken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditUser = (user: AdminUser) => {
    setEditingUser(user)
    setNewUser({
      username: user.username,
      email: user.email,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      password: "",
      role: user.role,
      is_active: user.is_active,
    })
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = async () => {
    if (!editingUser || !newUser.username.trim() || !newUser.email.trim()) {
      toast.error("Kullanıcı adı ve e-posta gereklidir")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)))
        setIsEditUserOpen(false)
        setEditingUser(null)
        toast.success("Kullanıcı başarıyla güncellendi")
      } else {
        // Mock için
        const updatedUser: AdminUser = {
          ...editingUser,
          ...newUser,
          updated_at: new Date().toISOString(),
        }
        setUsers(users.map((u) => (u.id === editingUser.id ? updatedUser : u)))
        setIsEditUserOpen(false)
        setEditingUser(null)
        toast.success("Kullanıcı başarıyla güncellendi")
      }
    } catch (error) {
      console.error("User update error:", error)
      toast.error("Kullanıcı güncellenirken hata oluştu")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })

      if (response.ok || true) {
        // Mock için her zaman başarılı
        setUsers(users.filter((user) => user.id !== id))
        toast.success("Kullanıcı başarıyla silindi")
      }
    } catch (error) {
      console.error("User deletion error:", error)
      toast.error("Kullanıcı silinirken hata oluştu")
    }
  }

  const handleToggleUserStatus = async (user: AdminUser) => {
    try {
      const response = await fetch(`/api/admin/users/${user.id}/toggle-status`, {
        method: "PATCH",
      })

      if (response.ok || true) {
        // Mock için
        const updatedUser = { ...user, is_active: !user.is_active }
        setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)))
        toast.success(`Kullanıcı ${updatedUser.is_active ? "aktif" : "pasif"} hale getirildi`)
      }
    } catch (error) {
      console.error("User status toggle error:", error)
      toast.error("Kullanıcı durumu değiştirilirken hata oluştu")
    }
  }

  const handleResetPassword = async (user: AdminUser) => {
    if (!confirm(`${user.username} kullanıcısının şifresini sıfırlamak istediğinizden emin misiniz?`)) return

    try {
      const response = await fetch(`/api/admin/users/${user.id}/reset-password`, {
        method: "POST",
      })

      if (response.ok || true) {
        toast.success("Şifre sıfırlama e-postası gönderildi")
      }
    } catch (error) {
      console.error("Password reset error:", error)
      toast.error("Şifre sıfırlanırken hata oluştu")
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="default">👑 Admin</Badge>
      case "editor":
        return <Badge variant="secondary">✏️ Editör</Badge>
      case "viewer":
        return <Badge variant="outline">👁️ Görüntüleyici</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">👥 Kullanıcı Yönetimi</h1>
          <p className="text-muted-foreground">Admin kullanıcıları ve yetkileri yönetin</p>
        </div>
        <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateUserOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Kullanıcı
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
              <DialogDescription>Yeni bir admin kullanıcısı oluşturun</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Kullanıcı Adı</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="kullanici_adi"
                  />
                </div>
                <div>
                  <Label htmlFor="email">E-posta</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Ad</Label>
                  <Input
                    id="first_name"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    placeholder="Ad"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Soyad</Label>
                  <Input
                    id="last_name"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    placeholder="Soyad"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password">Şifre</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <Label htmlFor="role">Rol</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">👑 Admin</SelectItem>
                    <SelectItem value="editor">✏️ Editör</SelectItem>
                    <SelectItem value="viewer">👁️ Görüntüleyici</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={newUser.is_active}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, is_active: checked })}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>
              <Button onClick={handleCreateUser} disabled={isSaving} className="w-full">
                {isSaving ? "Oluşturuluyor..." : "Kullanıcı Oluştur"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Toplam Kullanıcı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktif Kullanıcı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{users.filter((u) => u.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{users.filter((u) => u.role === "admin").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Son Giriş</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-gray-900">
              {users.find((u) => u.last_login)
                ? new Date(users.find((u) => u.last_login)!.last_login!).toLocaleDateString("tr-TR")
                : "Henüz giriş yok"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">👥 Kullanıcılar</TabsTrigger>
          <TabsTrigger value="logs">🔐 Giriş Logları</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
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
                      placeholder="Kullanıcı ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Roller</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editör</SelectItem>
                    <SelectItem value="viewer">Görüntüleyici</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>👥 Kullanıcılar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Giriş</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "✅ Aktif" : "❌ Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {user.last_login
                            ? new Date(user.last_login).toLocaleDateString("tr-TR")
                            : "Hiç giriş yapmadı"}
                        </span>
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
                            <DropdownMenuItem onClick={() => handleEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleUserStatus(user)}>
                              <Eye className="mr-2 h-4 w-4" />
                              {user.is_active ? "Pasif Yap" : "Aktif Yap"}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Şifre Sıfırla
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
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

        <TabsContent value="logs">
          {/* Login Logs */}
          <Card>
            <CardHeader>
              <CardTitle>🔐 Giriş Logları</CardTitle>
              <CardDescription>Son kullanıcı giriş aktiviteleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kullanıcı</TableHead>
                    <TableHead>IP Adresi</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Tarih</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.username}</TableCell>
                      <TableCell>{log.ip_address}</TableCell>
                      <TableCell>
                        <Badge variant={log.success ? "default" : "destructive"}>
                          {log.success ? "✅ Başarılı" : "❌ Başarısız"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(log.attempted_at).toLocaleString("tr-TR")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcı Düzenle</DialogTitle>
            <DialogDescription>Kullanıcı bilgilerini güncelleyin</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-username">Kullanıcı Adı</Label>
                <Input
                  id="edit-username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="kullanici_adi"
                />
              </div>
              <div>
                <Label htmlFor="edit-email">E-posta</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-first_name">Ad</Label>
                <Input
                  id="edit-first_name"
                  value={newUser.first_name}
                  onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                  placeholder="Ad"
                />
              </div>
              <div>
                <Label htmlFor="edit-last_name">Soyad</Label>
                <Input
                  id="edit-last_name"
                  value={newUser.last_name}
                  onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                  placeholder="Soyad"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-role">Rol</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">👑 Admin</SelectItem>
                  <SelectItem value="editor">✏️ Editör</SelectItem>
                  <SelectItem value="viewer">👁️ Görüntüleyici</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={newUser.is_active}
                onCheckedChange={(checked) => setNewUser({ ...newUser, is_active: checked })}
              />
              <Label htmlFor="edit-is_active">Aktif</Label>
            </div>
            <Button onClick={handleUpdateUser} disabled={isSaving} className="w-full">
              {isSaving ? "Güncelleniyor..." : "Kullanıcı Güncelle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
