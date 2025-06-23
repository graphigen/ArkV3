import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Get analytics summary
    const summary = await sql`
      SELECT 
        SUM(visitors) as total_visitors,
        SUM(page_views) as total_page_views,
        SUM(unique_visitors) as total_unique_visitors,
        AVG(bounce_rate) as avg_bounce_rate,
        AVG(avg_session_duration) as avg_session_duration
      FROM analytics_data
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
    `

    // Get daily stats for last 7 days
    const dailyStats = await sql`
      SELECT 
        date,
        SUM(visitors) as visitors,
        SUM(page_views) as page_views,
        SUM(unique_visitors) as unique_visitors,
        AVG(bounce_rate) as bounce_rate
      FROM analytics_data
      WHERE date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY date
      ORDER BY date DESC
    `

    // Get top pages
    const topPages = await sql`
      SELECT 
        page_path,
        SUM(page_views) as page_views,
        SUM(visitors) as visitors,
        AVG(bounce_rate) as bounce_rate
      FROM analytics_data
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
        AND page_path IS NOT NULL
      GROUP BY page_path
      ORDER BY page_views DESC
      LIMIT 10
    `

    // Get traffic sources
    const trafficSources = await sql`
      SELECT 
        traffic_source,
        SUM(visitors) as visitors,
        COUNT(*) as sessions
      FROM analytics_data
      WHERE date >= CURRENT_DATE - INTERVAL '30 days'
        AND traffic_source IS NOT NULL
      GROUP BY traffic_source
      ORDER BY visitors DESC
    `

    return NextResponse.json({
      summary: summary[0] || {},
      dailyStats,
      topPages,
      trafficSources,
    })
  } catch (error) {
    console.error("Analytics fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      page_path,
      visitors = 1,
      page_views = 1,
      unique_visitors = 1,
      bounce_rate = 0,
      avg_session_duration = 0,
      traffic_source = "direct",
      device_type = "desktop",
      country = "Turkey",
      city = "Istanbul",
    } = body

    const newRecord = await sql`
      INSERT INTO analytics_data (
        date, page_path, visitors, page_views, unique_visitors, 
        bounce_rate, avg_session_duration, traffic_source, 
        device_type, country, city
      )
      VALUES (
        CURRENT_DATE, ${page_path}, ${visitors}, ${page_views}, ${unique_visitors},
        ${bounce_rate}, ${avg_session_duration}, ${traffic_source},
        ${device_type}, ${country}, ${city}
      )
      ON CONFLICT (date, page_path, traffic_source, device_type) 
      DO UPDATE SET
        visitors = analytics_data.visitors + ${visitors},
        page_views = analytics_data.page_views + ${page_views},
        unique_visitors = analytics_data.unique_visitors + ${unique_visitors}
      RETURNING *
    `

    return NextResponse.json(newRecord[0])
  } catch (error) {
    console.error("Analytics creation error:", error)
    return NextResponse.json({ error: "Failed to create analytics record" }, { status: 500 })
  }
}
