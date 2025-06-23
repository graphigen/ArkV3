"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/layout"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    mesaj: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    alert("Mesajınız alındı! En kısa sürede size dönüş yapacağız.")
    setFormData({ ad: "", email: "", mesaj: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">İletişim</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Projeleriniz için bizimle iletişime geçin. Uzman ekibimiz size en uygun çözümü sunmaya hazır.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="ad"
                    name="ad"
                    required
                    value={formData.ad}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Adınızı ve soyadınızı girin"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>

                <div>
                  <label htmlFor="mesaj" className="block text-sm font-medium text-gray-700 mb-2">
                    Mesaj *
                  </label>
                  <textarea
                    id="mesaj"
                    name="mesaj"
                    required
                    rows={6}
                    value={formData.mesaj}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Projeniz hakkında detayları paylaşın..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  Mesaj Gönder
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">İletişim Bilgileri</h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-orange-500 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Adres</h3>
                    <p className="text-gray-600">
                      İkitelli Organize Sanayi Bölgesi
                      <br />
                      Başakşehir, İstanbul
                      <br />
                      Türkiye
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-orange-500 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Telefon</h3>
                    <p className="text-gray-600">
                      <a href="tel:+902124070102" className="hover:text-orange-500 transition-colors">
                        (212) 407 01 02
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-orange-500 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">E-posta</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@arkkontrol.com" className="hover:text-orange-500 transition-colors">
                        info@arkkontrol.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-orange-500 mr-4 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Çalışma Saatleri</h3>
                    <p className="text-gray-600">
                      Pazartesi - Cuma: 08:00 - 18:00
                      <br />
                      Cumartesi: 09:00 - 14:00
                      <br />
                      Pazar: Kapalı
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="mt-8 p-6 bg-orange-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Acil Durum</h3>
                <p className="text-gray-600 mb-4">Acil servis ihtiyaçlarınız için 7/24 ulaşabilirsiniz.</p>
                <a
                  href="tel:+902124070102"
                  className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Hemen Ara
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Konumumuz</h2>
            <p className="text-lg text-gray-600">
              İkitelli Organize Sanayi Bölgesi'nde modern tesisimizde hizmet veriyoruz
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600">Google Maps entegrasyonu burada yer alacak</p>
                <p className="text-sm text-gray-500 mt-2">İkitelli OSB, Başakşehir, İstanbul</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
