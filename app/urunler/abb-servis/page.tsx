"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, CheckCircle, Settings, Wrench, Clock, Shield, Users, Phone, Eye, X, Package } from "lucide-react"

export default function ABBServisPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const services = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Periyodik Bakımlar",
      description: "Düzenli bakım programları ile robot performansını koruyun",
      details: [
        "Aylık, 3 aylık ve yıllık bakım programları",
        "Preventif bakım planlaması",
        "Performans optimizasyonu",
        "Sistem sağlık raporları",
      ],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Arıza Önleyici Bakım",
      description: "Potansiyel sorunları önceden tespit ederek maliyetleri düşürün",
      details: [
        "Predictive maintenance teknolojileri",
        "Vibrasyon analizi",
        "Termal görüntüleme",
        "Erken uyarı sistemleri",
      ],
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Yağ Değişimi ve Bakım",
      description: "Robot eksenlerinin uzun ömürlü çalışması için gerekli bakımlar",
      details: [
        "Orijinal ABB yağları kullanımı",
        "Redüktör bakımları",
        "Servo motor bakımları",
        "Kablo ve bağlantı kontrolleri",
      ],
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Teknik Servis",
      description: "Arıza durumlarında hızlı ve etkili çözümler",
      details: ["24/7 teknik destek hattı", "Uzaktan erişim ve teşhis", "Sahada hızlı müdahale", "Acil durum servisi"],
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Proses Geliştirme",
      description: "Mevcut sistemlerin iyileştirilmesi ve optimizasyonu",
      details: [
        "Çevrim süresi optimizasyonu",
        "Kalite iyileştirmeleri",
        "Yeni uygulama geliştirme",
        "Verimlilik artırma çalışmaları",
      ],
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Yedek Parça Temini",
      description: "Orijinal ABB yedek parçaları ile güvenilir çözümler",
      details: ["Orijinal ABB parçaları", "Hızlı tedarik süreci", "Stok yönetimi hizmetleri", "Kritik parça analizi"],
    },
  ]

  const serviceImages = [
    {
      title: "ABB Robot Bakımı",
      image: "/placeholder.svg?height=300&width=400",
      description: "Periyodik bakım işlemleri",
    },
    {
      title: "Teknik Servis",
      image: "/placeholder.svg?height=300&width=400",
      description: "Arıza giderme çalışmaları",
    },
    {
      title: "Yedek Parça",
      image: "/placeholder.svg?height=300&width=400",
      description: "Orijinal ABB parçaları",
    },
    {
      title: "Eğitim Hizmetleri",
      image: "/placeholder.svg?height=300&width=400",
      description: "Operatör eğitim programları",
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
              ABB Robot
              <span className="block text-orange-400">Servis & Bakım</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Resmi ABB yetkili servis partneri olarak profesyonel bakım ve onarım hizmetleri
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
                YETKİLİ SERVİS PARTNERİ
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Profesyonel ABB Robot Servisi</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Robotik sistemizin sağlığını ve verimli çalışmasını önemsiyoruz. Kurulduğu andan hizmet ömrünün sonuna
                kadar, yakın işbirliği içinde kapsamlı servis hizmetleri sunuyoruz.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                ABB'nin resmi yetkili servis partneri olarak, orijinal parçalar ve sertifikalı teknisyenlerle hizmet
                veriyoruz.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">ABB sertifikalı teknisyenler</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Orijinal ABB yedek parçaları</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">24/7 teknik destek</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Preventif bakım programları</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="ABB Robot Servis"
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

      {/* Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servis Hizmetlerimiz</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              ABB robotlarınız için kapsamlı bakım ve onarım hizmetleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
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

      {/* Service Gallery */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Servis Hizmetleri Galerisi</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">ABB robot servis çalışmalarımızdan görüntüler</p>
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
          <h2 className="text-4xl font-bold text-white mb-6">ABB Robotunuz İçin Servis Desteği</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz ABB robotlarınızın optimal performansını korumak için 7/24 hizmetinizdedir.
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
