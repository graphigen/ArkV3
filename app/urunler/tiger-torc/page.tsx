"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, CheckCircle, Zap, Settings, Shield, Target, Eye, X } from "lucide-react"

export default function TigerTorcPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Yüksek Performans",
      desc: "Üstün kesim kalitesi ve hassasiyeti",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Dayanıklı Tasarım",
      desc: "Uzun ömürlü ve güvenilir yapı",
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Kolay Bakım",
      desc: "Minimal bakım gereksinimi",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Geniş Uyumluluk",
      desc: "Çeşitli malzeme türleri ile uyumlu",
    },
  ]

  const specifications = [
    {
      category: "Kesim Kapasitesi",
      specs: [
        { label: "Çelik", value: "0.5-50mm" },
        { label: "Paslanmaz Çelik", value: "0.5-40mm" },
        { label: "Alüminyum", value: "0.5-35mm" },
      ],
    },
    {
      category: "Güç Özellikleri",
      specs: [
        { label: "Güç", value: "40-200A" },
        { label: "Voltaj", value: "380V" },
        { label: "Frekans", value: "50/60Hz" },
      ],
    },
    {
      category: "Çalışma Koşulları",
      specs: [
        { label: "Sıcaklık", value: "-10°C / +40°C" },
        { label: "Nem", value: "%90 (yoğuşmasız)" },
        { label: "Koruma Sınıfı", value: "IP54" },
      ],
    },
  ]

  const productImages = [
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Tiger Torch
              <span className="block text-orange-400">Temizleme Üniteleri</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Yüksek performanslı plazma kesim torçları ile hassas ve hızlı kesim işlemleri
            </p>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                PLAZMA KESİM TEKNOLOJİSİ
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Profesyonal Plazma Kesim Çözümleri</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Tiger Torch plazma kesim torçları, endüstriyel uygulamalar için tasarlanmış yüksek kaliteli kesim
                araçlarıdır. Dayanıklı yapısı ve üstün performansı ile uzun ömürlü kullanım sağlar.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Gelişmiş teknolojisi sayesinde farklı malzeme kalınlıklarında mükemmel kesim kalitesi sunar.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Yüksek kesim kalitesi ve hassasiyeti</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Dayanıklı ve uzun ömürlü tasarım</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Kolay bakım ve servis</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Geniş malzeme uyumluluğu</span>
                </div>
              </div>

              <Link
                href="/iletisim"
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Teklif Al
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Tiger Torch Plazma Kesim Torçu"
                className="w-full h-auto rounded-2xl shadow-2xl cursor-pointer"
                onClick={() => setSelectedImage("/placeholder.svg?height=500&width=600")}
              />
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ürün Özellikleri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tiger Torch'un sunduğu üstün özellikler ve avantajlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                  <div className="text-orange-500 group-hover:text-white transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Teknik Özellikler</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detaylı teknik spesifikasyonlar ve performans değerleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {specifications.map((category, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{category.category}</h3>
                <div className="space-y-4">
                  {category.specs.map((spec, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-gray-600">{spec.label}</span>
                      <span className="font-semibold text-gray-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ürün Galerisi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Tiger Torch ürün serisi ve uygulama örnekleri</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productImages.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Tiger Torch ${index + 1}`}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>
            ))}
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
          <h2 className="text-4xl font-bold text-white mb-6">Tiger Torch İle Kesim Kalitesini Artırın</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun Tiger Torch çözümünü belirleyecek ve kurulumunu gerçekleştirecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Tiger Torch Teklifi Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
