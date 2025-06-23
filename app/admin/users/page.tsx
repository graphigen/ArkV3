"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      username: "admin",
      email: "admin@arkkontrol.com",
      role: "admin",
      is_active: true,
      last_login: "2024-01-15 14:30",
      login_attempts: 0,
    },
    {
      id: 2,
      username: "editor",
      email: "editor@arkkontrol.com",
      role: "editor",
      is_active: true,
      last_login: "2024-01-14 09:15",
      login_attempts: 0,
    },
  ])

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "editor",
    is_active: true,
  })

  const [loginLogs, setLoginLogs] = useState([
    { id: 1, username: "admin", ip: "192.168.1.100", success: true, time: "2024-01-15 14:30" },
    { id: 2, username: "editor", ip: "192.168.1.101", success: true, time: "2024-01-14 09:15" },
    { id: 3, username: "admin", ip: "192.168.1.102", success: false, time: "2024-01-13 16:45" },
  ])

  const handleCreateUser = () => {
    const user = {
      id: users.length + 1,
      ...newUser,
      last_login: null,
      login_attempts: 0,
    }
    setUsers([...users, user])
    setNewUser({ username: "", email: "", password: "", role: "editor", is_active: true })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Kullanıcı Yönetimi</h1>
          <p className="text-gray-600">Admin kullanıcıları ve yetkileri yönetin</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">➕ Yeni Kullanıcı</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Kullanıcı Adı</Label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="kullanici_adi"
                />
              </div>
              <div className="space-y-2">
                <Label>E-posta</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Şifre</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
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
                  checked={newUser.is_active}
                  onCheckedChange={(checked) => setNewUser({ ...newUser, is_active: checked })}
                />
                <Label>Aktif</Label>
              </div>
              <Button onClick={handleCreateUser} className="w-full">
                Kullanıcı Oluştur
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
            <div className="text-sm font-medium text-gray-900">Bugün 14:30</div>
          </CardContent>
        </Card>
      </div>

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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "editor" ? "secondary" : "outline"}
                    >
                      {user.role === "admin" ? "👑 Admin" : user.role === "editor" ? "✏️ Editör" : "👁️ Görüntüleyici"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? "✅ Aktif" : "❌ Pasif"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">{user.last_login || "Hiç giriş yapmadı"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        ✏️
                      </Button>
                      <Button variant="outline" size="sm">
                        🗑️
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
                  <TableCell>{log.ip}</TableCell>
                  <TableCell>
                    <Badge variant={log.success ? "default" : "destructive"}>
                      {log.success ? "✅ Başarılı" : "❌ Başarısız"}
                    </Badge>
                  </TableCell>
                  <TableCell>{log.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
