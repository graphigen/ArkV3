"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, X, Phone, Mail, MapPin, Wrench, Cog, Settings, Zap, Target, Move, RotateCw, Package } from 'lucide-react'
import ContactModal from "./contact-modal"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const pathname = usePathname()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Scroll to top when pathname changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  const navigation = [
    { name: "Anasayfa", href: "/" },
    {
      name: "Ürün ve Çözümler",
      href: "#",
      dropdown: [
        {
          name: "Tiger Torch Temizleme Üniteleri",
          href: "/urunler/tiger-torc",
          icon: <Zap className="h-4 w-4" />,
          description: "Plazma kesim torçları için temizleme sistemleri",
        },
        {
          name: "Plazma Kesim Sarf Malzemeleri",
          href: "/urunler/plazma-sarf",
          icon: <Package className="h-4 w-4" />,
          description: "Yedek parçalar ve sarf malzemeleri",
        },
        {
          name: "ABB Robot Servis ve Bakım",
          href: "/urunler/abb-servis",
          icon: <Settings className="h-4 w-4" />,
          description: "Resmi ABB servis partneri hizmetleri",
        },
        {
          name: "Fronius Kaynak Makina Servis",
          href: "/urunler/fronius-servis",
          icon: <Wrench className="h-4 w-4" />,
          description: "Fronius kaynak makineleri bakım ve onarım",
        },
      ],
    },
    {
      name: "Projelerimiz",
      href: "#",
      dropdown: [
        {
          name: "Robotik Kaynak Hücreleri",
          href: "/projeler/robotik-kaynak",
          icon: <Cog className="h-4 w-4" />,
          description: "ABB ve KUKA robotları ile kaynak sistemleri",
        },
        {
          name: "Fikstur Sistemleri",
          href: "/projeler/fikstur",
          icon: <Target className="h-4 w-4" />,
          description: "Özel tasarım sabitleme ve fikstur çözümleri",
        },
        {
          name: "Pozisyoner Sistemleri",
          href: "/projeler/pozisyoner",
          icon: <RotateCw className="h-4 w-4" />,
          description: "Hassas döndürme ve konumlandırma sistemleri",
        },
        {
          name: "Robotik Slider Sistemleri",
          href: "/projeler/slider",
          icon: <Move className="h-4 w-4" />,
          description: "Lineer hareket ve genişletme sistemleri",
        },
        {
          name: "Mekanize Çözümler",
          href: "/projeler/mekanize",
          icon: <Settings className="h-4 w-4" />,
          description: "Endüstriyel otomasyon ve mekanizasyon",
        },
        {
          name: "Lazer Kesim Tezgahları",
          href: "/projeler/lazer-kesim",
          icon: <Zap className="h-4 w-4" />,
          description: "Fiber lazer kesim makineleri",
        },
      ],
    },
    { name: "Blog", href: "/blog" },
    { name: "İletişim", href: "/iletisim" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="text-2xl font-bold text-gray-900">
                ARK<span className="text-orange-500">KONTROL</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.dropdown ? (
                    <div className="relative">
                      <button className="flex items-center text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium py-2">
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" />
                      </button>

                      {/* Enhanced Dropdown Menu */}
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                        <div className="absolute -top-1 left-6 w-2 h-2 bg-white border-l border-t border-gray-100 transform rotate-45"></div>
                        {item.dropdown.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="flex items-start px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors duration-200 group/item"
                          >
                            <div className="flex-shrink-0 mt-1 mr-3 text-gray-400 group-hover/item:text-orange-500">
                              {subItem.icon}
                            </div>
                            <div>
                              <div className="font-medium text-sm">{subItem.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{subItem.description}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-gray-700 hover:text-orange-500 transition-colors duration-200 font-medium ${
                        pathname === item.href ? "text-orange-500" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* CTA Button */}
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="ml-8 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
              >
                Teklif Al
              </button>
            </nav>

            {/* Mobile menu button */}
            <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Off-canvas */}
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Off-canvas Menu */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 lg:hidden transform transition-transform duration-300 ease-out shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="text-xl font-bold text-gray-900">
                ARK<span className="text-orange-500">KONTROL</span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-6 w-6 text-gray-700" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex flex-col h-full">
              <nav className="flex-1 px-6 py-4 space-y-2 overflow-y-auto">
                {navigation.map((item, index) => (
                  <div key={item.name} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                    {item.dropdown ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
                          onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {/* Dropdown Content */}
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            activeDropdown === item.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="pl-4 pt-2 space-y-1">
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="flex items-start px-4 py-3 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-200 group"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <div className="flex-shrink-0 mt-0.5 mr-3 text-gray-400 group-hover:text-orange-500 transition-colors">
                                  {subItem.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-sm">{subItem.name}</div>
                                  <div className="text-xs text-gray-500 mt-1 leading-relaxed">
                                    {subItem.description}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block px-4 py-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200 ${
                          pathname === item.href ? "text-orange-500 bg-orange-50" : ""
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* CTA Section */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={() => {
                    setIsContactModalOpen(true)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Teklif Al
                </button>

                {/* Contact Info */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-orange-500" />
                    (212) 407 01 02
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 text-orange-500" />
                    info@arkkontrol.com
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main>{children}</main>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="text-2xl font-bold mb-6">
                ARK<span className="text-orange-500">KONTROL</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                2008'den beri metalin işlendiği tüm üretim sektörlerinde yenilikçi robotik kaynak ve lazer kesim
                çözümleri konusunda uzmanlaşmış firmayız. ABB'nin Türkiye'de TEK yetkili kaynak değer sağlayıcısıyız.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-orange-500" />
                  <span className="text-gray-300">İkitelli OSB, Başakşehir, İstanbul</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-orange-500" />
                  <span className="text-gray-300">(212) 407 01 02</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-orange-500" />
                  <span className="text-gray-300">info@arkkontrol.com</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Çözümler</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/projeler/robotik-kaynak"
                    className="text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    Robotik Kaynak Hücreleri
                  </Link>
                </li>
                <li>
                  <Link href="/projeler/lazer-kesim" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Lazer Kesim Tezgahları
                  </Link>
                </li>
                <li>
                  <Link href="/projeler/fikstur" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Fikstur Sistemleri
                  </Link>
                </li>
                <li>
                  <Link href="/projeler/mekanize" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Mekanize Çözümler
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Hizmetler</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/urunler/abb-servis" className="text-gray-300 hover:text-orange-500 transition-colors">
                    ABB Robot Servis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/urunler/fronius-servis"
                    className="text-gray-300 hover:text-orange-500 transition-colors"
                  >
                    Fronius Kaynak Servis
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda" className="text-gray-300 hover:text-orange-500 transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="text-gray-300 hover:text-orange-500 transition-colors">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Arkkontrol Robotik Otomasyon Sistemleri. Tüm hakları saklıdır.
              </p>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <span className="text-gray-400 text-sm">Resmi Partner:</span>
                <div className="flex items-center space-x-4 text-gray-400">
                  <span className="text-sm font-medium">ABB</span>
                  <span className="text-sm font-medium">FRONIUS</span>
                  <span className="text-sm font-medium">KUKA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
