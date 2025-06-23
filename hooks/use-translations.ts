"use client"

import { useState, useEffect } from "react"

type Translations = Record<string, string>

export function useTranslations(language = "tr") {
  const [translations, setTranslations] = useState<Translations>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTranslations(language)
  }, [language])

  const fetchTranslations = async (lang: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/i18n/${lang}`)
      if (response.ok) {
        const data = await response.json()
        setTranslations(data.translations || {})
      }
    } catch (error) {
      console.error("Error fetching translations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const t = (key: string, fallback?: string): string => {
    return translations[key] || fallback || key
  }

  return { t, translations, isLoading }
}
