"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, CheckCircle, Wrench, Zap, Settings, Shield, Phone, Eye, X, AlertTriangle } from "lucide-react"

export default function FroniusServisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const services = [
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Hata Teşhisi",
      description: "Kaynak sisteminin ve tüm bileşenlerinin detaylı kontrolü",
      details: ["Elektronik kart kontrolü", "Güç kaynağı analizi", "Torç ve kablo kontrolü", "Gaz sistemi incelemesi"],
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Maliyet Tahmini",
      description: "Detaylı inceleme sonrası şeffaf maliyet hesaplaması",
      details: [
        "Ücretsiz ön değerlendirme",
        "Detaylı maliyet raporu",
        "Parça ve işçilik ayrımı",
        "Alternatif çözüm önerileri",
      ],
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Onarım Hizmetleri",
      description: "Kaynak sisteminin veya bileşenlerinin profesyonel tamiri",
      details: ["Elektronik kart tamiri", "Güç kaynağı onarımı", "Torç ve aksesuar tamiri", "Yazılım güncellemeleri"],
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Kaynak Testi",
      description: "Onarım sonrası kapsamlı test ve kalibrasyon",
      details: ["Performans testleri", "Kalibrasyon işlemleri", "Kaynak kalite kontrolü", "Sistem optimizasyonu"],
    },
  ]

  const serviceLocations = [
    {
      title: "Yerinde Servis",
      description: "Müşteri tesisinde hızlı müdahale",
      icon: <Settings className="h-12 w-12" />,
      features: ["Acil müdahale hizmeti", "Minimum üretim durması", "Sahada hızlı çözüm", "Mobil servis araçları"],
    },
    {
      title: "İstanbul Servisimiz",
      description: "Tam donanımlı servis merkezimizde",
      icon: <Wrench className="h-12 w-12" />,
      features: ["Tam donanımlı atölye", "Test ve kalibrasyon ünitesi", "Yedek parça stoğu", "Uzman teknisyen kadrosu"],
    },
    {
      title: "Fronius İstanbul",
      description: "Fronius resmi servis merkezinde",
      icon: <Shield className="h-12 w-12" />,
      features: ["Fronius orijinal servis", "Fabrika standartları", "Garantili onarım", "Sertifikalı teknisyenler"],
    },
  ]

  const serviceImages = [
    {
      title: "Fronius Kaynak Makinesi Tamiri",
      image: "/placeholder.svg?height=300&width=400",
      description: "Elektronik kart ve güç kaynağı onarımı",
    },
    {
      title: "Test ve Kalibrasyon",
      image: "/placeholder.svg?height=300&width=400",
      description: "Onarım sonrası kapsamlı testler",
    },
    {
      title: "Yedek Parça Stoğu",
      image: "/placeholder.svg?height=300&width=400",
      description: "Orijinal Fronius yedek parçaları",
    },
    {
      title: "Sahada Servis",
      image: "/placeholder.svg?height=300&width=400",
      description: "Müşteri tesisinde hızlı müdahale",
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
              Fronius Kaynak
              <span className="block text-orange-400">Servis & Bakım</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Fronius İstanbul işbirliği ile hızlı ve güvenilir kaynak makinesi servis hizmetleri
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/iletisim"
                className="inline-flex items-center px-8 py-4 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200"
              >
                Servis Talebi Oluştur
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="tel:+902124070102"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                <Phone className="mr-2 h-5 w-5" />
                Acil Servis: (212) 407 01 02
              </a>
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
                FRONIUS SERVİS PARTNERİ
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Profesyonel Fronius Servis Hizmetleri</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kaynak sisteminde arıza olması durumunda, Fronius İstanbul ile olan işbirliğimiz sayesinde hızlı ve
                odaklı yardım hizmeti sunulur.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Tamir servisimiz duruma bağlı olarak doğrudan yerinde, İstanbul'da bulunan servisimizde ya da Fronius
                İstanbul tesislerinde hizmet verir.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Fronius İstanbul işbirliği</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Orijinal Fronius parçaları</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Hızlı müdahale süresi</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Uzman teknisyen kadrosu</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Fronius Kaynak Servis"
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

      {/* Service Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servis Sürecimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fronius kaynak makineleriniz için sistematik servis yaklaşımımız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 relative"
              >
                <div className="absolute -top-4 left-8 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 mt-4">
                  <div className="text-orange-500">{service.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Locations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servis Lokasyonları</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              İhtiyacınıza göre farklı lokasyonlarda servis hizmeti
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {serviceLocations.map((location, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="text-orange-500">{location.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{location.title}</h3>
                <p className="text-gray-600 mb-6">{location.description}</p>
                <ul className="space-y-3">
                  {location.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-orange-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Gallery */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servis Hizmetleri Galerisi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fronius kaynak makinesi servis çalışmalarımızdan görüntüler
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceImages.map((item, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage(item.image)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
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
          <h2 className="text-4xl font-bold text-white mb-6">Fronius Kaynak Makineniz İçin Servis Desteği</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Fronius İstanbul işbirliği ile kaynak makinelerinizin optimal performansını korumak için 7/24
            hizmetinizdedir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              Servis Talebi Oluştur
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="tel:+902124070102"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-500 transition-all duration-200"
            >
              <Phone className="mr-2 h-5 w-5" />
              Acil Servis: (212) 407 01 02
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
