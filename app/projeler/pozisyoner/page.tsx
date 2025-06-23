"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, ChevronDown, ChevronUp, RotateCw, Settings, Gauge } from "lucide-react"

export default function PozisyonerPage() {
  const [expandedSection, setExpandedSection] = useState<string | null>("300kg")

  const pozisyonerTypes = [
    {
      id: "300kg",
      title: "300KG SENKRON POZİSYONER",
      subtitle: "Kompakt ve hassas pozisyonlama çözümü",
      specs: [
        "Robotla eş zamanlı hareket edebilme özelliği vardır",
        "Robot kumandası panelinden kaynak program giriş sırasında konuma bağlı sınırsız pozisyon ayarlayabilme imkanı vardır",
        "Maksimum sürekli çıkış momenti 350 Nm'dir",
        "180 derece dönüş için pozisyonlama zamanı 1.4-1.9 saniye arasındadır",
        "500 mm yarı çapla pozisyonlama hassasiyeti ±0.05 mm'dir",
        "Ağırlık merkezi dönüş ekseninden 275 mm kaçık olduğunda döndürebileceği maksimum yük 129 kg'dır",
      ],
      image: "/placeholder.svg?height=300&width=400",
      keyFeatures: {
        moment: "350 Nm",
        hassasiyet: "±0.05 mm",
        hiz: "1.4-1.9 s",
      },
    },
    {
      id: "600kg",
      title: "600KG SENKRON POZİSYONER",
      subtitle: "Orta kapasiteli güçlü pozisyonlama sistemi",
      specs: [
        "Robotla eş zamanlı hareket edebilme özelliği vardır",
        "Robot kumandası panelinden kaynak program giriş sırasında konuma bağlı sınırsız pozisyon ayarlayabilme imkanı vardır",
        "Maksimum sürekli çıkış momenti 650Nm'dir",
        "180 derece dönüş için pozisyonlama zamanı 1.7-2.1 saniye arasındadır",
        "500 mm yarı çapla pozisyonlama hassasiyeti +-0.05 mm'dir",
        "Ağırlık merkezi dönüş ekseninden 275mm kaçık olduğunda döndürebileceği maksimum yük 240kg'dır",
      ],
      image: "/placeholder.svg?height=300&width=400",
      keyFeatures: {
        moment: "650 Nm",
        hassasiyet: "±0.05 mm",
        hiz: "1.7-2.1 s",
      },
    },
    {
      id: "1000kg",
      title: "1000KG SENKRON POZİSYONER",
      subtitle: "Ağır yük kapasiteli endüstriyel pozisyoner",
      specs: [
        "Robotla eş zamanlı hareket edebilme özelliği vardır",
        "Robot kumandası panelinden kaynak program giriş sırasında konuma bağlı sınırsız pozisyon ayarlayabilme imkanı vardır",
        "Maksimum çıkış momenti 900Nm'dir",
        "180 derece dönüş için pozisyonlama zamanı 1.5-2.1 saniye arasındadır",
        "500 mm yarı çapla pozisyonlama hassasiyeti +-0.05 mm'dir",
        "Ağırlık merkezi dönüş ekseninden 275 mm kaçık olduğunda döndürebileceği maksimum yük 333kg'dır",
      ],
      image: "/placeholder.svg?height=300&width=400",
      keyFeatures: {
        moment: "900 Nm",
        hassasiyet: "±0.05 mm",
        hiz: "1.5-2.1 s",
      },
    },
  ]

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id)
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Pozisyoner
              <span className="block text-orange-400">Sistemleri</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Kaynak ve montaj işlemleri için hassas döndürme ve konumlandırma sistemleri
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">360°</div>
                <div className="text-gray-300">Döndürme</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">±0.05mm</div>
                <div className="text-gray-300">Hassasiyet</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">1000kg</div>
                <div className="text-gray-300">Max Yük</div>
              </div>
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
                HASSAS POZİSYONLAMA
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Hassas Pozisyonlama Teknolojisi</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kaynak ve montaj işlemlerinde parçaları optimal pozisyona getiren pozisyoner sistemlerimiz, üretim
                verimliliğini artırır ve operatör ergonomisini iyileştirir.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Farklı yük kapasiteleri ve hareket türleri ile çeşitli uygulamalara uygun çözümler sunuyoruz.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <RotateCw className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Senkron Hareket</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Settings className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Robot Entegrasyonu</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Gauge className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-medium text-gray-900">Yüksek Hassasiyet</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Pozisyoner Sistemleri"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pozisyoner Types - Accordion */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pozisyoner Türleri</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı yük kapasitelerine uygun pozisyoner çözümleri
            </p>
          </div>

          <div className="space-y-6">
            {pozisyonerTypes.map((type) => (
              <div key={type.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(type.id)}
                  className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{type.title}</h3>
                      <p className="text-gray-600">{type.subtitle}</p>
                      <div className="flex gap-6 mt-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">{type.keyFeatures.moment}</div>
                          <div className="text-xs text-gray-500">Moment</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">{type.keyFeatures.hassasiyet}</div>
                          <div className="text-xs text-gray-500">Hassasiyet</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-orange-500">{type.keyFeatures.hiz}</div>
                          <div className="text-xs text-gray-500">Pozisyonlama</div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-6">
                      {expandedSection === type.id ? (
                        <ChevronUp className="h-6 w-6 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {expandedSection === type.id && (
                  <div className="px-8 pb-8">
                    <div className="border-t border-gray-200 pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Teknik Özellikler</h4>
                          <ul className="space-y-3">
                            {type.specs.map((spec, index) => (
                              <li key={index} className="flex items-start">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                                <span className="text-gray-600 text-sm leading-relaxed">{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <img
                            src={type.image || "/placeholder.svg"}
                            alt={type.title}
                            className="w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Pozisyoner İhtiyacınızı Belirleyelim</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun pozisyoner sistemini seçecek ve kurulumunu gerçekleştirecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Pozisyoner Teklifi Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
