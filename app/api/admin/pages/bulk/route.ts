import { type NextRequest, NextResponse } from "next/server"
import { deletePage, updatePage } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { action, pageIds, data } = await request.json()

    if (!action || !pageIds || !Array.isArray(pageIds)) {
      return NextResponse.json({ error: "Geçersiz istek parametreleri" }, { status: 400 })
    }

    const results = []

    switch (action) {
      case "delete":
        for (const id of pageIds) {
          const success = await deletePage(id)
          results.push({ id, success })
        }
        break

      case "update_status":
        if (!data?.status) {
          return NextResponse.json({ error: "Durum bilgisi gereklidir" }, { status: 400 })
        }
        for (const id of pageIds) {
          const result = await updatePage(id, { status: data.status })
          results.push({ id, success: !!result })
        }
        break

      case "update_language":
        if (!data?.language) {
          return NextResponse.json({ error: "Dil bilgisi gereklidir" }, { status: 400 })
        }
        for (const id of pageIds) {
          const result = await updatePage(id, { language: data.language })
          results.push({ id, success: !!result })
        }
        break

      default:
        return NextResponse.json({ error: "Desteklenmeyen işlem" }, { status: 400 })
    }

    const successCount = results.filter((r) => r.success).length
    const failCount = results.length - successCount

    return NextResponse.json({
      success: true,
      message: `${successCount} sayfa başarıyla işlendi${failCount > 0 ? `, ${failCount} sayfa başarısız` : ""}`,
      results,
    })
  } catch (error) {
    console.error("Bulk operation error:", error)
    return NextResponse.json({ error: "Toplu işlem gerçekleştirilirken hata oluştu" }, { status: 500 })
  }
}
