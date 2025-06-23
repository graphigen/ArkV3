import { type NextRequest, NextResponse } from "next/server"
import { updateIntegrationConfig } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { apiKey, propertyId, serviceAccountKey } = await request.json()

    if (!apiKey || !propertyId) {
      return NextResponse.json({ error: "API Key ve Property ID gereklidir" }, { status: 400 })
    }

    // Test Google Analytics connection
    const testResult = await testGoogleAnalyticsConnection(apiKey, propertyId)

    if (!testResult.success) {
      return NextResponse.json({ error: testResult.error || "Google Analytics bağlantısı başarısız" }, { status: 400 })
    }

    // Save configuration
    const config = {
      api_key: apiKey,
      property_id: propertyId,
      service_account_key: serviceAccountKey || null,
      connected_at: new Date().toISOString(),
    }

    const result = await updateIntegrationConfig("analytics", "google_analytics", config, true, "connected")

    if (!result) {
      return NextResponse.json({ error: "Konfigürasyon kaydedilemedi" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Google Analytics başarıyla bağlandı",
      data: result,
    })
  } catch (error) {
    console.error("Google Analytics connection error:", error)
    return NextResponse.json({ error: "Bağlantı kurulurken hata oluştu" }, { status: 500 })
  }
}

async function testGoogleAnalyticsConnection(
  apiKey: string,
  propertyId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Mock test - gerçek Google Analytics API testi
    // Bu kısımda gerçek Google Analytics API'sine istek atılabilir

    if (!apiKey.startsWith("AIza") && !apiKey.startsWith("G-")) {
      return { success: false, error: "Geçersiz API Key formatı" }
    }

    if (!propertyId.match(/^\d+$/)) {
      return { success: false, error: "Geçersiz Property ID formatı" }
    }

    // Simulated success
    return { success: true }
  } catch (error) {
    return { success: false, error: "Bağlantı testi başarısız" }
  }
}

export async function DELETE() {
  try {
    const result = await updateIntegrationConfig("analytics", "google_analytics", {}, false, "disconnected")

    return NextResponse.json({
      success: true,
      message: "Google Analytics bağlantısı kesildi",
    })
  } catch (error) {
    console.error("Google Analytics disconnect error:", error)
    return NextResponse.json({ error: "Bağlantı kesilirken hata oluştu" }, { status: 500 })
  }
}
