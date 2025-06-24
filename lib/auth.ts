import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

interface AuthPayload {
  userId: number
  role: string
  iat: number // Issued at timestamp
  exp: number // Expiration timestamp
}

const COOKIE_NAME = "admin-session"
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

export function setAuthCookie(userId: number, role: string) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + MAX_AGE_SECONDS
  const tokenPayload: AuthPayload = { userId, role, iat, exp }

  cookies().set(COOKIE_NAME, JSON.stringify(tokenPayload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // 'strict' daha güvenli olabilir ama bazı cross-site senaryolarını etkileyebilir
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  })
}

export function getAuthPayload(request?: NextRequest): AuthPayload | null {
  const cookieStore = request ? request.cookies : cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const payload = JSON.parse(token) as AuthPayload
    // Basit bir son kullanma tarihi kontrolü
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log("Auth cookie expired")
      removeAuthCookie(request) // Süresi dolmuş cookie'yi sil
      return null
    }
    return payload
  } catch (error) {
    console.error("Error parsing auth cookie:", error)
    return null
  }
}

export function removeAuthCookie(request?: NextRequest) {
  const cookieStore = request ? request.cookies : cookies()
  cookieStore.delete(COOKIE_NAME)
}

export function verifyUserRole(
  request: NextRequest,
  allowedRoles: string[],
): { authorized: boolean; userId?: number; userRole?: string; error?: string; status?: number } {
  const payload = getAuthPayload(request)

  if (!payload) {
    return { authorized: false, error: "Unauthorized: No active session.", status: 401 }
  }

  if (!payload.role || !allowedRoles.includes(payload.role)) {
    return {
      authorized: false,
      error: `Forbidden: Role '${payload.role}' is not authorized for this action. Allowed roles: ${allowedRoles.join(", ")}.`,
      status: 403,
      userId: payload.userId,
      userRole: payload.role,
    }
  }

  return { authorized: true, userId: payload.userId, userRole: payload.role }
}
