import { cookies } from "next/headers"

export function setAuthCookie(token: string) {
  cookies().set("admin-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export function getAuthCookie() {
  return cookies().get("admin-token")?.value
}

export function removeAuthCookie() {
  cookies().delete("admin-token")
}

export function isAuthenticated(): boolean {
  const token = getAuthCookie()
  return !!token && token === "admin-authenticated"
}
