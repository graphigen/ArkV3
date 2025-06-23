"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Move, Zap, Settings, Gauge, CheckCircle, Play } from "lucide-react"

export default function SliderPage() {
  const [activeSpec, setActiveSpec] = useState("hareket")

  const specifications = {
    hareket: {
      title: "Hareket Özellikleri",
      data: [
        { label: "Maksimum Hız", value: "0.8 m/s", icon: "⚡" },
        { label: "Net Hareket Mesafesi", value: "İsteğe Göre", icon: "📏" },
        { label: "Pozisyonlama Hassasiyeti", value: "±0.1 mm", icon: "🎯" },
        { label: "Tekrarlama Hassasiyeti", value: "±0.05 mm", icon: "🔄" },
      ],
    },
    guc: {
      title: "Güç Özellikleri",
      data: [
        { label: "Maksimum Sürekli Tork", value: "6.4 Nm", icon: "⚙️" },
        { label: "İzin Verilen Maksimum Yük", value: "1500 kg", icon: "🏋️" },
        { label: "Motor Tipi", value: "Servo Motor", icon: "🔧" },
        { label: "Kontrol Sistemi", value: "PLC Kontrollü", icon: "💻" },
      ],
    },
    boyut: {
      title: "Boyut Özellikleri",
      data: [
        { label: "Hareket Sehpası Genişliği", value: "0.7 m", icon: "📐" },
        { label: "Hareket Sehpası Uzunluğu", value: "2.3 m", icon: "📏" },
        { label: "Toplam Yükseklik", value: "1.2 m", icon: "📊" },
        { label: "Ağırlık", value: "850 kg", icon: "⚖️" },
      ],
    },
  }

  const advantages = [
    {
      icon: <Move className="h-8 w-8" />,
      title: "Geniş Hareket Alanı",
      desc: "Robot erişim alanını genişleterek daha büyük parçalarda çalışma imkanı",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Yüksek Hız",
      desc: "0.8 m/s hıza kadar hareket ile hızlı pozisyonlama",
    },
    {
      icon: <Settings className="h-8 w-8" />,
      title: "Kolay Entegrasyon",
      desc: "Mevcut robot sistemlerine kolayca entegre edilebilir",
    },
    {
      icon: <Gauge className="h-8 w-8" />,
      title: "Hassas Kontrol",
      desc: "±0.1 mm hassasiyetle mükemmel pozisyonlama",
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
              Robotik Slider
              <span className="block text-orange-400">Sistemleri</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Robot erişim alanını genişleten lineer hareket sistemleri
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">0.8 m/s</div>
                <div className="text-gray-300">Max Hız</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">1500kg</div>
                <div className="text-gray-300">Max Yük</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">±0.1mm</div>
                <div className="text-gray-300">Hassasiyet</div>
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
                LİNEER HAREKET
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Robot Erişim Alanını Genişletin</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Robotik slider sistemleri, robotun lineer kızaklarda hareket etmesini sağlayarak çalışma alanını önemli
                ölçüde genişletir. Bu sayede daha büyük parçalarda kaynak işlemi gerçekleştirilebilir.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Sistem robotlu kaynak otomasyonlarına uygun konstrüksiyonda tasarlanmış olup, hareket kabiliyeti kaynak
                erkenlerinden zarar görmeyecek şekilde korunmuştur.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Robot, tel besleyici ve torç temizleme ünitesi taşıma</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">Kaynak erkenlerinden korunmuş hareket sistemi</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-orange-500 mr-3" />
                  <span className="text-gray-700">İsteğe göre farklı uzunluklarda imalat</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Robotik Slider Sistemi"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Play className="h-16 w-16 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Teknik Özellikler</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Detaylı teknik spesifikasyonlar ve performans değerleri
            </p>
          </div>

          {/* Spec Tabs */}
          <div className="flex flex-wrap justify-center mb-12">
            {Object.entries(specifications).map(([key, spec]) => (
              <button
                key={key}
                onClick={() => setActiveSpec(key)}
                className={`px-6 py-3 mx-2 mb-4 font-semibold rounded-lg transition-all duration-200 ${
                  activeSpec === key
                    ? "bg-orange-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                }`}
              >
                {spec.title}
              </button>
            ))}
          </div>

          {/* Spec Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {specifications[activeSpec as keyof typeof specifications].data.map((item, index) => (
                <div key={index} className="text-center p-6 bg-gray-50 rounded-xl">
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="text-2xl font-bold text-orange-500 mb-2">{item.value}</div>
                  <div className="text-gray-600 text-sm">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Slider Sisteminin Avantajları</h2>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Slider Sistemi İhtiyacınızı Değerlendirelim</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun slider sistemini tasarlayacak ve kurulumunu gerçekleştirecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Slider Sistemi Teklifi Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
