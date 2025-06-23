import Layout from "@/components/layout"
import Link from "next/link"
import { ArrowRight, Play, Award, Zap, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-white pt-16 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              Endüstriyel Otomasyon,
              <span className="block text-orange-500">Basitleştirildi</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 leading-relaxed">
              Karmaşık robotik sistemleri kolay kurulum, hızlı devreye alma ve maksimum verimlilik ile hayata geçirin.
            </p>
          </div>

          {/* Product Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <Link href="/projeler/robotik-kaynak" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/3]">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Robotik Kaynak Sistemi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Robotik Kaynak</h3>
                  <p className="text-gray-300 text-sm">ABB robotları ile hassas kaynak çözümleri</p>
                </div>
              </div>
            </Link>

            <Link href="/projeler/lazer-kesim" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/3]">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Lazer Kesim Sistemi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Lazer Kesim</h3>
                  <p className="text-gray-300 text-sm">Yüksek hassasiyetli fiber lazer teknolojisi</p>
                </div>
              </div>
            </Link>

            <Link href="/projeler/mekanize" className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl bg-gray-900 aspect-[4/3]">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="Otomasyon Sistemi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">Otomasyon</h3>
                  <p className="text-gray-300 text-sm">Tam entegre endüstriyel otomasyon çözümleri</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <p className="text-center text-gray-500 text-sm font-medium mb-8 uppercase tracking-wider">
            Türkiye'nin önde gelen firmalarının güvendiği çözüm ortağı
          </p>

          {/* Desktop - Static */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 md:gap-8 opacity-60">
            <div className="text-lg md:text-2xl font-bold text-gray-400 flex-shrink-0">ABB</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400 flex-shrink-0">FRONIUS</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400 flex-shrink-0">KUKA</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400 flex-shrink-0">FANUC</div>
            <div className="text-lg md:text-2xl font-bold text-gray-400 flex-shrink-0">YASKAWA</div>
          </div>

          {/* Mobile - Infinite Loop */}
          <div className="md:hidden relative overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex items-center gap-8 opacity-60 whitespace-nowrap">
                <div className="text-lg font-bold text-gray-400">ABB</div>
                <div className="text-lg font-bold text-gray-400">FRONIUS</div>
                <div className="text-lg font-bold text-gray-400">KUKA</div>
                <div className="text-lg font-bold text-gray-400">FANUC</div>
                <div className="text-lg font-bold text-gray-400">YASKAWA</div>
                {/* Duplicate for seamless loop */}
                <div className="text-lg font-bold text-gray-400">ABB</div>
                <div className="text-lg font-bold text-gray-400">FRONIUS</div>
                <div className="text-lg font-bold text-gray-400">KUKA</div>
                <div className="text-lg font-bold text-gray-400">FANUC</div>
                <div className="text-lg font-bold text-gray-400">YASKAWA</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Yüksek Karışıklık,
              <br />
              <span className="text-orange-500">Yüksek Verimlilik</span>
              <br />
              Üretim? Çözüldü.
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              En karmaşık üretim süreçlerinizi bile basit, hızlı ve verimli hale getirmenin en kolay yolu. Robotik
              otomasyon çözümlerimizle üretim kapasitesini artırın.
            </p>
            <Link
              href="/projeler/robotik-kaynak"
              className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200"
            >
              Çözümlerimizi Keşfedin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Minimal Robot Duruş Süresi</h3>
              <p className="text-gray-600 leading-relaxed">
                Gelişmiş bakım algoritmaları ve öngörülü analiz ile robot duruş sürelerini %90'a kadar azaltın.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Sapma Tespiti ve Düzeltme</h3>
              <p className="text-gray-600 leading-relaxed">
                Gerçek zamanlı kalite kontrol sistemleri ile üretim hatalarını anında tespit edin ve düzeltin.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Her Operatör İçin Hack</h3>
              <p className="text-gray-600 leading-relaxed">
                Sezgisel arayüz ve otomatik optimizasyon ile her seviyeden operatör maksimum verim alabilir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/placeholder.svg?height=800&width=1200"
            alt="Robotik Sistem"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gray-900/80"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                ENDÜSTRIYEL OTOMASYON
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Endüstriyel Robotları
                <br />
                Programlamak Artık
                <br />
                <span className="text-orange-500">Çok Daha Kolay</span>
              </h2>
            </div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 border-2 border-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-500 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Otomatik Yörünge Oluşturma</h3>
                  <p className="text-gray-300">
                    CAD dosyalarından otomatik olarak optimal robot yörüngelerini oluşturun. Manuel programlama
                    gerektirmez.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 border-2 border-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-500 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Gelişmiş Simülasyon</h3>
                  <p className="text-gray-300">
                    Gerçek üretim öncesi sanal ortamda test edin. Çarpışma tespiti ve optimizasyon dahil.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 border-2 border-orange-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-orange-500 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Hızlı Devreye Alma</h3>
                  <p className="text-gray-300">
                    Geleneksel yöntemlere göre %80 daha hızlı kurulum ve devreye alma süreci.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Applications Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Çeşitli Uygulamalar ve Endüstriler İçin Çözümler
            </h2>
          </div>

          {/* Applications Grid */}
          <div className="mb-16">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">UYGULAMALAR</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/projeler/robotik-kaynak" className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-900">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Robotik Kaynak"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-lg font-semibold">Robotik Kaynak</h4>
                  </div>
                </div>
              </Link>

              <Link href="/projeler/lazer-kesim" className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-900">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Lazer Kesim"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-lg font-semibold">Lazer Kesim</h4>
                  </div>
                </div>
              </Link>

              <Link href="/projeler/mekanize" className="group">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-900">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Otomasyon"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-lg font-semibold">Otomasyon</h4>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Industries Grid */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">ENDÜSTRİLER</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/hakkimizda" className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-900">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Otomotiv"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-lg font-semibold">Otomotiv</h4>
                  </div>
                </div>
              </Link>

              <Link href="/hakkimizda" className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-900">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Makine İmalatı"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-lg font-semibold">Makine İmalatı</h4>
                  </div>
                </div>
              </Link>

              <Link href="/hakkimizda" className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-gray-900">
                  <img
                    src="/placeholder.svg?height=300&width=400"
                    alt="Metal İşleme"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 text-white">
                    <h4 className="text-lg font-semibold">Metal İşleme</h4>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="text-center mb-12">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              GÜÇLÜ PARTNERLER VE ROBOT MARKALARI
            </h3>
          </div>

          {/* Desktop - Static */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="text-xl md:text-3xl font-bold text-gray-400 flex-shrink-0">ABB</div>
            <div className="text-xl md:text-3xl font-bold text-gray-400 flex-shrink-0">FANUC</div>
            <div className="text-xl md:text-3xl font-bold text-gray-400 flex-shrink-0">KUKA</div>
            <div className="text-xl md:text-3xl font-bold text-gray-400 flex-shrink-0">YASKAWA</div>
            <div className="text-xl md:text-3xl font-bold text-gray-400 flex-shrink-0">FRONIUS</div>
          </div>

          {/* Mobile - Infinite Loop */}
          <div className="md:hidden relative overflow-hidden">
            <div className="flex animate-scroll">
              <div className="flex items-center gap-8 whitespace-nowrap">
                <div className="text-xl font-bold text-gray-400">ABB</div>
                <div className="text-xl font-bold text-gray-400">FANUC</div>
                <div className="text-xl font-bold text-gray-400">KUKA</div>
                <div className="text-xl font-bold text-gray-400">YASKAWA</div>
                <div className="text-xl font-bold text-gray-400">FRONIUS</div>
                {/* Duplicate for seamless loop */}
                <div className="text-xl font-bold text-gray-400">ABB</div>
                <div className="text-xl font-bold text-gray-400">FANUC</div>
                <div className="text-xl font-bold text-gray-400">KUKA</div>
                <div className="text-xl font-bold text-gray-400">YASKAWA</div>
                <div className="text-xl font-bold text-gray-400">FRONIUS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Başarı Hikayeleri</h2>
            <Link
              href="/projeler/robotik-kaynak"
              className="text-orange-500 hover:text-orange-600 font-medium inline-flex items-center"
            >
              Daha Fazla Gör
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <Link href="/blog" className="block">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-900 mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="Otomotiv Kaynak Hattı"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Otomotiv MRO: Robot Kaynak Hattı Dönüşümü</h3>
                <p className="text-gray-600 text-sm">%40 verimlilik artışı ile üretim kapasitesini ikiye katladık</p>
              </div>

              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-900 mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="ABB Robot Programlama"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ABB Robot Programlama: 4 Temel Yöntem</h3>
                <p className="text-gray-600 text-sm">Uzmanlarımızdan robot programlama teknikleri</p>
              </div>

              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl aspect-video bg-gray-900 mb-4">
                  <img
                    src="/placeholder.svg?height=200&width=350"
                    alt="Robotik Kaynak Nedir"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Robotik Kaynak Nedir?</h3>
                <p className="text-gray-600 text-sm">Robotik kaynağın geleceğini keşfedin</p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">Projenizi Hayata Geçirin</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Uzman ekibimiz sizin için en uygun robotik otomasyon çözümünü tasarlayacak ve hayata geçirecektir.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200"
          >
            Ücretsiz Danışmanlık Al
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Layout>
  )
}
