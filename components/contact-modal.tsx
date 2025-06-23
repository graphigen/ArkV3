"use client"

import type React from "react"

import { useState } from "react"
import { X, Phone, Mail, MapPin } from "lucide-react"

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    ad: "",
    email: "",
    telefon: "",
    mesaj: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission logic would go here
    alert("Mesajınız alındı! En kısa sürede size dönüş yapacağız.")
    setFormData({ ad: "", email: "", telefon: "", mesaj: "" })
    onClose()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Hızlı İletişim</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mesaj Gönderin</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="ad" className="block text-sm font-medium text-gray-700 mb-1">
                    Ad Soyad *
                  </label>
                  <input
                    type="text"
                    id="ad"
                    name="ad"
                    required
                    value={formData.ad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Adınızı ve soyadınızı girin"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="E-posta adresinizi girin"
                  />
                </div>

                <div>
                  <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="telefon"
                    name="telefon"
                    value={formData.telefon}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="Telefon numaranızı girin"
                  />
                </div>

                <div>
                  <label htmlFor="mesaj" className="block text-sm font-medium text-gray-700 mb-1">
                    Mesaj *
                  </label>
                  <textarea
                    id="mesaj"
                    name="mesaj"
                    required
                    rows={4}
                    value={formData.mesaj}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Adres</h4>
                    <p className="text-gray-600 text-sm">
                      İkitelli Organize Sanayi Bölgesi
                      <br />
                      Başakşehir, İstanbul
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Telefon</h4>
                    <a href="tel:+902124070102" className="text-orange-500 hover:text-orange-600 text-sm">
                      (212) 407 01 02
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-orange-500 mr-3 mt-1" />
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">E-posta</h4>
                    <a href="mailto:info@arkkontrol.com" className="text-orange-500 hover:text-orange-600 text-sm">
                      info@arkkontrol.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Hızlı İletişim</h4>
                <div className="space-y-2">
                  <a
                    href="tel:+902124070102"
                    className="flex items-center justify-center w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Hemen Ara
                  </a>
                  <a
                    href="https://wa.me/902124070102"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Export both as named and default to ensure compatibility
export { ContactModal }
export default ContactModal
