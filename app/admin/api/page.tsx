"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function APIPage() {
  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: "Frontend API",
      key: "ak_live_1234567890abcdef",
      permissions: ["read"],
      is_active: true,
      last_used: "2024-01-15 14:30",
    },
    {
      id: 2,
      name: "Mobile App",
      key: "ak_live_abcdef1234567890",
      permissions: ["read", "write"],
      is_active: true,
      last_used: "2024-01-14 09:15",
    },
  ])

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      name: "Form Submission",
      url: "https://webhook.site/unique-id",
      events: ["form.submitted"],
      is_active: true,
      last_triggered: "2024-01-15 12:30",
    },
  ])

  const [newApiKey, setNewApiKey] = useState({
    name: "",
    permissions: [],
  })

  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [],
  })

  const generateApiKey = () => {
    return "ak_live_" + Math.random().toString(36).substring(2, 18)
  }

  const handleCreateApiKey = () => {
    const apiKey = {
      id: apiKeys.length + 1,
      ...newApiKey,
      key: generateApiKey(),
      is_active: true,
      last_used: null,
    }
    setApiKeys([...apiKeys, apiKey])
    setNewApiKey({ name: "", permissions: [] })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔌 API & Webhook</h1>
          <p className="text-gray-600">API anahtarları ve webhook entegrasyonları</p>
        </div>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="api-keys">🔑 API Anahtarları</TabsTrigger>
          <TabsTrigger value="webhooks">🔗 Webhook'lar</TabsTrigger>
          <TabsTrigger value="docs">📚 Dokümantasyon</TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">🔑 API Anahtarları</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>➕ Yeni API Anahtarı</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni API Anahtarı Oluştur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Anahtar Adı</Label>
                    <Input
                      value={newApiKey.name}
                      onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                      placeholder="Frontend API"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>İzinler</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="read" />
                        <Label htmlFor="read">📖 Okuma</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="write" />
                        <Label htmlFor="write">✏️ Yazma</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="delete" />
                        <Label htmlFor="delete">🗑️ Silme</Label>
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleCreateApiKey} className="w-full">
                    🔑 API Anahtarı Oluştur
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🔑 Mevcut API Anahtarları</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anahtar Adı</TableHead>
                    <TableHead>API Anahtarı</TableHead>
                    <TableHead>İzinler</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Kullanım</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{key.key}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {key.permissions.map((perm) => (
                            <Badge key={perm} variant="outline">
                              {perm === "read" ? "📖" : perm === "write" ? "✏️" : "🗑️"} {perm}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "✅ Aktif" : "❌ Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell>{key.last_used || "Hiç kullanılmadı"}</TableCell>
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
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">🔗 Webhook'lar</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>➕ Yeni Webhook</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Yeni Webhook Oluştur</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Webhook Adı</Label>
                    <Input
                      value={newWebhook.name}
                      onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                      placeholder="Form Submission Webhook"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Webhook URL</Label>
                    <Input
                      value={newWebhook.url}
                      onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                      placeholder="https://webhook.site/unique-id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tetiklenecek Olaylar</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="form-submit" />
                        <Label htmlFor="form-submit">📝 Form Gönderimi</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="page-create" />
                        <Label htmlFor="page-create">📄 Sayfa Oluşturma</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="user-register" />
                        <Label htmlFor="user-register">👤 Kullanıcı Kaydı</Label>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full">🔗 Webhook Oluştur</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🔗 Mevcut Webhook'lar</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Webhook Adı</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Olaylar</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Son Tetikleme</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {webhooks.map((webhook) => (
                    <TableRow key={webhook.id}>
                      <TableCell className="font-medium">{webhook.name}</TableCell>
                      <TableCell>
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">{webhook.url}</code>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline">
                              📝 {event}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={webhook.is_active ? "default" : "secondary"}>
                          {webhook.is_active ? "✅ Aktif" : "❌ Pasif"}
                        </Badge>
                      </TableCell>
                      <TableCell>{webhook.last_triggered || "Hiç tetiklenmedi"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            🧪 Test
                          </Button>
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
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📚 API Dokümantasyonu</CardTitle>
              <CardDescription>API kullanımı için rehber ve örnekler</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">🚀 Hızlı Başlangıç</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <code className="text-sm">
                      curl -H "Authorization: Bearer YOUR_API_KEY" \<br />
                      https://arkkontrol.com/api/pages
                    </code>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">📋 Endpoint'ler</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/pages</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">POST</Badge>
                      <code>/api/pages</code>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">GET</Badge>
                      <code>/api/blog</code>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">📝 Örnek İstekler</h3>
                <Textarea
                  readOnly
                  value={`// Sayfa listesi alma
fetch('/api/pages', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})

// Yeni sayfa oluşturma
fetch('/api/pages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Yeni Sayfa',
    content: 'Sayfa içeriği'
  })
})`}
                  rows={15}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
