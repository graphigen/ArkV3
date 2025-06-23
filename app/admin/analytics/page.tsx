"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  MousePointer,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Download,
} from "lucide-react"
import { toast } from "sonner"

interface AnalyticsData {
  overview: {
    totalVisitors: number
    pageViews: number
    bounceRate: number
    avgSessionDuration: string
    trends: {
      visitors: number
      pageViews: number
      bounceRate: number
      sessionDuration: number
    }
  }
  topPages: Array<{
    page: string
    views: number
    uniqueVisitors: number
    bounceRate: number
  }>
  traffic: Array<{
    source: string
    visitors: number
    percentage: number
  }>
  devices: Array<{
    device: string
    visitors: number
    percentage: number
  }>
  countries: Array<{
    country: string
    visitors: number
    percentage: number
  }>
  realTime: {
    activeUsers: number
    currentPageViews: number
    topActivePages: Array<{
      page: string
      activeUsers: number
    }>
  }
  isConnected: boolean
  message?: string
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [needsConnection, setNeedsConnection] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false)
  const [connectionForm, setConnectionForm] = useState({
    apiKey: "",
    propertyId: "",
    serviceAccountKey: "",
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/admin/analytics/data")
      const result = await response.json()

      setData(result.data)
      setIsConnected(result.connected || false)
      setNeedsConnection(result.needsConnection || false)

      if (result.warning) {
        toast.warning(result.warning)
      }
    } catch (error) {
      console.error("Analytics data fetch error:", error)
      toast.error("Analytics verileri yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleConnectGoogleAnalytics = async () => {
    if (!connectionForm.apiKey || !connectionForm.propertyId) {
      toast.error("API Key ve Property ID gereklidir")
      return
    }

    setIsConnecting(true)
    try {
      const response = await fetch("/api/admin/analytics/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(connectionForm),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message)
        setIsConnected(true)
        setNeedsConnection(false)
        setIsConnectionDialogOpen(false)
        setConnectionForm({ apiKey: "", propertyId: "", serviceAccountKey: "" })
        fetchAnalyticsData()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("Connection error:", error)
      toast.error("Bağlantı kurulurken hata oluştu")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectGoogleAnalytics = async () => {
    if (!confirm("Google Analytics bağlantısını kesmek istediğinizden emin misiniz?")) return

    try {
      const response = await fetch("/api/admin/analytics/connect", {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Google Analytics bağlantısı kesildi")
        setIsConnected(false)
        setNeedsConnection(true)
        fetchAnalyticsData()
      } else {
        toast.error("Bağlantı kesilirken hata oluştu")
      }
    } catch (error) {
      console.error("Disconnect error:", error)
      toast.error("Bağlantı kesilirken hata oluştu")
    }
  }

  const exportData = () => {
    if (!data) return

    const exportData = {
      exportDate: new Date().toISOString(),
      overview: data.overview,
      topPages: data.topPages,
      traffic: data.traffic,
      devices: data.devices,
      countries: data.countries,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Analytics verileri indirildi")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Web sitenizin performansını izleyin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
          {data && (
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
          )}
          <Dialog open={isConnectionDialogOpen} onOpenChange={setIsConnectionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant={isConnected ? "outline" : "default"}>
                <Settings className="h-4 w-4 mr-2" />
                {isConnected ? "Bağlantı Ayarları" : "Google Analytics Bağla"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Google Analytics Bağlantısı</DialogTitle>
                <DialogDescription>
                  Google Analytics hesabınızı bağlayarak gerçek verilerinizi görüntüleyebilirsiniz
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {isConnected && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Google Analytics başarıyla bağlandı</AlertDescription>
                  </Alert>
                )}
                <div>
                  <Label htmlFor="api-key">Google Analytics API Key</Label>
                  <Input
                    id="api-key"
                    value={connectionForm.apiKey}
                    onChange={(e) => setConnectionForm({ ...connectionForm, apiKey: e.target.value })}
                    placeholder="AIzaSyC..."
                    disabled={isConnected}
                  />
                </div>
                <div>
                  <Label htmlFor="property-id">Property ID</Label>
                  <Input
                    id="property-id"
                    value={connectionForm.propertyId}
                    onChange={(e) => setConnectionForm({ ...connectionForm, propertyId: e.target.value })}
                    placeholder="123456789"
                    disabled={isConnected}
                  />
                </div>
                <div>
                  <Label htmlFor="service-account">Service Account Key (Opsiyonel)</Label>
                  <Textarea
                    id="service-account"
                    value={connectionForm.serviceAccountKey}
                    onChange={(e) => setConnectionForm({ ...connectionForm, serviceAccountKey: e.target.value })}
                    placeholder="JSON service account key..."
                    disabled={isConnected}
                  />
                </div>
                <div className="flex gap-2">
                  {isConnected ? (
                    <Button variant="destructive" onClick={handleDisconnectGoogleAnalytics} className="w-full">
                      Bağlantıyı Kes
                    </Button>
                  ) : (
                    <Button onClick={handleConnectGoogleAnalytics} disabled={isConnecting} className="w-full">
                      {isConnecting ? "Bağlanıyor..." : "Bağlan"}
                    </Button>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connection Status */}
      {needsConnection && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Google Analytics bağlantısı yapılmamış. Gerçek verileri görmek için lütfen bağlantıyı kurun.
          </AlertDescription>
        </Alert>
      )}

      {/* Connection Status Badge */}
      <div className="flex items-center gap-2">
        <Badge variant={isConnected ? "default" : "secondary"}>
          {isConnected ? (
            <>
              <CheckCircle className="h-3 w-3 mr-1" />
              Bağlı
            </>
          ) : (
            <>
              <AlertCircle className="h-3 w-3 mr-1" />
              Bağlı Değil
            </>
          )}
        </Badge>
        {isConnected && <span className="text-sm text-muted-foreground">Google Analytics</span>}
      </div>

      {data && (
        <>
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Toplam Ziyaretçi</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.totalVisitors.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.overview.trends.visitors >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(data.overview.trends.visitors)}% geçen haftaya göre
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sayfa Görüntüleme</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.pageViews.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.overview.trends.pageViews >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(data.overview.trends.pageViews)}% geçen haftaya göre
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Çıkış Oranı</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.bounceRate}%</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.overview.trends.bounceRate <= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(data.overview.trends.bounceRate)}% geçen haftaya göre
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ort. Oturum Süresi</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.avgSessionDuration}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {data.overview.trends.sessionDuration >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(data.overview.trends.sessionDuration)}% geçen haftaya göre
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Data */}
          <Card>
            <CardHeader>
              <CardTitle>Gerçek Zamanlı Veriler</CardTitle>
              <CardDescription>Şu anda sitenizde olan kullanıcılar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{data.realTime.activeUsers}</div>
                  <div className="text-sm text-muted-foreground">Aktif Kullanıcı</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">{data.realTime.currentPageViews}</div>
                  <div className="text-sm text-muted-foreground">Anlık Sayfa Görüntüleme</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">En Aktif Sayfalar</div>
                  {data.realTime.topActivePages.map((page, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="truncate">{page.page}</span>
                      <span className="text-muted-foreground">{page.activeUsers}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts and Tables */}
          <Tabs defaultValue="pages" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pages">En Popüler Sayfalar</TabsTrigger>
              <TabsTrigger value="traffic">Trafik Kaynakları</TabsTrigger>
              <TabsTrigger value="devices">Cihazlar</TabsTrigger>
              <TabsTrigger value="countries">Ülkeler</TabsTrigger>
            </TabsList>

            <TabsContent value="pages">
              <Card>
                <CardHeader>
                  <CardTitle>En Popüler Sayfalar</CardTitle>
                  <CardDescription>En çok ziyaret edilen sayfalar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="font-medium">{page.page}</div>
                          <div className="text-sm text-muted-foreground">
                            {page.views.toLocaleString()} görüntüleme • {page.uniqueVisitors.toLocaleString()} benzersiz
                            ziyaretçi
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{page.bounceRate}%</div>
                          <div className="text-xs text-muted-foreground">Çıkış Oranı</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traffic">
              <Card>
                <CardHeader>
                  <CardTitle>Trafik Kaynakları</CardTitle>
                  <CardDescription>Ziyaretçilerinizin nereden geldiği</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-4">
                      {data.traffic.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            <span className="font-medium">{source.source}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{source.visitors.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{source.percentage}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={data.traffic}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="visitors"
                          >
                            {data.traffic.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(${index * 90}, 70%, 50%)`} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices">
              <Card>
                <CardHeader>
                  <CardTitle>Cihaz Dağılımı</CardTitle>
                  <CardDescription>Ziyaretçilerinizin kullandığı cihazlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.devices.map((device, index) => {
                      const Icon =
                        device.device === "Desktop" ? Monitor : device.device === "Mobile" ? Smartphone : Tablet
                      return (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{device.device}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{device.visitors.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">{device.percentage}%</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="countries">
              <Card>
                <CardHeader>
                  <CardTitle>Ülke Dağılımı</CardTitle>
                  <CardDescription>Ziyaretçilerinizin ülkelere göre dağılımı</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.countries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{country.visitors.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{country.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
