"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
} from "lucide-react"

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
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("7d")

  useEffect(() => {
    fetchAnalytics()
  }, [dateRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics/data?range=${dateRange}`)
      const result = await response.json()
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error("Analytics fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <div className="h-4 w-4" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-green-600"
    if (trend < 0) return "text-red-600"
    return "text-gray-600"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Website traffic and user behavior insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.totalVisitors.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${getTrendColor(data.overview.trends.visitors)}`}>
              {getTrendIcon(data.overview.trends.visitors)}
              <span className="ml-1">
                {data.overview.trends.visitors > 0 ? "+" : ""}
                {data.overview.trends.visitors}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.pageViews.toLocaleString()}</div>
            <div className={`flex items-center text-xs ${getTrendColor(data.overview.trends.pageViews)}`}>
              {getTrendIcon(data.overview.trends.pageViews)}
              <span className="ml-1">
                {data.overview.trends.pageViews > 0 ? "+" : ""}
                {data.overview.trends.pageViews}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.bounceRate}%</div>
            <div className={`flex items-center text-xs ${getTrendColor(-data.overview.trends.bounceRate)}`}>
              {getTrendIcon(-data.overview.trends.bounceRate)}
              <span className="ml-1">
                {data.overview.trends.bounceRate > 0 ? "+" : ""}
                {data.overview.trends.bounceRate}% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.overview.avgSessionDuration}</div>
            <div className={`flex items-center text-xs ${getTrendColor(data.overview.trends.sessionDuration)}`}>
              {getTrendIcon(data.overview.trends.sessionDuration)}
              <span className="ml-1">
                {data.overview.trends.sessionDuration > 0 ? "+" : ""}
                {data.overview.trends.sessionDuration}% from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pages">Top Pages</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages on your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topPages.map((page, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{page.page}</p>
                      <p className="text-sm text-muted-foreground">
                        {page.views.toLocaleString()} views • {page.uniqueVisitors.toLocaleString()} unique visitors
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={page.bounceRate < 40 ? "default" : page.bounceRate < 60 ? "secondary" : "destructive"}
                      >
                        {page.bounceRate}% bounce
                      </Badge>
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
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.traffic.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{source.percentage}%</span>
                      <span className="font-medium w-16 text-right">{source.visitors.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Device Types</CardTitle>
              <CardDescription>Devices used by your visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.devices.map((device, index) => {
                  const getDeviceIcon = (deviceType: string) => {
                    switch (deviceType.toLowerCase()) {
                      case "mobile":
                        return <Smartphone className="h-4 w-4 text-muted-foreground" />
                      case "desktop":
                        return <Monitor className="h-4 w-4 text-muted-foreground" />
                      default:
                        return <Globe className="h-4 w-4 text-muted-foreground" />
                    }
                  }

                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getDeviceIcon(device.device)}
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-24">
                          <Progress value={device.percentage} className="h-2" />
                        </div>
                        <span className="text-sm text-muted-foreground w-12 text-right">{device.percentage}%</span>
                        <span className="font-medium w-16 text-right">{device.visitors.toLocaleString()}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Geographic distribution of your visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.countries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{country.country}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24">
                        <Progress value={country.percentage} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">{country.percentage}%</span>
                      <span className="font-medium w-16 text-right">{country.visitors.toLocaleString()}</span>
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
