"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Play, Zap, Eye, X, CheckCircle, Settings, Gauge } from "lucide-react"

export default function LazerKesimPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeComparison, setActiveComparison] = useState("fiber")

  const lazerTypes = {
    fiber: {
      title: "Fiber Lazer",
      features: [
        "Yüksek kesim hızı",
        "Mükemmel kesim kalitesi",
        "Düşük işletme maliyeti",
        "Minimal bakım gereksinimi",
        "Çelik, paslanmaz çelik, alüminyum kesimi",
      ],
      specs: {
        guc: "1-12 kW",
        kalinlik: "0.5-25 mm",
        hiz: "15-50 m/dk",
        hassasiyet: "±0.1 mm",
      },
    },
    co2: {
      title: "CO2 Lazer",
      features: [
        "Kalın malzeme kesimi",
        "Geniş malzeme yelpazesi",
        "Ekonomik çözüm",
        "Kanıtlanmış teknoloji",
        "Ahşap, akrilik, tekstil kesimi",
      ],
      specs: {
        guc: "1-6 kW",
        kalinlik: "0.5-30 mm",
        hiz: "5-25 m/dk",
        hassasiyet: "±0.2 mm",
      },
    },
  }

  const gallery = [
    {
      title: "Fiber Lazer Boru Kesim",
      image: "/placeholder.svg?height=300&width=400",
      description: "Boru ve profil kesim makinesi",
    },
    {
      title: "Sac Kesim Tezgahı",
      image: "/placeholder.svg?height=300&width=400",
      description: "Yüksek hassasiyetli sac kesim",
    },
    {
      title: "Otomatik Yükleme Sistemi",
      image: "/placeholder.svg?height=300&width=400",
      description: "Otomatik malzeme besleme",
    },
    {
      title: "Kontrol Paneli",
      image: "/placeholder.svg?height=300&width=400",
      description: "Kullanıcı dostu arayüz",
    },
    {
      title: "Kesim Örnekleri",
      image: "/placeholder.svg?height=300&width=400",
      description: "Farklı malzeme kesim örnekleri",
    },
    {
      title: "Üretim Hattı",
      image: "/placeholder.svg?height=300&width=400",
      description: "Tam otomatik üretim hattı",
    },
  ]

  const advantages = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Yüksek Hız",
      desc: "Geleneksel yöntemlere göre 10x daha hızlı kesim",
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Hassasiyet",
      desc: "±0.1 mm hassasiyetle mükemmel kesim kalitesi",
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Verimlilik",
      desc: "24/7 kesintisiz üretim kapasitesi",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Kalite",
      desc: "Pürüzsüz kesim yüzeyi, minimum işlem gereksinimi",
    },
  ]

  return (
    <Layout>
      {/* Hero Section with Video */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Lazer Kesim
              <span className="block text-orange-400">Tezgahları</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Fiber lazer teknolojisi ile yüksek hassasiyetli ve hızlı kesim çözümleri
            </p>
          </div>

          {/* Video Hero */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                <button className="group">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                    <Play className="h-10 w-10 text-white ml-1" />
                  </div>
                </button>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">ARKKONTROL FİBER LAZER BORU & PROFİL KESİM MAKİNESİ</h3>
                  <p className="text-sm text-gray-300">Canlı üretim görüntüleri</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lazer Teknolojileri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">İhtiyacınıza en uygun lazer teknolojisini seçin</p>
          </div>

          {/* Technology Tabs */}
          <div className="flex justify-center mb-12">
            {Object.entries(lazerTypes).map(([key, type]) => (
              <button
                key={key}
                onClick={() => setActiveComparison(key)}
                className={`px-8 py-4 mx-2 font-semibold rounded-lg transition-all duration-200 ${
                  activeComparison === key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {type.title}
              </button>
            ))}
          </div>

          {/* Technology Content */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {lazerTypes[activeComparison as keyof typeof lazerTypes].title}
                </h3>
                <div className="space-y-4 mb-8">
                  {lazerTypes[activeComparison as keyof typeof lazerTypes].features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-6">Teknik Özellikler</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(lazerTypes[activeComparison as keyof typeof lazerTypes].specs).map(([key, value]) => (
                    <div key={key} className="bg-white p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-500 mb-1">{value}</div>
                      <div className="text-gray-600 text-sm capitalize">{key.replace(/([A-Z])/g, " $1")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lazer Kesim Sistemleri Galerisi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı uygulama alanları ve sistem konfigürasyonları
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Lazer Kesimin Avantajları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                  <div className="text-orange-500 group-hover:text-white transition-colors duration-300">
                    {advantage.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{advantage.title}</h3>
                <p className="text-gray-600">{advantage.desc}</p>
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
          <h2 className="text-4xl font-bold text-white mb-6">Lazer Kesim Sisteminizi Planlayın</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun lazer kesim sistemini tasarlayacak ve kurulumunu gerçekleştirecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Lazer Kesim Teklifi Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
