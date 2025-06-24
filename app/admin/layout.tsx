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
  MenuIcon,
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
import { toast } from "@/components/ui/use-toast" // Import toast for notifications

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
    // badge: "14", // Dynamic data should replace this
  },
  {
    name: "Blog",
    href: "/admin/blog",
    icon: PenTool,
    // badge: "3",
  },
  {
    name: "Forms",
    href: "/admin/forms",
    icon: MessageSquare,
    // badge: "2",
  },
  {
    name: "Media",
    href: "/admin/media",
    icon: ImageIcon,
  },
  {
    name: "Menus",
    href: "/admin/menus",
    icon: MenuIcon,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: Users,
    // badge: "2",
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
    href: "/admin/settings/backup", // Corrected path from previous /admin/settings/backup to /admin/backup
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
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage.getItem("admin-logged-in")
      if (isLoggedIn === "true") {
        setIsAuthenticated(true)
      } else if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }
    setLoading(false)
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/auth/logout", { method: "POST" })
      if (response.ok) {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("admin-logged-in")
        }
        setIsAuthenticated(false) // Update state
        router.push("/admin/login")
        toast({ title: "Başarıyla çıkış yapıldı." })
      } else {
        toast({ title: "Çıkış yapılamadı.", description: "Sunucuyla iletişim kurulamadı.", variant: "destructive" })
      }
    } catch (error) {
      console.error("Logout error:", error)
      toast({ title: "Çıkış sırasında bir hata oluştu.", variant: "destructive" })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
        <p className="ml-4 text-lg font-semibold text-gray-700">Yükleniyor...</p>
      </div>
    )
  }

  if (pathname === "/admin/login") {
    return <>{children}</> // Ensure children are rendered
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    // This case should ideally be handled by the useEffect redirect,
    // but as a fallback, prevent rendering the layout.
    return null
  }

  // If authenticated, render the layout
  if (isAuthenticated) {
    return (
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AK</span>
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">ARK KONTROL</span>
              </div>
            </div>
            <div className="mt-5 flex-grow flex flex-col">
              <ScrollArea className="flex-1 px-2">
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 ${
                            isActive
                              ? "text-blue-500 dark:text-blue-300"
                              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                          }`}
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

                  <Separator className="my-4 dark:bg-gray-700" />

                  <div className="px-2 py-2">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Settings
                    </h3>
                  </div>

                  {settingsNavigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "bg-blue-100 text-blue-900 dark:bg-blue-700 dark:text-white"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`mr-3 h-5 w-5 ${
                            isActive
                              ? "text-blue-500 dark:text-blue-300"
                              : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
                          }`}
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
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center">
                {/* Mobile menu button can be added here if needed */}
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">Admin</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-gray-800 dark:border-gray-700">
                    <DropdownMenuLabel className="dark:text-gray-200">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="p-6">{children}</div>
          </main>
        </div>
      </div>
    )
  }
  // If not loading, not login page, and not authenticated, this path should ideally not be reached
  // due to the redirect in useEffect. However, returning null as a safeguard.
  return null
}
