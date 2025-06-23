"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Target, Wrench, Clock, Eye, X, Zap } from "lucide-react"

export default function FiksturPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const fiksturTypes = [
    {
      title: "Kaynak Fiksturleri",
      description: "Robotik ve manuel kaynak işlemleri için özel tasarım sabitleme sistemleri",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Mikron hassasiyeti", "Hızlı sabitleme", "Dayanıklı yapı"],
    },
    {
      title: "Tezgah Fiksturleri",
      description: "CNC tezgahları için hassas parça sabitleme çözümleri",
      image: "/placeholder.svg?height=300&width=400",
      features: ["CNC uyumlu", "Hassas konumlama", "Kolay kullanım"],
    },
    {
      title: "Montaj Fiksturleri",
      description: "Montaj hatları için ergonomik ve verimli sabitleme sistemleri",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Ergonomik tasarım", "Hızlı montaj", "Güvenli sabitleme"],
    },
    {
      title: "Özel Fiksturler",
      description: "Müşteri ihtiyaçlarına özel tasarlanmış fikstur sistemleri",
      image: "/placeholder.svg?height=300&width=400",
      features: ["Özel tasarım", "İhtiyaca özel", "Maliyet etkin"],
    },
  ]

  const advantages = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Üretim Hızı",
      desc: "Hızlı parça sabitleme ile çevrim sürelerini kısaltın",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Kalite Artışı",
      desc: "Hassas sabitleme ile üretim kalitesini artırın",
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Maliyet Tasarrufu",
      desc: "Fire oranını düşürerek maliyetleri azaltın",
    },
    { icon: <Clock className="h-8 w-8" />, title: "Dayanıklılık", desc: "Yüksek kaliteli malzemeler ile uzun ömür" },
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Fikstur
              <span className="block text-orange-400">Sistemleri</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Hassas üretim için özel tasarım fikstur ve sabitleme sistemleri
            </p>
            <Link
              href="#fikstur-tipleri"
              className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
            >
              Fikstur Tiplerini İncele
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
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
                HASSAS ÜRETİM
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Özel Tasarım Fikstur Çözümleri</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kaynak yapmanın hala gelişmekte bir zanaat olduğu bu günlerde, kaynağı ya da kaynak robotunun en iyi
                şekilde sürü, fiksturlerde. Bunlar genellikle parçaya özel yapılardır.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Fiksturun birinci amacı, verimliliği artırmak ve kaynaklı üretimi tekrar tekrar aynı doğrulukta
                yapılmasını sağlamaktır.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">±0.1mm</div>
                  <div className="text-gray-600 text-sm">Hassasiyet</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-500 mb-2">%70</div>
                  <div className="text-gray-600 text-sm">Hız Artışı</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Fikstur Sistemleri"
                className="w-full h-auto rounded-2xl shadow-2xl cursor-pointer"
                onClick={() => setSelectedImage("/placeholder.svg?height=500&width=600")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2">
                <Eye className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fikstur Types */}
      <section id="fikstur-tipleri" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fikstur Çeşitlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı üretim ihtiyaçlarına yönelik özelleştirilmiş fikstur çözümleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fiksturTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative group">
                  <img
                    src={type.image || "/placeholder.svg"}
                    alt={type.title}
                    className="w-full h-64 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setSelectedImage(type.image)}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.features.map((feature, idx) => (
                      <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full">
                        {feature}
                      </span>
                    ))}
                  </div>
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
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Fikstur Sistemlerinin Avantajları</h2>
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
          <h2 className="text-4xl font-bold text-white mb-6">Fikstur İhtiyacınızı Değerlendirelim</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun fikstur çözümünü tasarlayacak ve üretecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Fikstur Teklifi Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
