import { pool } from "./database"

// Analytics types
export interface DashboardStats {
  totalVisitors: number
  totalPageViews: number
  totalSessions: number
  avgSessionDuration: number
  bounceRate: number
  newVisitors: number
  returningVisitors: number
  visitorChange: number
  pageViewChange: number
  sessionChange: number
}

export interface ChartData {
  name: string
  visitors: number
  pageViews: number
  sessions: number
  bounceRate: number
}

export interface TrafficSource {
  source: string
  sessions: number
  users: number
  percentage: number
  color: string
}

export interface DeviceStats {
  name: string
  value: number
  users: number
  color: string
}

export interface GeoStats {
  country: string
  users: number
  percentage: number
  flag: string
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  subject: string
  message: string
  status: string
  time: string
  unread: boolean
}

export interface SystemAlert {
  id: number
  type: string
  title: string
  message: string
  action?: string
  link?: string
  priority: number
}

// Analytics functions
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get current week stats
    const currentWeekResult = await pool.query(`
      SELECT 
        SUM(visitors) as total_visitors,
        SUM(page_views) as total_page_views,
        SUM(sessions) as total_sessions,
        AVG(avg_session_duration) as avg_duration,
        AVG(bounce_rate) as bounce_rate,
        SUM(new_visitors) as new_visitors,
        SUM(returning_visitors) as returning_visitors
      FROM site_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    `)

    // Get previous week stats for comparison
    const previousWeekResult = await pool.query(`
      SELECT 
        SUM(visitors) as total_visitors,
        SUM(page_views) as total_page_views,
        SUM(sessions) as total_sessions
      FROM site_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '14 days' 
      AND date < CURRENT_DATE - INTERVAL '7 days'
    `)

    const current = currentWeekResult.rows[0]
    const previous = previousWeekResult.rows[0]

    const visitorChange = previous.total_visitors
      ? ((current.total_visitors - previous.total_visitors) / previous.total_visitors) * 100
      : 0

    const pageViewChange = previous.total_page_views
      ? ((current.total_page_views - previous.total_page_views) / previous.total_page_views) * 100
      : 0

    const sessionChange = previous.total_sessions
      ? ((current.total_sessions - previous.total_sessions) / previous.total_sessions) * 100
      : 0

    return {
      totalVisitors: Number.parseInt(current.total_visitors) || 0,
      totalPageViews: Number.parseInt(current.total_page_views) || 0,
      totalSessions: Number.parseInt(current.total_sessions) || 0,
      avgSessionDuration: Number.parseInt(current.avg_duration) || 0,
      bounceRate: Number.parseFloat(current.bounce_rate) || 0,
      newVisitors: Number.parseInt(current.new_visitors) || 0,
      returningVisitors: Number.parseInt(current.returning_visitors) || 0,
      visitorChange: Math.round(visitorChange * 100) / 100,
      pageViewChange: Math.round(pageViewChange * 100) / 100,
      sessionChange: Math.round(sessionChange * 100) / 100,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalVisitors: 0,
      totalPageViews: 0,
      totalSessions: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      newVisitors: 0,
      returningVisitors: 0,
      visitorChange: 0,
      pageViewChange: 0,
      sessionChange: 0,
    }
  }
}

export async function getChartData(days = 7): Promise<ChartData[]> {
  try {
    const result = await pool.query(
      `
      SELECT 
        TO_CHAR(date, 'Dy') as name,
        visitors,
        page_views,
        sessions,
        bounce_rate
      FROM site_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '${days} days'
      ORDER BY date ASC
    `,
    )

    return result.rows.map((row) => ({
      name: row.name,
      visitors: Number.parseInt(row.visitors),
      pageViews: Number.parseInt(row.page_views),
      sessions: Number.parseInt(row.sessions),
      bounceRate: Number.parseFloat(row.bounce_rate),
    }))
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return []
  }
}

export async function getTrafficSources(): Promise<TrafficSource[]> {
  try {
    const result = await pool.query(`
      SELECT 
        source_type,
        source_name,
        SUM(sessions) as total_sessions,
        SUM(users) as total_users
      FROM traffic_sources 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY source_type, source_name
      ORDER BY total_sessions DESC
    `)

    const totalSessions = result.rows.reduce((sum, row) => sum + Number.parseInt(row.total_sessions), 0)

    const colors = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"]

    return result.rows.map((row, index) => ({
      source: row.source_name || row.source_type,
      sessions: Number.parseInt(row.total_sessions),
      users: Number.parseInt(row.total_users),
      percentage: Math.round((Number.parseInt(row.total_sessions) / totalSessions) * 100 * 100) / 100,
      color: colors[index % colors.length],
    }))
  } catch (error) {
    console.error("Error fetching traffic sources:", error)
    return []
  }
}

export async function getDeviceStats(): Promise<DeviceStats[]> {
  try {
    const result = await pool.query(`
      SELECT 
        device_type,
        SUM(users) as total_users
      FROM device_stats 
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY device_type
      ORDER BY total_users DESC
    `)

    const totalUsers = result.rows.reduce((sum, row) => sum + Number.parseInt(row.total_users), 0)

    const deviceColors: { [key: string]: string } = {
      desktop: "#f97316",
      mobile: "#3b82f6",
      tablet: "#10b981",
    }

    return result.rows.map((row) => ({
      name: row.device_type.charAt(0).toUpperCase() + row.device_type.slice(1),
      value: Math.round((Number.parseInt(row.total_users) / totalUsers) * 100),
      users: Number.parseInt(row.total_users),
      color: deviceColors[row.device_type] || "#6b7280",
    }))
  } catch (error) {
    console.error("Error fetching device stats:", error)
    return []
  }
}

export async function getContactMessages(limit = 5): Promise<ContactMessage[]> {
  try {
    const result = await pool.query(
      `
      SELECT id, name, email, subject, message, status, created_at
      FROM contact_messages 
      ORDER BY created_at DESC 
      LIMIT $1
    `,
      [limit],
    )

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject,
      message: row.message,
      status: row.status,
      time: formatTimeAgo(row.created_at),
      unread: row.status === "unread",
    }))
  } catch (error) {
    console.error("Error fetching contact messages:", error)
    return []
  }
}

export async function getSystemAlerts(): Promise<SystemAlert[]> {
  try {
    const result = await pool.query(`
      SELECT id, type, title, message, action_text, action_url, priority
      FROM system_alerts 
      WHERE is_dismissed = false 
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      ORDER BY priority DESC, created_at DESC
    `)

    return result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      message: row.message,
      action: row.action_text,
      link: row.action_url,
      priority: row.priority,
    }))
  } catch (error) {
    console.error("Error fetching system alerts:", error)
    return []
  }
}

export async function getTopPages(limit = 5): Promise<any[]> {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.title,
        p.slug,
        COUNT(pv.id) as views,
        COUNT(DISTINCT pv.session_id) as unique_views,
        AVG(pv.visit_duration) as avg_time
      FROM pages p
      LEFT JOIN page_views pv ON p.id = pv.page_id
      WHERE pv.created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY p.id, p.title, p.slug
      ORDER BY views DESC
      LIMIT $1
    `,
      [limit],
    )

    return result.rows.map((row) => ({
      page: `/${row.slug}`,
      title: row.title,
      views: Number.parseInt(row.views) || 0,
      uniqueViews: Number.parseInt(row.unique_views) || 0,
      avgTime: formatDuration(Number.parseInt(row.avg_time) || 0),
      bounceRate: "35%", // Placeholder - calculate from actual data
    }))
  } catch (error) {
    console.error("Error fetching top pages:", error)
    return []
  }
}

// Utility functions
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60))

  if (diffInMinutes < 60) {
    return `${diffInMinutes} dakika önce`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    return `${hours} saat önce`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    return `${days} gün önce`
  }
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
}

// Google Analytics Integration
export async function syncGoogleAnalytics(): Promise<boolean> {
  try {
    // This would integrate with Google Analytics API
    // For now, return true as placeholder
    console.log("Syncing with Google Analytics...")
    return true
  } catch (error) {
    console.error("Error syncing Google Analytics:", error)
    return false
  }
}

export async function trackPageView(pageUrl: string, visitorData: any): Promise<void> {
  try {
    await pool.query(
      `
      INSERT INTO page_views (page_url, visitor_ip, user_agent, referrer, device_type, browser, os, session_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        pageUrl,
        visitorData.ip,
        visitorData.userAgent,
        visitorData.referrer,
        visitorData.deviceType,
        visitorData.browser,
        visitorData.os,
        visitorData.sessionId,
      ],
    )
  } catch (error) {
    console.error("Error tracking page view:", error)
  }
}
