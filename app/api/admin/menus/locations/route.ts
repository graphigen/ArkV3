import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    // Önce veritabanından mevcut konumları kontrol et
    const existingLocations = await sql`
      SELECT location_key, location_name, description, is_active 
      FROM menu_locations 
      WHERE is_active = true 
      ORDER BY location_name
    `

    // Eğer hiç konum yoksa, varsayılan konumları ekle
    if (existingLocations.length === 0) {
      const defaultLocations = [
        {
          location_key: "header",
          location_name: "Ana Menü",
          description: "Site üst kısmındaki ana navigasyon menüsü",
        },
        {
          location_key: "mobile",
          location_name: "Mobil Menü",
          description: "Mobil cihazlar için hamburger menüsü",
        },
        {
          location_key: "footer",
          location_name: "Footer Menü",
          description: "Site alt kısmındaki footer menüsü",
        },
        {
          location_key: "sidebar",
          location_name: "Yan Menü",
          description: "Sayfa yan tarafındaki menü",
        },
      ]

      // Varsayılan konumları ekle
      for (const location of defaultLocations) {
        await sql`
          INSERT INTO menu_locations (location_key, location_name, description, is_active)
          VALUES (${location.location_key}, ${location.location_name}, ${location.description}, true)
          ON CONFLICT (location_key) DO NOTHING
        `
      }

      // Güncellenmiş listeyi getir
      const updatedLocations = await sql`
        SELECT location_key, location_name, description, is_active 
        FROM menu_locations 
        WHERE is_active = true 
        ORDER BY location_name
      `
      return NextResponse.json(updatedLocations)
    }

    return NextResponse.json(existingLocations)
  } catch (error) {
    console.error("Menu locations fetch error:", error)

    // Hata durumunda varsayılan konumları döndür
    const fallbackLocations = [
      {
        location_key: "header",
        location_name: "Ana Menü",
        description: "Site üst kısmındaki ana navigasyon menüsü",
        is_active: true,
      },
      {
        location_key: "mobile",
        location_name: "Mobil Menü",
        description: "Mobil cihazlar için hamburger menüsü",
        is_active: true,
      },
      {
        location_key: "footer",
        location_name: "Footer Menü",
        description: "Site alt kısmındaki footer menüsü",
        is_active: true,
      },
    ]

    return NextResponse.json(fallbackLocations)
  }
}
