"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function TabConflictWarning() {
  const [showWarning, setShowWarning] = useState(false)
  const [conflictTabs, setConflictTabs] = useState<string[]>([])

  useEffect(() => {
    // Check for tab conflicts using BroadcastChannel
    const channel = new BroadcastChannel("admin-tabs")
    const tabId = Math.random().toString(36).substring(7)

    // Announce this tab
    channel.postMessage({ type: "tab-opened", tabId, url: window.location.href })

    // Listen for other tabs
    channel.onmessage = (event) => {
      if (event.data.type === "tab-opened" && event.data.tabId !== tabId) {
        setConflictTabs((prev) => [...prev, event.data.tabId])
        setShowWarning(true)
      }
    }

    // Cleanup on unmount
    return () => {
      channel.postMessage({ type: "tab-closed", tabId })
      channel.close()
    }
  }, [])

  if (!showWarning) return null

  return (
    <Alert className="mb-4 border-orange-200 bg-orange-50">
      <AlertDescription className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚠️</span>
          <span>
            <strong>Dikkat!</strong> Admin paneli başka bir sekmede açık. Veri çakışmasını önlemek için diğer sekmeleri
            kapatın.
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowWarning(false)}>
          Anladım
        </Button>
      </AlertDescription>
    </Alert>
  )
}
