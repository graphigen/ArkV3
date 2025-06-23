import { type NextRequest, NextResponse } from "next/server"

// Mock integrations data
const mockIntegrations = {
  analytics: {
    googleAnalytics: {
      enabled: false,
      trackingId: "",
      status: "disconnected",
    },
    googleTagManager: {
      enabled: false,
      containerId: "",
      status: "disconnected",
    },
  },
  social: {
    facebook: {
      enabled: false,
      appId: "",
      appSecret: "",
      status: "disconnected",
    },
    twitter: {
      enabled: false,
      apiKey: "",
      apiSecret: "",
      status: "disconnected",
    },
    instagram: {
      enabled: false,
      accessToken: "",
      status: "disconnected",
    },
  },
  email: {
    smtp: {
      enabled: true,
      host: "smtp.gmail.com",
      port: 587,
      username: "noreply@arkkontrol.com",
      status: "connected",
    },
    mailgun: {
      enabled: false,
      apiKey: "",
      domain: "",
      status: "disconnected",
    },
    sendgrid: {
      enabled: false,
      apiKey: "",
      status: "disconnected",
    },
  },
  payment: {
    stripe: {
      enabled: false,
      publishableKey: "",
      secretKey: "",
      status: "disconnected",
    },
    paypal: {
      enabled: false,
      clientId: "",
      clientSecret: "",
      status: "disconnected",
    },
  },
  storage: {
    aws: {
      enabled: false,
      accessKey: "",
      secretKey: "",
      bucket: "",
      region: "us-east-1",
      status: "disconnected",
    },
    cloudinary: {
      enabled: false,
      cloudName: "",
      apiKey: "",
      apiSecret: "",
      status: "disconnected",
    },
  },
  webhooks: [
    {
      id: 1,
      name: "Order Notifications",
      url: "https://example.com/webhook/orders",
      events: ["order.created", "order.updated"],
      status: "active",
      lastTriggered: "2024-01-15T10:30:00Z",
    },
    {
      id: 2,
      name: "User Registration",
      url: "https://example.com/webhook/users",
      events: ["user.created"],
      status: "inactive",
      lastTriggered: null,
    },
  ],
}

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockIntegrations,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch integrations" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate saving integration settings
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Integration settings updated successfully",
      data: { ...mockIntegrations, ...body },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update integration settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, integration, data } = await request.json()

    if (action === "test_connection") {
      // Simulate connection test
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const success = Math.random() > 0.3 // 70% success rate

      return NextResponse.json({
        success,
        message: success ? `${integration} connection test successful` : `${integration} connection test failed`,
      })
    }

    if (action === "add_webhook") {
      const newWebhook = {
        id: Date.now(),
        name: data.name,
        url: data.url,
        events: data.events,
        status: "active",
        lastTriggered: null,
      }

      return NextResponse.json({
        success: true,
        message: "Webhook added successfully",
        data: newWebhook,
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process integration action" }, { status: 500 })
  }
}
