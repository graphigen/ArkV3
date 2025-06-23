"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function BackupPage() {
  const [settings, setSettings] = useState({
    auto_backup_enabled: true,
    backup_frequency: "daily",
    backup_retention_days: 30,
  })

  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)

  const backups = [
    { id: 1, name: "backup_2024_01_15_14_30.sql", size: "2.4 MB", date: "15 Ocak 2024 14:30", type: "auto" },
    { id: 2, name: "backup_2024_01_14_09_15.sql", size: "2.3 MB", date: "14 Ocak 2024 09:15", type: "manual" },
    { id: 3, name: "backup_2024_01_13_16_45.sql", size: "2.2 MB", date: "13 Ocak 2024 16:45", type: "auto" },
  ]

  const handleManualBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">💾 Yedekleme</h1>
          <p className="text-gray-600">Veritabanı ve medya dosyalarını yedekleyin</p>
        </div>
        <Button onClick={handleManualBackup} disabled={isBackingUp} className="bg-green-600 hover:bg-green-700">
          {isBackingUp ? "🔄 Yedekleniyor..." : "💾 Manuel Yedekle"}
        </Button>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <Card>
          <CardHeader>
            <CardTitle>🔄 Yedekleme İşlemi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={backupProgress} className="w-full" />
              <p className="text-sm text-gray-600">Veritabanı yedekleniyor... %{backupProgress}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Yedekleme Ayarları</CardTitle>
          <CardDescription>Otomatik yedekleme ayarlarını yapılandırın</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Otomatik Yedekleme</Label>
              <p className="text-sm text-gray-500">Belirli aralıklarla otomatik yedek alın</p>
            </div>
            <Switch
              checked={settings.auto_backup_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, auto_backup_enabled: checked })}
            />
          </div>

          {settings.auto_backup_enabled && (
            <>
              <div className="space-y-2">
                <Label>Yedekleme Sıklığı</Label>
                <Select
                  value={settings.backup_frequency}
                  onValueChange={(value) => setSettings({ ...settings, backup_frequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">⏰ Saatlik</SelectItem>
                    <SelectItem value="daily">📅 Günlük</SelectItem>
                    <SelectItem value="weekly">📆 Haftalık</SelectItem>
                    <SelectItem value="monthly">🗓️ Aylık</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Yedek Saklama Süresi</Label>
                <Select
                  value={settings.backup_retention_days.toString()}
                  onValueChange={(value) => setSettings({ ...settings, backup_retention_days: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 Gün</SelectItem>
                    <SelectItem value="30">30 Gün</SelectItem>
                    <SelectItem value="90">90 Gün</SelectItem>
                    <SelectItem value="365">1 Yıl</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <Button className="w-full">💾 Ayarları Kaydet</Button>
        </CardContent>
      </Card>

      {/* Backup List */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Yedek Dosyaları</CardTitle>
          <CardDescription>Mevcut yedek dosyalarını görüntüleyin ve yönetin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-xl">💾</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{backup.name}</p>
                    <p className="text-sm text-gray-500">
                      {backup.size} • {backup.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={backup.type === "auto" ? "default" : "secondary"}>
                    {backup.type === "auto" ? "🤖 Otomatik" : "👤 Manuel"}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      ⬇️ İndir
                    </Button>
                    <Button variant="outline" size="sm">
                      🔄 Geri Yükle
                    </Button>
                    <Button variant="outline" size="sm">
                      🗑️ Sil
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🗄️ Veritabanı Yedekle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Tüm veritabanını SQL dosyası olarak yedekleyin</p>
            <Button className="w-full">💾 DB Yedekle</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🖼️ Medya Yedekle</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Tüm medya dosyalarını ZIP olarak indirin</p>
            <Button className="w-full">📦 Medya İndir</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🔄 Tam Yedek</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">Veritabanı + medya dosyalarının tam yedeği</p>
            <Button className="w-full">💾 Tam Yedek</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
