"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Database, HardDrive, Cloud, Download, Settings, Clock, CheckCircle, XCircle } from "lucide-react"

interface BackupSettings {
  automated: {
    enabled: boolean
    frequency: string
    time: string
    retention: number
  }
  storage: {
    local: {
      enabled: boolean
      path: string
      maxSize: string
    }
    cloud: {
      enabled: boolean
      provider: string
      bucket: string
      region: string
    }
  }
  includes: {
    database: boolean
    files: boolean
    media: boolean
    config: boolean
  }
  compression: {
    enabled: boolean
    level: number
  }
  encryption: {
    enabled: boolean
    algorithm: string
  }
}

interface BackupHistory {
  id: number
  timestamp: string
  type: string
  status: string
  size: string
  duration: string
  includes: string[]
  location?: string
  error?: string
}

export default function BackupSettingsPage() {
  const [settings, setSettings] = useState<BackupSettings | null>(null)
  const [history, setHistory] = useState<BackupHistory[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchBackupSettings()
  }, [])

  const fetchBackupSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings/backup")
      const result = await response.json()

      if (result.success) {
        setSettings(result.data.settings)
        setHistory(result.data.history)
        setStats(result.data.stats)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch backup settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings/backup", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Backup settings updated successfully",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update backup settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const createBackup = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/admin/settings/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_backup" }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "Success",
          description: "Backup created successfully",
        })
        fetchBackupSettings() // Refresh data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create backup",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const updateSettings = (section: keyof BackupSettings, field: string, value: any) => {
    if (!settings) return

    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        )
      case "running":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Running
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!settings) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup Settings</h1>
          <p className="text-muted-foreground">Configure automated backups and manage backup history</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createBackup} disabled={creating} variant="outline">
            {creating ? "Creating..." : "Create Backup Now"}
          </Button>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Backups</p>
                  <p className="text-2xl font-bold">{stats.totalBackups}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Successful</p>
                  <p className="text-2xl font-bold">{stats.successfulBackups}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                  <p className="text-2xl font-bold">{stats.totalSize}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Last Backup</p>
                  <p className="text-sm font-medium">{new Date(stats.lastBackup).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Automated Backups</CardTitle>
                <CardDescription>Configure automatic backup scheduling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="automated-enabled">Enable Automated Backups</Label>
                    <p className="text-sm text-muted-foreground">Automatically create backups on schedule</p>
                  </div>
                  <Switch
                    id="automated-enabled"
                    checked={settings.automated.enabled}
                    onCheckedChange={(checked) => updateSettings("automated", "enabled", checked)}
                  />
                </div>

                {settings.automated.enabled && (
                  <>
                    <Separator />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select
                          value={settings.automated.frequency}
                          onValueChange={(value) => updateSettings("automated", "frequency", value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hourly">Hourly</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="backup-time">Time</Label>
                        <Input
                          id="backup-time"
                          type="time"
                          value={settings.automated.time}
                          onChange={(e) => updateSettings("automated", "time", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="retention">Retention (days)</Label>
                        <Input
                          id="retention"
                          type="number"
                          value={settings.automated.retention}
                          onChange={(e) => updateSettings("automated", "retention", Number.parseInt(e.target.value))}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Backup Content</CardTitle>
                <CardDescription>Select what to include in backups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-database">Database</Label>
                    <Switch
                      id="include-database"
                      checked={settings.includes.database}
                      onCheckedChange={(checked) => updateSettings("includes", "database", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-files">Application Files</Label>
                    <Switch
                      id="include-files"
                      checked={settings.includes.files}
                      onCheckedChange={(checked) => updateSettings("includes", "files", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-media">Media Files</Label>
                    <Switch
                      id="include-media"
                      checked={settings.includes.media}
                      onCheckedChange={(checked) => updateSettings("includes", "media", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-config">Configuration</Label>
                    <Switch
                      id="include-config"
                      checked={settings.includes.config}
                      onCheckedChange={(checked) => updateSettings("includes", "config", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="storage">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Local Storage</CardTitle>
                <CardDescription>Store backups on local server</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="local-enabled">Enable Local Storage</Label>
                  <Switch
                    id="local-enabled"
                    checked={settings.storage.local.enabled}
                    onCheckedChange={(checked) =>
                      updateSettings("storage", "local", { ...settings.storage.local, enabled: checked })
                    }
                  />
                </div>
                {settings.storage.local.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="local-path">Storage Path</Label>
                      <Input
                        id="local-path"
                        value={settings.storage.local.path}
                        onChange={(e) =>
                          updateSettings("storage", "local", { ...settings.storage.local, path: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="local-maxsize">Max Size</Label>
                      <Input
                        id="local-maxsize"
                        value={settings.storage.local.maxSize}
                        onChange={(e) =>
                          updateSettings("storage", "local", { ...settings.storage.local, maxSize: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cloud Storage</CardTitle>
                <CardDescription>Store backups in cloud storage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cloud-enabled">Enable Cloud Storage</Label>
                  <Switch
                    id="cloud-enabled"
                    checked={settings.storage.cloud.enabled}
                    onCheckedChange={(checked) =>
                      updateSettings("storage", "cloud", { ...settings.storage.cloud, enabled: checked })
                    }
                  />
                </div>
                {settings.storage.cloud.enabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Provider</Label>
                      <Select
                        value={settings.storage.cloud.provider}
                        onValueChange={(value) =>
                          updateSettings("storage", "cloud", { ...settings.storage.cloud, provider: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">Amazon S3</SelectItem>
                          <SelectItem value="gcp">Google Cloud Storage</SelectItem>
                          <SelectItem value="azure">Azure Blob Storage</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cloud-region">Region</Label>
                      <Input
                        id="cloud-region"
                        value={settings.storage.cloud.region}
                        onChange={(e) =>
                          updateSettings("storage", "cloud", { ...settings.storage.cloud, region: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cloud-bucket">Bucket/Container</Label>
                      <Input
                        id="cloud-bucket"
                        value={settings.storage.cloud.bucket}
                        onChange={(e) =>
                          updateSettings("storage", "cloud", { ...settings.storage.cloud, bucket: e.target.value })
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>View and manage backup history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {history.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        {backup.status === "completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : backup.status === "failed" ? (
                          <XCircle className="h-5 w-5 text-red-600" />
                        ) : (
                          <Clock className="h-5 w-5 text-orange-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(backup.status)}
                          <Badge variant="outline">{backup.type}</Badge>
                        </div>
                        <p className="font-medium">{new Date(backup.timestamp).toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Size: {backup.size} • Duration: {backup.duration}
                        </p>
                        {backup.error && <p className="text-sm text-red-600">Error: {backup.error}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {backup.status === "completed" && (
                        <>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            Restore
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="sm">
                        Delete
                      </Button>
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
