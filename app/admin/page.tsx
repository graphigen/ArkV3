"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  FileText,
  PenTool,
  ImageIcon,
  Settings,
  Users,
  MessageSquare,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    pages: 0,
    posts: 0,
    visitors: 0,
    messages: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined") {
      const isLoggedIn = sessionStorage.getItem("admin-logged-in")
      if (isLoggedIn !== "true") {
        router.push("/admin/login")
        return
      }
    }

    // Fetch stats
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/dashboard/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        // Fallback data
        setStats({
          pages: 14,
          posts: 3,
          visitors: 1250,
          messages: 8,
        })
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
      // Fallback data
      setStats({
        pages: 14,
        posts: 3,
        visitors: 1250,
        messages: 8,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Yeni Sayfa",
      description: "Yeni bir sayfa oluştur",
      icon: FileText,
      href: "/admin/pages/new",
      gradient: "bg-gradient-to-r from-blue-500 to-blue-600",
    },
    {
      title: "Blog Yazısı",
      description: "Yeni blog yazısı ekle",
      icon: PenTool,
      href: "/admin/blog/new",
      gradient: "bg-gradient-to-r from-green-500 to-green-600",
    },
    {
      title: "Medya Yükle",
      description: "Resim veya dosya yükle",
      icon: ImageIcon,
      href: "/admin/media",
      gradient: "bg-gradient-to-r from-purple-500 to-purple-600",
    },
    {
      title: "Site Ayarları",
      description: "Genel ayarları düzenle",
      icon: Settings,
      href: "/admin/settings",
      gradient: "bg-gradient-to-r from-orange-500 to-orange-600",
    },
  ]

  const recentActivity = [
    { action: "Yeni sayfa oluşturuldu", item: "Hakkımızda", time: "2 saat önce", icon: FileText },
    { action: "Blog yazısı yayınlandı", item: "Robotik Kaynak", time: "5 saat önce", icon: PenTool },
    { action: "Menü güncellendi", item: "Ana Menü", time: "1 gün önce", icon: Settings },
    { action: "Medya yüklendi", item: "hero-image.jpg", time: "2 gün önce", icon: ImageIcon },
  ]

  const systemStatus = [
    { name: "Veritabanı", status: "Aktif", color: "green" },
    { name: "API Servisleri", status: "Çalışıyor", color: "green" },
    { name: "Son Yedekleme", status: "2 saat önce", color: "blue" },
  ]

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Dashboard yükleniyor..." />
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Hoş Geldiniz! 👋</h1>
            <p className="text-blue-100 text-base sm:text-lg">ARK KONTROL Admin Paneline başarıyla giriş yaptınız.</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center">
              <Activity className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Toplam Sayfa</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.pages}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2 bu ay
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Blog Yazısı</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.posts}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <PenTool className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +1 bu hafta
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Ziyaretçi</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.visitors}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% bu ay
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Mesaj</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.messages}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-orange-600 text-sm font-medium">3 yeni</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <Link
                key={index}
                href={action.href}
                className={`group relative overflow-hidden rounded-xl p-6 text-white transition-all duration-200 hover:scale-105 ${action.gradient}`}
              >
                <div className="relative z-10">
                  <div className="mb-3">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                  <ArrowUpRight className="h-4 w-4 mt-2 opacity-70" />
                </div>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Son Aktiviteler</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => {
              const IconComponent = activity.icon
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.item}</p>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{activity.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sistem Durumu</h2>
          <div className="space-y-4">
            {systemStatus.map((system, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-xl bg-${system.color}-50`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${system.color}-500 rounded-full`}></div>
                  <span className="font-medium text-gray-900">{system.name}</span>
                </div>
                <span className={`text-${system.color}-600 font-medium`}>{system.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
