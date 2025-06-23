"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, CheckCircle, Play, Eye, X } from "lucide-react"

export default function RobotikKaynakPage() {
  const [activeTab, setActiveTab] = useState("tip1")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const cellTypes = {
    tip1: {
      title: "1 TİP HÜCRE",
      description: "Tek istasyonlu kompakt robotik kaynak hücresi",
      features: [
        "Çift temizleme ünitesi kaynak yapısı",
        "İş istasyonu / 300 kg'lara kadar parça pozisyoner sistemi",
        "Operatör paneli ve PLC ile Endüstri 4.0 paylaşım sistemi",
        "Fronius kaynak makinesi",
        "Güvenlik sistemi donanımı",
      ],
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
    },
    tip2: {
      title: "2 TİP HÜCRE",
      description: "Çift istasyonlu yüksek verimli robotik kaynak hücresi",
      features: [
        "İki istasyon",
        "Robotlu ve gaz koruma kayı için çevirme parça, gaz koruma kayı",
        "300 kg, 500 kg hatta ya da senkron pozisyoner sistemi",
        "Operatör paneli ve PLC ile Endüstri 4.0 paylaşım sistemi",
        "Fronius kaynak makinesi",
        "Güvenlik sistemi donanımı",
        "Çift temizleme ünitesi kaynak yapısı",
      ],
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
    },
    tip3: {
      title: "3 TİP HÜCRE",
      description: "Üç istasyonlu maksimum verimlilik robotik kaynak hücresi",
      features: [
        "İki istasyon ya da üç istasyon",
        "Robotlu ve gaz koruma kayı için çevirme parça, gaz koruma kayı",
        "300 kg, 500 kg hatta ya da senkron pozisyoner sistemi",
        "Operatör paneli ve PLC ile Endüstri 4.0 paylaşım sistemi",
        "Fronius kaynak makinesi",
        "Güvenlik sistemi donanımı",
        "Çift temizleme ünitesi kaynak yapısı",
      ],
      images: [
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
        "/placeholder.svg?height=300&width=400",
      ],
    },
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Robotik Kaynak
              <span className="block text-orange-400">Hücreleri</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              ABB ve KUKA robotları ile yüksek hassasiyetli, verimli ve güvenilir kaynak çözümleri
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#hucre-tipleri"
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
              >
                Hücre Tiplerini İncele
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200">
                <Play className="mr-2 h-5 w-5" />
                Demo Video İzle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                ROBOTIK OTOMASYON
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Gelişmiş Robotik Kaynak Teknolojisi</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Arkkontrol robotik kaynak hücreleri, seriyi, modüler tasarım konsepti ile üretilen endüstriyel kaynak
                sistemleridir. Fronius'un son teknoloji kaynak makineleri ile donatılmıştır.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Gerek robotik, gerek manuel kaynak uygulamalarında, ihtiyacınız olan hassasiyet ve maliyetli kaynak
                fiksturlerini tasarlar ve üretir.
              </p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">15+</div>
                  <div className="text-gray-600 text-sm">Yıl Deneyim</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
                  <div className="text-gray-600 text-sm">Kurulu Sistem</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-2">%98</div>
                  <div className="text-gray-600 text-sm">Müşteri Memnuniyeti</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Robotik Kaynak Sistemi"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Cell Types - Tabbed Interface */}
      <section id="hucre-tipleri" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Robotik Kaynak Hücre Tipleri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı üretim ihtiyaçlarına yönelik özelleştirilmiş hücre çözümleri
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12">
            {Object.entries(cellTypes).map(([key, cell]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-8 py-4 mx-2 mb-4 font-semibold rounded-lg transition-all duration-200 ${
                  activeTab === key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {cell.title}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Content */}
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {cellTypes[activeTab as keyof typeof cellTypes].title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8">
                    {cellTypes[activeTab as keyof typeof cellTypes].description}
                  </p>

                  <div className="space-y-4">
                    {cellTypes[activeTab as keyof typeof cellTypes].features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/iletisim"
                      className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
                    >
                      Bu Hücre İçin Teklif Al
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>

                {/* Image Gallery */}
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    {cellTypes[activeTab as keyof typeof cellTypes].images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => setSelectedImage(image)}
                      >
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`${cellTypes[activeTab as keyof typeof cellTypes].title} - ${index + 1}`}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Eye className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-[80vw] max-h-[80vh] w-auto h-auto">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Büyük görsel"
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 text-gray-700 hover:bg-white transition-colors shadow-lg"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Robotik Kaynak Hücrenizi Planlayın</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun robotik kaynak hücresini tasarlayacak ve hayata geçirecektir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              Ücretsiz Danışmanlık Al
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="tel:+902124070102"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-500 transition-all duration-200"
            >
              Hemen Ara: (212) 407 01 02
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
