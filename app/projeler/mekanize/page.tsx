"use client"

import Layout from "@/components/layout"
import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Cog, Zap, Target, Users, TrendingUp, Clock, DollarSign, Shield } from "lucide-react"

export default function MekanizePage() {
  const [activeProcess, setActiveProcess] = useState(0)

  const processSteps = [
    {
      title: "Analiz ve Planlama",
      description: "Mevcut süreçlerin detaylı analizi ve iyileştirme fırsatlarının belirlenmesi",
      duration: "1-2 Hafta",
      icon: <Target className="h-8 w-8" />,
    },
    {
      title: "Tasarım ve Simülasyon",
      description: "3D tasarım ve simülasyon ile optimal çözümün geliştirilmesi",
      duration: "2-3 Hafta",
      icon: <Cog className="h-8 w-8" />,
    },
    {
      title: "Üretim ve Test",
      description: "Sistem üretimi ve fabrika testlerinin gerçekleştirilmesi",
      duration: "4-6 Hafta",
      icon: <Zap className="h-8 w-8" />,
    },
    {
      title: "Kurulum ve Devreye Alma",
      description: "Sahada kurulum, test ve operatör eğitimi",
      duration: "1-2 Hafta",
      icon: <Users className="h-8 w-8" />,
    },
  ]

  const beforeAfter = {
    before: {
      title: "Manuel Süreçler",
      items: [
        { label: "Üretim Hızı", value: "100 parça/saat", color: "text-red-500" },
        { label: "Hata Oranı", value: "%15", color: "text-red-500" },
        { label: "İşçilik Maliyeti", value: "Yüksek", color: "text-red-500" },
        { label: "Çalışma Saati", value: "8 saat/gün", color: "text-red-500" },
      ],
    },
    after: {
      title: "Mekanize Süreçler",
      items: [
        { label: "Üretim Hızı", value: "300 parça/saat", color: "text-green-500" },
        { label: "Hata Oranı", value: "%2", color: "text-green-500" },
        { label: "İşçilik Maliyeti", value: "Düşük", color: "text-green-500" },
        { label: "Çalışma Saati", value: "24 saat/gün", color: "text-green-500" },
      ],
    },
  }

  const industries = [
    {
      name: "Otomotiv",
      image: "/placeholder.svg?height=300&width=400",
      applications: ["Montaj hattı otomasyonu", "Parça transfer sistemleri", "Kalite kontrol istasyonları"],
      improvement: "+65% verimlilik",
    },
    {
      name: "Gıda",
      image: "/placeholder.svg?height=300&width=400",
      applications: ["Dolum ve kapatma sistemleri", "Etiketleme makineleri", "Paketleme otomasyonu"],
      improvement: "+80% hız artışı",
    },
    {
      name: "Tekstil",
      image: "/placeholder.svg?height=300&width=400",
      applications: ["Kumaş transfer sistemleri", "Otomatik kesim makineleri", "Kalite kontrol sistemleri"],
      improvement: "+70% kalite artışı",
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
              Mekanize
              <span className="block text-orange-400">Çözümler</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Manuel süreçleri otomatikleştirerek üretim verimliliğini maksimuma çıkarın
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">%70</div>
                <div className="text-gray-300">Verimlilik</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">%50</div>
                <div className="text-gray-300">Maliyet Tasarrufu</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">%90</div>
                <div className="text-gray-300">Hata Azalması</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400 mb-2">24/7</div>
                <div className="text-gray-300">Çalışma</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mekanizasyon Öncesi vs Sonrası</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Manuel süreçlerden otomatik sistemlere geçişin getirdiği dramatik iyileştirmeler
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Before */}
            <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{beforeAfter.before.title}</h3>
              <div className="space-y-4">
                {beforeAfter.before.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* After */}
            <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{beforeAfter.after.title}</h3>
              <div className="space-y-4">
                {beforeAfter.after.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <span className="text-gray-700 font-medium">{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mekanizasyon Süreci</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Projeden üretime kadar takip ettiğimiz sistematik süreç
            </p>
          </div>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 hidden lg:block">
              <div
                className="h-full bg-orange-500 transition-all duration-500"
                style={{ width: `${((activeProcess + 1) / processSteps.length) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`relative cursor-pointer transition-all duration-300 ${
                    index <= activeProcess ? "opacity-100" : "opacity-60"
                  }`}
                  onClick={() => setActiveProcess(index)}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300 ${
                        index <= activeProcess ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">{step.title}</h3>
                    <p className="text-gray-600 text-sm text-center mb-3">{step.description}</p>
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
                        <Clock className="h-3 w-3 mr-1" />
                        {step.duration}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Sektörel Uygulamalar</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Farklı sektörlerde gerçekleştirdiğimiz başarılı mekanizasyon projeleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative">
                  <img
                    src={industry.image || "/placeholder.svg"}
                    alt={industry.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {industry.improvement}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{industry.name}</h3>
                  <ul className="space-y-2">
                    {industry.applications.map((app, idx) => (
                      <li key={idx} className="flex items-center text-gray-600 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Mekanizasyonun Faydaları</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <TrendingUp className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verimlilik Artışı</h3>
              <p className="text-gray-600">%70'e varan verimlilik artışı ile üretim kapasitesini artırın</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <DollarSign className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Maliyet Tasarrufu</h3>
              <p className="text-gray-600">İşçilik maliyetlerinde %50'ye varan tasarruf sağlayın</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <Shield className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Kalite Artışı</h3>
              <p className="text-gray-600">%90'a varan hata azalması ile kaliteyi artırın</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500 transition-colors duration-300">
                <Clock className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sürekli Üretim</h3>
              <p className="text-gray-600">24/7 kesintisiz üretim kapasitesi kazanın</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Mekanizasyon Yolculuğunuza Başlayın</h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun mekanizasyon çözümünü tasarlayacak ve hayata geçirecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 bg-white text-orange-500 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200"
          >
            Mekanizasyon Teklifi Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
