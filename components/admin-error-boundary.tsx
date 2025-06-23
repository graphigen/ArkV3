"use client"

import React from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AdminErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Admin panel error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h1>
            <p className="text-gray-600 mb-6">
              Admin panelinde beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
            <div className="space-y-3">
              <Button onClick={() => window.location.reload()} className="w-full flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Sayfayı Yenile
              </Button>
              <Button variant="outline" asChild className="w-full flex items-center gap-2">
                <Link href="/admin">
                  <Home className="h-4 w-4" />
                  Ana Sayfaya Dön
                </Link>
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Hata Detayları</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{this.state.error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
