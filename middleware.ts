import { type NextRequest, NextResponse } from "next/server"
import { verifyUserRole } from "@/lib/auth"

// Rol tanımları (örnek, projenize göre genişletilebilir)
const ROLES = {
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
}

// Hangi yolların hangi rollere izin verdiğini tanımlayan bir yapı
// Daha karmaşık senaryolar için bu dış bir konfigürasyon dosyasına taşınabilir
const PATH_ROLES: Record<string, string[]> = {
  "/api/admin/users": [ROLES.ADMIN], // Kullanıcı yönetimi sadece admin
  "/api/admin/users/.*": [ROLES.ADMIN], // /api/admin/users/:id gibi yollar
  "/api/admin/settings": [ROLES.ADMIN], // Ayarlar sadece admin
  "/api/admin/settings/.*": [ROLES.ADMIN],
  "/api/admin/seo/settings": [ROLES.ADMIN],
  "/api/admin/i18n/settings": [ROLES.ADMIN],
  "/api/admin/analytics/settings": [ROLES.ADMIN],
  // Diğer yollar için varsayılan olarak en azından editor rolü gerekebilir
  // "/api/admin/pages": [ROLES.ADMIN, ROLES.EDITOR],
  // "/api/admin/blog": [ROLES.ADMIN, ROLES.EDITOR],
  // ... diğer tanımlamalar
}

// Bu fonksiyon, verilen path'in PATH_ROLES'deki bir pattern ile eşleşip eşleşmediğini kontrol eder
function getRequiredRolesForPath(pathname: string): string[] {
  for (const pathPattern in PATH_ROLES) {
    const regex = new RegExp(`^${pathPattern}$`)
    if (regex.test(pathname)) {
      return PATH_ROLES[pathPattern]
    }
  }
  // Eğer özel bir rol tanımlanmamışsa, varsayılan olarak en azından editor rolü gereksin
  // Veya daha kısıtlayıcı bir varsayılan (örn: sadece admin) veya daha serbest (örn: tüm roller)
  // Projenizin güvenlik politikasına göre bu varsayılanı ayarlayın.
  // Şimdilik, tanımlanmamış yollar için admin ve editor'e izin verelim.
  return [ROLES.ADMIN, ROLES.EDITOR, ROLES.VIEWER] // Veya daha kısıtlı [ROLES.ADMIN, ROLES.EDITOR]
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/api/admin")) {
    // Login ve logout API'lerini hariç tut
    if (pathname.startsWith("/api/admin/auth/login") || pathname.startsWith("/api/admin/auth/logout")) {
      return NextResponse.next()
    }

    const requiredRoles = getRequiredRolesForPath(pathname)
    const authResult = await verifyUserRole(request, requiredRoles)

    if (!authResult.authorized) {
      console.warn(
        `Middleware: Authorization failed for ${pathname}. UserID: ${authResult.userId}, UserRole: ${authResult.userRole}. Error: ${authResult.error}`,
      )
      return NextResponse.json({ error: authResult.error }, { status: authResult.status || 403 })
    }

    // İsteğe kullanıcı bilgilerini header olarak ekle
    const requestHeaders = new Headers(request.headers)
    if (authResult.userId) requestHeaders.set("x-user-id", authResult.userId.toString())
    if (authResult.userRole) requestHeaders.set("x-user-role", authResult.userRole)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/admin/:path*", // API routes for admin
  ],
}
