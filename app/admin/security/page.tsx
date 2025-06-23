"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SecurityPage() {
  const [settings, setSettings] = useState({
    recaptcha_site_key: "",
    recaptcha_secret_key: "",
    recaptcha_version: "v2",
    session_timeout: 3600,
    max_login_attempts: 5,
    lockout_duration: 900,
    ip_whitelist: [],
    ip_blacklist: [],
  })

  const securityLogs = [
    { id: 1, event: "Başarısız giriş denemesi", ip: "192.168.1.100", time: "2024-01-15 14:30", severity: "warning" },
    { id: 2, event: "Şüpheli API isteği", ip: "10.0.0.1", time: "2024-01-15 13:45", severity: "high" },
    { id: 3, event: "Başarılı admin girişi", ip: "192.168.1.50", time: "2024-01-15 12:15", severity: "info" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🔒 Güvenlik</h1>
          <p className="text-gray-600">Site güvenlik ayarları ve izleme</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">🚨 Acil Durum Modu</Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">🔐 Genel</TabsTrigger>
          <TabsTrigger value="recaptcha">🤖 reCAPTCHA</TabsTrigger>
          <TabsTrigger value="firewall">🛡️ Firewall</TabsTrigger>
          <TabsTrigger value="logs">📋 Loglar</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🔐 Genel Güvenlik Ayarları</CardTitle>
              <CardDescription>Temel güvenlik parametrelerini yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Oturum Zaman Aşımı (saniye)</Label>
                  <Input
                    type="number"
                    value={settings.session_timeout}
                    onChange={(e) => setSettings({ ...settings, session_timeout: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-500">Varsayılan: 3600 saniye (1 saat)</p>
                </div>

                <div className="space-y-2">
                  <Label>Maksimum Giriş Denemesi</Label>
                  <Input
                    type="number"
                    value={settings.max_login_attempts}
                    onChange={(e) => setSettings({ ...settings, max_login_attempts: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-500">Hesap kilitlenmeden önceki deneme sayısı</p>
                </div>

                <div className="space-y-2">
                  <Label>Kilitleme Süresi (saniye)</Label>
                  <Input
                    type="number"
                    value={settings.lockout_duration}
                    onChange={(e) => setSettings({ ...settings, lockout_duration: Number.parseInt(e.target.value) })}
                  />
                  <p className="text-sm text-gray-500">Hesap kilitleme süresi</p>
                </div>
              </div>

              <Button className="w-full">💾 Güvenlik Ayarlarını Kaydet</Button>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle>🛡️ Güvenlik Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">SSL Sertifikası</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Aktif ve geçerli</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Firewall</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Aktif</p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="font-medium">2FA</span>
                  </div>
                  <p className="text-sm text-yellow-600 mt-1">Yapılandırılmadı</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Yedekleme</span>
                  </div>
                  <p className="text-sm text-green-600 mt-1">Güncel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recaptcha" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🤖 Google reCAPTCHA</CardTitle>
              <CardDescription>Spam koruması için reCAPTCHA yapılandırın</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>reCAPTCHA Versiyonu</Label>
                <Select
                  value={settings.recaptcha_version}
                  onValueChange={(value) => setSettings({ ...settings, recaptcha_version: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v2">reCAPTCHA v2</SelectItem>
                    <SelectItem value="v3">reCAPTCHA v3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Site Anahtarı</Label>
                <Input
                  value={settings.recaptcha_site_key}
                  onChange={(e) => setSettings({ ...settings, recaptcha_site_key: e.target.value })}
                  placeholder="6Lc..."
                />
              </div>

              <div className="space-y-2">
                <Label>Gizli Anahtar</Label>
                <Input
                  type="password"
                  value={settings.recaptcha_secret_key}
                  onChange={(e) => setSettings({ ...settings, recaptcha_secret_key: e.target.value })}
                  placeholder="6Lc..."
                />
              </div>

              <Button className="w-full">🔑 reCAPTCHA Ayarlarını Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>🛡️ IP Firewall</CardTitle>
              <CardDescription>IP adreslerini beyaz liste veya kara listeye ekleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Beyaz Liste (İzin Verilen IP'ler)</Label>
                  <Textarea placeholder="192.168.1.1&#10;10.0.0.0/24&#10;Her satıra bir IP adresi" rows={4} />
                  <p className="text-sm text-gray-500 mt-1">Bu IP'ler her zaman erişim sağlayabilir</p>
                </div>

                <div>
                  <Label>Kara Liste (Yasaklanan IP'ler)</Label>
                  <Textarea placeholder="192.168.1.100&#10;10.0.0.50&#10;Her satıra bir IP adresi" rows={4} />
                  <p className="text-sm text-gray-500 mt-1">Bu IP'ler erişim sağlayamaz</p>
                </div>
              </div>

              <Button className="w-full">🛡️ Firewall Kurallarını Kaydet</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>📋 Güvenlik Logları</CardTitle>
              <CardDescription>Son güvenlik olaylarını görüntüleyin</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          log.severity === "high"
                            ? "bg-red-500"
                            : log.severity === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900">{log.event}</p>
                        <p className="text-sm text-gray-500">IP: {log.ip}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          log.severity === "high" ? "destructive" : log.severity === "warning" ? "secondary" : "default"
                        }
                      >
                        {log.severity === "high" ? "🚨 Yüksek" : log.severity === "warning" ? "⚠️ Uyarı" : "ℹ️ Bilgi"}
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">{log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
