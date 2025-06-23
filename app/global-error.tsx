"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Sistem Hatası</h1>
            <p className="text-gray-600 mb-6">Beklenmeyen bir sistem hatası oluştu. Lütfen sayfayı yenileyin.</p>
            <Button onClick={reset} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Tekrar Dene
            </Button>
            {process.env.NODE_ENV === "development" && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Hata Detayları</summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">{error.stack}</pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}
