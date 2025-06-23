"use client"

import { useState } from "react"
import Link from "next/link"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", name: "Genel", icon: "⚙️", href: "/admin/settings/general" },
    { id: "seo", name: "SEO", icon: "🔍", href: "/admin/seo" },
    { id: "security", name: "Güvenlik", icon: "🔒", href: "/admin/settings/security" },
    { id: "backup", name: "Yedekleme", icon: "💾", href: "/admin/settings/backup" },
    { id: "integrations", name: "Entegrasyonlar", icon: "🔗", href: "/admin/settings/integrations" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Ayarlar</h1>
        <p className="text-gray-600">Site ayarlarını ve konfigürasyonları yönetin</p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl">{tab.icon}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{tab.name}</h3>
                <p className="text-sm text-gray-500">
                  {tab.id === "general" && "Site genel ayarları"}
                  {tab.id === "seo" && "SEO ve meta ayarları"}
                  {tab.id === "security" && "Güvenlik ayarları"}
                  {tab.id === "backup" && "Yedekleme ayarları"}
                  {tab.id === "integrations" && "Üçüncü parti entegrasyonlar"}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Sistem Durumu</p>
              <p className="text-2xl font-bold">Aktif</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Veritabanı</p>
              <p className="text-2xl font-bold">Bağlı</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🗄️</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Son Yedekleme</p>
              <p className="text-2xl font-bold">Bugün</p>
            </div>
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💾</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
