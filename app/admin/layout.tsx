"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  FileText,
  PenTool,
  MessageSquare,
  ImageIcon,
  Menu,
  Users,
  BarChart3,
  Search,
  Settings,
  Shield,
  Database,
  Plug,
  Globe,
  ChevronDown,
  LogOut,
  User,
  Bell,
} from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Pages",
    href: "/admin/pages",
    icon: FileText,
    badge: "14",
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: PenTool,
    badge: "3",
  },
  {
    name: "Forms",
    href: "/admin/forms",
    icon: MessageSquare,
    badge: "2",
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    name: "Menus",
    href: "/admin/menus",
    icon: Menu,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    badge: "2",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    name: "SEO",
    href: "/admin/seo",
    icon: Search,
  },
  {
    name: "I18n",
    href: "/admin/i18n",
    icon: Globe,
  },
]

const settingsNavigation = [
  {
    name: "General",
    href: "/admin/settings/general",
    icon: Settings,
  },
  {
    name: "Security",
    href: "/admin/settings/security",
    icon: Shield,
  },
  {
    name: "Backup",
    href: "/admin/settings/backup",
    icon: Database,
  },
  {
    name: "Integrations",
    href: "/admin/settings/integrations",
    icon: Plug,
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage.getItem("admin-logged-in")
      if (isLoggedIn === "true") {
        setIsAuthenticated(true)
      } else if (pathname !== "/admin/login") {
        router.push("/admin/login")
        return
      }
    }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("admin-logged-in")
    }
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (pathname === "/admin/login") {
    return children
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AK</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ARK KONTROL</span>
            </div>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <ScrollArea className="flex-1 px-2">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}`}
                      />
                      {item.name}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}

                <Separator className="my-4" />

                <div className="px-2 py-2">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
                </div>

                {settingsNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-5 w-5 ${isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"}`}
                      />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
