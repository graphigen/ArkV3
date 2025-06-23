// Admin panel için veri yönetimi
export interface Page {
  id: string
  title: string
  slug: string
  content: string
  status: "published" | "draft"
  seoTitle?: string
  seoDescription?: string
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface SiteSettings {
  siteName: string
  siteDescription: string
  siteUrl: string
  logo: string
  favicon: string
  contactEmail: string
  contactPhone: string
  address: string
  socialMedia: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  analytics: {
    googleAnalytics?: string
    googleTagManager?: string
    facebookPixel?: string
  }
}

// Mock data - gerçek uygulamada database'den gelecek
export const mockPages: Page[] = [
  {
    id: "1",
    title: "Ana Sayfa",
    slug: "/",
    content: "Ana sayfa içeriği",
    status: "published",
    seoTitle: "Arkkontrol - Robotik ve Otomasyon Çözümleri",
    seoDescription: "Türkiye'nin önde gelen robotik kaynak, lazer kesim ve endüstriyel otomasyon çözümleri uzmanı.",
    language: "tr",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    title: "Hakkımızda",
    slug: "/hakkimizda",
    content: "Hakkımızda sayfa içeriği",
    status: "published",
    seoTitle: "Hakkımızda - Arkkontrol",
    seoDescription: "Arkkontrol olarak endüstriyel otomasyon alanında uzman ekibimizle hizmet veriyoruz.",
    language: "tr",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    title: "İletişim",
    slug: "/iletisim",
    content: "İletişim sayfa içeriği",
    status: "published",
    seoTitle: "İletişim - Arkkontrol",
    seoDescription: "Robotik otomasyon çözümleri için bizimle iletişime geçin.",
    language: "tr",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-12"),
  },
]

export const mockSiteSettings: SiteSettings = {
  siteName: "Arkkontrol",
  siteDescription: "Robotik ve Otomasyon Çözümleri",
  siteUrl: "https://arkkontrol.com",
  logo: "/logo.png",
  favicon: "/favicon.ico",
  contactEmail: "info@arkkontrol.com",
  contactPhone: "+90 212 XXX XX XX",
  address: "İstanbul, Türkiye",
  socialMedia: {
    linkedin: "https://linkedin.com/company/arkkontrol",
    facebook: "https://facebook.com/arkkontrol",
  },
  analytics: {
    googleAnalytics: "GA-XXXXXXXXX",
    googleTagManager: "GTM-XXXXXXX",
  },
}

// API fonksiyonları - gerçek uygulamada backend API'ye bağlanacak
export async function getPages(): Promise<Page[]> {
  // Simüle edilmiş API çağrısı
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockPages
}

export async function getPage(id: string): Promise<Page | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockPages.find((page) => page.id === id) || null
}

export async function updatePage(id: string, data: Partial<Page>): Promise<Page> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const pageIndex = mockPages.findIndex((page) => page.id === id)
  if (pageIndex !== -1) {
    mockPages[pageIndex] = { ...mockPages[pageIndex], ...data, updatedAt: new Date() }
    return mockPages[pageIndex]
  }
  throw new Error("Sayfa bulunamadı")
}

export async function getSiteSettings(): Promise<SiteSettings> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockSiteSettings
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  Object.assign(mockSiteSettings, data)
  return mockSiteSettings
}
