"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Package, CheckCircle, Wrench, Shield, Clock, Eye, X } from "lucide-react"

export default function PlazmaSarfPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const brands = [
    {
      name: "Hypertherm",
      description: "Dünya lideri plazma kesim teknolojisi",
      products: ["Powermax Serisi", "HyPerformance Serisi", "MAXPRO200 Serisi"],
    },
    {
      name: "Kjellberg",
      description: "Alman kalitesi plazma sistemleri",
      products: ["HiFocus Serisi", "FineFocus Serisi", "SmartFocus Serisi"],
    },
    {
      name: "ESAB",
      description: "İsveç menşeli güvenilir çözümler",
      products: ["Cutmaster Serisi", "Plasma Vision Serisi", "PT-600 Serisi"],
    },
    {
      name: "Ajan",
      description: "Ekonomik ve kaliteli alternatifler",
      products: ["CUT Serisi", "PLASMA Serisi", "ARC Serisi"],
    },
  ]

  const productCategories = [
    {
      title: "Elektrotlar",
      description: "Yüksek kaliteli tungsten ve hafniyum elektrotlar",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Uzun ömür", "Stabil ark", "Düşük aşınma"],
    },
    {
      title: "Nozullar",
      description: "Farklı kesim kalınlıkları için özel nozullar",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Hassas kesim", "Temiz kenar", "Geniş yelpaze"],
    },
    {
      title: "Koruyucu Kapaklar",
      description: "Torç koruma ve uzun ömür için gerekli parçalar",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Torç koruması", "Kolay değişim", "Dayanıklı malzeme"],
    },
    {
      title: "Gaz Dağıtıcıları",
      description: "Optimal gaz akışı için tasarlanmış dağıtıcılar",
      image: "/placeholder.svg?height=200&width=300",
      features: ["Uniform dağılım", "Yüksek verimlilik", "Kolay montaj"],
    },
  ]

  const advantages = [
    {
      icon: <Package className="h-8 w-8" />,
      title: "Geniş Stok",
      desc: "Tüm popüler markaların sarf malzemeleri stokta",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Orijinal Kalite",
      desc: "Sadece orijinal ve kaliteli ürünler",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Hızlı Teslimat",
      desc: "Aynı gün kargo ve hızlı teslimat",
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Teknik Destek",
      desc: "Uzman ekibimizden teknik destek",
    },
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Plazma Kesim
              <span className="block text-orange-400">Sarf Malzemeleri</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Tüm popüler markaların orijinal sarf malzemeleri ve yedek parçaları
            </p>
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
                ORİJİNAL SARF MALZEMELERİ
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Kaliteli Sarf Malzemeleri</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Mümessili olduğumuz B&B/Bartoni/Çek Cumhuriyeti firmasının ürettiği, Hypertherm, Kjellberg, Esab, Ajan
                gibi bir çok markanın her türlü sarf malzemelerinin stoktaki satışı yapılmaktadır.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Plazma kesim makinelerinizin optimal performansı için orijinal ve kaliteli sarf malzemeleri kullanmanın
                önemini biliyoruz.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Tüm popüler markaların ürünleri</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Orijinal kalite garantisi</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Geniş stok çeşitliliği</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Hızlı teslimat</span>
                </div>
              </div>

              <Link
                href="/iletisim"
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Sarf Malzemesi Teklifi Al
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Plazma Kesim Sarf Malzemeleri"
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

      {/* Brands */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tedarik Ettiğimiz Markalar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dünya çapında tanınan markaların orijinal sarf malzemeleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {brands.map((brand, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{brand.name}</h3>
                <p className="text-gray-600 mb-4 text-sm">{brand.description}</p>
                <ul className="space-y-2">
                  {brand.products.map((product, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      {product}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ürün Kategorileri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plazma kesim için gerekli tüm sarf malzemesi türleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productCategories.map((category, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{category.title}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <div className="space-y-2">
                      {category.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(category.image)}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
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
          <h2 className="text-4xl font-bold text-white mb-6">Sarf Malzemesi İhtiyacınızı Karşılayalım</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Geniş stok çeşitliliğimiz ve hızlı teslimat hizmetimiz ile plazma kesim ihtiyaçlarınızı karşılıyoruz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              Sarf Malzemesi Teklifi Al
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
