"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"
import type { Page } from "@/lib/database"

interface DynamicPageProps {
  slug: string
  fallbackContent?: React.ReactNode
}

export default function DynamicPage({ slug, fallbackContent }: DynamicPageProps) {
  const [page, setPage] = useState<Page | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await fetch(`/api/pages${slug}`)

        if (response.ok) {
          const pageData = await response.json()
          setPage(pageData)
        } else if (response.status === 404) {
          setError("Sayfa bulunamadı")
        } else {
          setError("Sayfa yüklenirken hata oluştu")
        }
      } catch (err) {
        setError("Bağlantı hatası")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPage()
  }, [slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      fallbackContent || (
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Sayfa Bulunamadı</CardTitle>
              <CardDescription>Aradığınız sayfa mevcut değil veya kaldırılmış olabilir.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      )
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Page Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{page.title}</h1>

          {page.excerpt && <p className="text-xl text-muted-foreground mb-4">{page.excerpt}</p>}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {page.published_at && (
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(page.published_at).toLocaleDateString("tr-TR")}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>{page.views} görüntülenme</span>
            </div>

            <Badge variant="outline" className="uppercase">
              {page.language}
            </Badge>
          </div>
        </header>

        {/* Featured Image */}
        {page.featured_image && (
          <div className="mb-8">
            <img
              src={page.featured_image || "/placeholder.svg"}
              alt={page.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Page Content */}
        <div className="prose prose-lg max-w-none">
          {page.content ? <div dangerouslySetInnerHTML={{ __html: page.content }} /> : <p>İçerik bulunamadı.</p>}
        </div>

        {/* Custom CSS */}
        {page.custom_css && <style dangerouslySetInnerHTML={{ __html: page.custom_css }} />}

        {/* Custom JS */}
        {page.custom_js && <script dangerouslySetInnerHTML={{ __html: page.custom_js }} />}
      </article>
    </div>
  )
}
