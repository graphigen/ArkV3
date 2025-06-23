"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Yeni iletişim mesajı",
      message: "Mehmet Yılmaz'dan yeni bir mesaj geldi",
      type: "info",
      time: "2 dakika önce",
      unread: true,
    },
    {
      id: 2,
      title: "SEO uyarısı",
      message: "3 sayfada meta description eksik",
      type: "warning",
      time: "1 saat önce",
      unread: true,
    },
    {
      id: 3,
      title: "Yedekleme tamamlandı",
      message: "Günlük veritabanı yedeği başarıyla alındı",
      type: "success",
      time: "3 saat önce",
      unread: false,
    },
  ])

  const unreadCount = notifications.filter((n) => n.unread).length

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative p-2">
          <span className="text-xl">🔔</span>
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">🔔 Bildirimler</CardTitle>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Tümünü okundu işaretle
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-4">Yeni bildirim yok</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.unread ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">
                      {notification.type === "warning" ? "⚠️" : notification.type === "success" ? "✅" : "ℹ️"}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                    {notification.unread && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
