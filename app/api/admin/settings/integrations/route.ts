import { type NextRequest, NextResponse } from "next/server"
import {
  getAllIntegrationConfigs,
  updateIntegrationConfig,
  getAllWebhooks,
  createWebhook,
  updateWebhook,
  deleteWebhook,
  type IntegrationConfig,
  type Webhook,
} from "@/lib/database" // Güncellenmiş import

// Helper function to transform flat DB results to nested structure for frontend
function formatIntegrationsForFrontend(configs: IntegrationConfig[], webhooks: Webhook[]) {
  const formatted: any = {
    analytics: {},
    social: {},
    email: {},
    payment: {},
    storage: {},
    webhooks: webhooks.map((wh) => ({
      ...wh,
      // Ensure lastTriggered is null or a string as expected by frontend
      lastTriggered: wh.last_triggered_at ? wh.last_triggered_at.toISOString() : null,
    })),
  }

  configs.forEach((config) => {
    if (!formatted[config.category]) {
      formatted[config.category] = {}
    }
    formatted[config.category][config.service_key] = {
      enabled: config.is_enabled,
      status: config.status,
      ...config.config, // Spread the actual config object (e.g., trackingId)
    }
  })
  return formatted
}

export async function GET() {
  try {
    const integrationConfigs = await getAllIntegrationConfigs()
    const webhooks = await getAllWebhooks()
    const formattedData = formatIntegrationsForFrontend(integrationConfigs, webhooks)
    return NextResponse.json({
      success: true,
      data: formattedData,
    })
  } catch (error) {
    console.error("API GET Error - Failed to fetch integrations:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch integrations" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    // body is expected to be in the nested format like mockIntegrations

    for (const category in body) {
      if (category === "webhooks") {
        // Webhook updates are handled by their specific POST/DELETE actions for now
        // Or, if PUT should handle webhook updates, logic needs to be added here
        // For simplicity, we'll assume webhooks are managed via POST/DELETE below
        continue
      }

      if (body.hasOwnProperty(category) && typeof body[category] === "object") {
        for (const serviceKey in body[category]) {
          if (body[category].hasOwnProperty(serviceKey)) {
            const serviceData = body[category][serviceKey]
            const { enabled, status, ...config } = serviceData
            await updateIntegrationConfig(category, serviceKey, config, enabled, status)
          }
        }
      }
    }

    // Re-fetch and return the updated state
    const integrationConfigs = await getAllIntegrationConfigs()
    const currentWebhooks = await getAllWebhooks() // Assuming webhooks aren't changed by this PUT
    const formattedData = formatIntegrationsForFrontend(integrationConfigs, currentWebhooks)

    return NextResponse.json({
      success: true,
      message: "Integration settings updated successfully",
      data: formattedData,
    })
  } catch (error) {
    console.error("API PUT Error - Failed to update integration settings:", error)
    return NextResponse.json({ success: false, error: "Failed to update integration settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, integration, data, webhookId } = body

    if (action === "test_connection") {
      // Simulate connection test - In a real scenario, this would involve actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const success = Math.random() > 0.2 // 80% success rate for mock

      // Update status in DB if needed (optional)
      // For example: await updateIntegrationConfig(category, serviceKey, currentConfig, currentEnabled, success ? 'connected' : 'error');
      // This requires knowing category/serviceKey for 'integration' string.

      return NextResponse.json({
        success,
        message: success ? `${integration} connection test successful` : `${integration} connection test failed`,
      })
    }

    if (action === "add_webhook") {
      if (!data || !data.name || !data.url) {
        return NextResponse.json({ success: false, error: "Missing required fields for webhook" }, { status: 400 })
      }
      const newWebhookData = {
        name: data.name,
        url: data.url,
        events: data.events || [],
        status: data.status || "active",
        secret: data.secret,
      }
      const newWebhook = await createWebhook(newWebhookData)
      return NextResponse.json({
        success: true,
        message: "Webhook added successfully",
        data: newWebhook,
      })
    }

    if (action === "edit_webhook") {
      if (!webhookId || !data) {
        return NextResponse.json({ success: false, error: "Missing webhook ID or data for editing" }, { status: 400 })
      }
      const updatedWebhook = await updateWebhook(webhookId, data)
      if (!updatedWebhook) {
        return NextResponse.json(
          { success: false, error: `Webhook with ID ${webhookId} not found or failed to update.` },
          { status: 404 },
        )
      }
      return NextResponse.json({ success: true, message: "Webhook updated successfully", data: updatedWebhook })
    }

    if (action === "delete_webhook") {
      if (!webhookId) {
        return NextResponse.json({ success: false, error: "Missing webhook ID for deletion" }, { status: 400 })
      }
      const success = await deleteWebhook(webhookId)
      if (!success) {
        return NextResponse.json(
          { success: false, error: `Failed to delete webhook with ID ${webhookId}. It might not exist.` },
          { status: 404 },
        )
      }
      return NextResponse.json({ success: true, message: "Webhook deleted successfully" })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("API POST Error - Failed to process integration action:", error)
    return NextResponse.json({ success: false, error: "Failed to process integration action" }, { status: 500 })
  }
}
