"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

type Language = {
  code: string
  name: string
  native_name: string
  flag_emoji?: string
}

interface LanguageSwitcherProps {
  currentLanguage?: string
  className?: string
}

export default function LanguageSwitcher({ currentLanguage = "tr", className }: LanguageSwitcherProps) {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetchLanguages()
  }, [])

  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/admin/i18n/languages")
      if (response.ok) {
        const data = await response.json()
        setLanguages(data)
      }
    } catch (error) {
      console.error("Error fetching languages:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLanguageChange = (languageCode: string) => {
    // Store language preference
    localStorage.setItem("preferred-language", languageCode)

    // Update URL based on strategy
    let newPath = pathname

    // Remove current language prefix if exists
    const currentLangPrefix = `/${currentLanguage}`
    if (pathname.startsWith(currentLangPrefix)) {
      newPath = pathname.slice(currentLangPrefix.length) || "/"
    }

    // Add new language prefix (except for default language)
    if (languageCode !== "tr") {
      newPath = `/${languageCode}${newPath}`
    }

    router.push(newPath)
  }

  const currentLang = languages.find((lang) => lang.code === currentLanguage)

  if (isLoading || languages.length === 0) {
    return (
      <Button variant="ghost" size="sm" className={className} disabled>
        <Globe className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={className}>
          <span className="mr-2">{currentLang?.flag_emoji || "🌐"}</span>
          <span className="hidden sm:inline">{currentLang?.native_name || "Türkçe"}</span>
          <span className="sm:hidden">{currentLang?.code.toUpperCase() || "TR"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={currentLanguage === language.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{language.flag_emoji}</span>
            <span>{language.native_name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
