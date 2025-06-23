import { type NextRequest, NextResponse } from "next/server"

// Mock security settings data
const mockSecuritySettings = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiry: 90,
    preventReuse: 5,
  },
  twoFactorAuth: {
    enabled: false,
    method: "app", // 'app', 'sms', 'email'
    backupCodes: 8,
  },
  loginSecurity: {
    maxAttempts: 5,
    lockoutDuration: 30,
    sessionTimeout: 120,
    requireEmailVerification: true,
  },
  ipRestrictions: {
    enabled: false,
    allowedIPs: ["192.168.1.0/24"],
    blockedIPs: [],
  },
  auditLog: {
    enabled: true,
    retentionDays: 90,
    logFailedAttempts: true,
    logSuccessfulLogins: true,
  },
}

const mockSecurityLogs = [
  {
    id: 1,
    timestamp: "2024-01-15T10:30:00Z",
    event: "login_success",
    user: "admin@example.com",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
  {
    id: 2,
    timestamp: "2024-01-15T09:15:00Z",
    event: "login_failed",
    user: "unknown@example.com",
    ip: "203.0.113.1",
    userAgent: "curl/7.68.0",
  },
  {
    id: 3,
    timestamp: "2024-01-15T08:45:00Z",
    event: "password_changed",
    user: "admin@example.com",
    ip: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        settings: mockSecuritySettings,
        logs: mockSecurityLogs,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch security settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Simulate saving security settings
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      message: "Security settings updated successfully",
      data: { ...mockSecuritySettings, ...body },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update security settings" }, { status: 500 })
  }
}
