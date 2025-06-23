import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock SEO analysis data
    const analysisData = {
      overview: {
        totalPages: 24,
        seoScore: 78,
        missingMeta: 5,
        goodPages: 16,
        warningPages: 6,
        errorPages: 2,
      },
      issues: [
        {
          id: 1,
          type: "warning",
          title: "Meta Description Eksik",
          description: "3 sayfada meta description bulunmuyor",
          pages: [
            { url: "/projeler/pozisyoner", title: "Pozisyoner Sistemleri" },
            { url: "/urunler/tiger-torc", title: "Tiger Torc Kaynak Makinesi" },
            { url: "/hakkimizda", title: "Hakkımızda" },
          ],
          priority: "medium",
          impact: "SEO performansını olumsuz etkiler",
        },
        {
          id: 2,
          type: "error",
          title: "Uzun Meta Title",
          description: "2 sayfada meta title 60 karakterden uzun",
          pages: [
            { url: "/projeler/robotik-kaynak", title: "Robotik Kaynak Sistemleri ve Endüstriyel Otomasyon Çözümleri" },
            { url: "/urunler/fronius-servis", title: "Fronius Kaynak Makinesi Servis ve Bakım Hizmetleri" },
          ],
          priority: "high",
          impact: "Arama sonuçlarında title kesilir",
        },
        {
          id: 3,
          type: "info",
          title: "Alt Text Eksik",
          description: "8 görselde alt text bulunmuyor",
          pages: [
            { url: "/", title: "Ana Sayfa" },
            { url: "/projeler/lazer-kesim", title: "Lazer Kesim" },
          ],
          priority: "low",
          impact: "Erişilebilirlik ve SEO için önemli",
        },
        {
          id: 4,
          type: "warning",
          title: "Yavaş Yüklenen Sayfalar",
          description: "4 sayfa 3 saniyeden uzun sürede yükleniyor",
          pages: [
            { url: "/projeler/mekanize", title: "Mekanize Sistemler" },
            { url: "/blog", title: "Blog" },
          ],
          priority: "medium",
          impact: "Kullanıcı deneyimi ve SEO skorunu etkiler",
        },
      ],
      recommendations: [
        {
          id: 1,
          title: "Meta Description Ekleyin",
          description: "Eksik meta description'ları ekleyerek SEO skorunuzu artırın",
          impact: "+15 SEO Score",
          effort: "Kolay",
          category: "Meta Tags",
        },
        {
          id: 2,
          title: "Title Uzunluklarını Optimize Edin",
          description: "60 karakterden uzun title'ları kısaltın",
          impact: "+10 SEO Score",
          effort: "Kolay",
          category: "Meta Tags",
        },
        {
          id: 3,
          title: "Görsellere Alt Text Ekleyin",
          description: "Tüm görsellere açıklayıcı alt text ekleyin",
          impact: "+8 SEO Score",
          effort: "Orta",
          category: "Erişilebilirlik",
        },
        {
          id: 4,
          title: "Sayfa Hızını Optimize Edin",
          description: "Görsel optimizasyonu ve cache kullanarak sayfa hızını artırın",
          impact: "+12 SEO Score",
          effort: "Zor",
          category: "Performans",
        },
      ],
      keywords: [
        {
          keyword: "robotik kaynak",
          position: 3,
          searchVolume: 1200,
          difficulty: 65,
          trend: "up",
        },
        {
          keyword: "endüstriyel otomasyon",
          position: 7,
          searchVolume: 800,
          difficulty: 58,
          trend: "stable",
        },
        {
          keyword: "lazer kesim",
          position: 12,
          searchVolume: 950,
          difficulty: 72,
          trend: "down",
        },
      ],
      competitors: [
        {
          domain: "competitor1.com",
          score: 85,
          commonKeywords: 12,
          backlinks: 450,
        },
        {
          domain: "competitor2.com",
          score: 72,
          commonKeywords: 8,
          backlinks: 320,
        },
      ],
    }

    return NextResponse.json(analysisData)
  } catch (error) {
    console.error("Error fetching SEO analysis:", error)
    return NextResponse.json({ error: "Failed to fetch SEO analysis" }, { status: 500 })
  }
}
