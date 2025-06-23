"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuItem } from "@/lib/menu"

interface DynamicMenuProps {
  location: string
  language?: string
  className?: string
  itemClassName?: string
  activeClassName?: string
}

export default function DynamicMenu({
  location,
  language = "tr",
  className,
  itemClassName,
  activeClassName,
}: DynamicMenuProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(`/api/menus/${location}?language=${language}`)
        if (response.ok) {
          const items = await response.json()
          setMenuItems(items)
        }
      } catch (error) {
        console.error("Error fetching menu items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMenuItems()
  }, [location, language])

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExternal = item.url?.startsWith("http")

    const linkProps = {
      href: item.url || "#",
      className: cn(
        itemClassName,
        "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        activeClassName,
      ),
      ...(item.target === "_blank" && { target: "_blank", rel: "noopener noreferrer" }),
    }

    const content = (
      <>
        {item.icon && <span className="text-lg">{item.icon}</span>}
        <span>{item.title}</span>
        {hasChildren && <ChevronDown className="h-4 w-4 ml-auto" />}
        {isExternal && <span className="text-xs opacity-60">↗</span>}
      </>
    )

    return (
      <li key={item.id} className={cn("relative", depth > 0 && "ml-4")}>
        {item.url ? <Link {...linkProps}>{content}</Link> : <div className={linkProps.className}>{content}</div>}

        {hasChildren && (
          <ul className="mt-1 space-y-1 border-l border-border ml-4 pl-4">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  if (isLoading) {
    return (
      <nav className={className}>
        <ul className="space-y-1">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="animate-pulse">
              <div className="h-8 bg-muted rounded-md"></div>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  if (menuItems.length === 0) {
    return null
  }

  return (
    <nav className={className}>
      <ul className="space-y-1">{menuItems.map((item) => renderMenuItem(item))}</ul>
    </nav>
  )
}
