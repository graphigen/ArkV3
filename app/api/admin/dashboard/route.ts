import { type NextRequest, NextResponse } from "next/server"
import {
  getDashboardStats,
  getChartData,
  getTrafficSources,
  getDeviceStats,
  getContactMessages,
  getSystemAlerts,
  getTopPages,
} from "@/lib/analytics"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

    let chartData, trafficData, deviceData, messagesData, alertsData, pagesData

    switch (type) {
      case "stats":
        const stats = await getDashboardStats()
        return NextResponse.json(stats)

      case "chart":
        const days = Number.parseInt(searchParams.get("days") || "7")
        chartData = await getChartData(days)
        return NextResponse.json(chartData)

      case "traffic":
        trafficData = await getTrafficSources()
        return NextResponse.json(trafficData)

      case "devices":
        deviceData = await getDeviceStats()
        return NextResponse.json(deviceData)

      case "messages":
        const limit = Number.parseInt(searchParams.get("limit") || "5")
        messagesData = await getContactMessages(limit)
        return NextResponse.json(messagesData)

      case "alerts":
        alertsData = await getSystemAlerts()
        return NextResponse.json(alertsData)

      case "pages":
        const pageLimit = Number.parseInt(searchParams.get("limit") || "5")
        pagesData = await getTopPages(pageLimit)
        return NextResponse.json(pagesData)

      default:
        // Return all dashboard data
        ;[chartData, trafficData, deviceData, messagesData, alertsData, pagesData] = await Promise.all([
          getChartData(7),
          getTrafficSources(),
          getDeviceStats(),
          getContactMessages(5),
          getSystemAlerts(),
          getTopPages(5),
        ])

        const dashboardStats = await getDashboardStats()

        return NextResponse.json({
          stats: dashboardStats,
          chart: chartData,
          traffic: trafficData,
          devices: deviceData,
          messages: messagesData,
          alerts: alertsData,
          pages: pagesData,
        })
    }
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
