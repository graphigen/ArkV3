export const config = {
  database: {
    url: process.env.DATABASE_URL || "",
    isConnected: !!process.env.DATABASE_URL,
  },
  site: {
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    name: "ARK KONTROL",
  },
  admin: {
    secretKey: process.env.ADMIN_SECRET_KEY || "arkkontrol-admin-secret-2024",
  },
  auth: {
    stackProjectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    stackPublishableKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    stackSecretKey: process.env.STACK_SECRET_SERVER_KEY,
  },
}

export function validateConfig() {
  const missing = []
  const warnings = []

  if (!process.env.DATABASE_URL) {
    missing.push("DATABASE_URL")
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    warnings.push("NEXT_PUBLIC_SITE_URL not set - using localhost")
  }

  if (!process.env.ADMIN_SECRET_KEY) {
    warnings.push("ADMIN_SECRET_KEY not set - using default")
  }

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:", missing)
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  if (warnings.length > 0) {
    console.warn("⚠️ Configuration warnings:", warnings)
  }

  console.log("✅ Configuration validated - Database connected:", !!process.env.DATABASE_URL)
  return true
}
