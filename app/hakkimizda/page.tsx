import Layout from "@/components/layout"
import Link from "next/link"
import { ArrowRight, Users, Target, Lightbulb } from "lucide-react"

export default function HakkimizdaPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Hakkımızda</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              2008'den beri metalin işlendiği tüm üretim sektörlerinde yenilikçi robotik kaynak ve lazer kesim çözümleri
              konusunda uzmanlaşmış firmayız
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Arkkontrol Sistemleri</h2>
              <p className="text-lg text-gray-600 mb-6">
                Arkkontrol Robotik Otomasyon Sistemleri Tic. Ltd. Şirketi olarak 2008 yılında kurulan ve üretimin her
                alanında yenilikçi robotlu kaynak ve lazer kesim çözümleri konusunda uzmanlaşmış bir firmayız.
                Endüstriyel otomasyonun gücünü benimseyerek, müşterilere bu sektörlerde en yüksek kalitede hizmet sunma
                misyonuyla faaliyet gösteriyoruz.
              </p>
              <Link
                href="/iletisim"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200"
              >
                İletişime Geç
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div>
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Arkkontrol Fabrika"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Güçlü Partnerlikler</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">ABB Robotları ile İşbirliği</h3>
              <p className="text-gray-600 mb-4">
                Arkkontrol Robotik olarak bizler, ABB firmasının robot teknolojisi alanının kaynak uygulamalarında
                Türkiye'de TEK yetkili değer sağlayıcısıyız. ABB robotları, yüksek hassasiyetli ve verimli otomasyon
                çözümleri sunar.
              </p>
              <div className="text-orange-500 font-semibold">2010'dan beri</div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">KUKA Robot İşbirliği</h3>
              <p className="text-gray-600 mb-4">
                ABB'nin yanısıra ürün gamını genişletmek amacıyla KUKA Robot ile de çalışmaktadır. KUKA robotları da
                endüstriyel üretimde kapsamlı kullanım alanlarına sahiptir.
              </p>
              <div className="text-orange-500 font-semibold">2015'ten beri</div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Fronius Kaynak İşbirliği</h3>
              <p className="text-gray-600 mb-4">
                Sektörün öncüsü, Avrupa ve Türkiye kaynak sektöründe lider olan Fronius firması ile kurulduğumuz günden
                beri çalışmalarımızı artırarak devam ettirmekteyiz.
              </p>
              <div className="text-orange-500 font-semibold">2008'den beri</div>
            </div>
          </div>
        </div>
      </section>

      {/* Lazer Kesim */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Lazer Kesim Makineleri"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Lazer Kesim Makineleri Üretimi</h2>
              <p className="text-lg text-gray-600 mb-6">
                Arkkontrol Robotik olarak metalin işlendiği tüm üretim sektörlerinde 2021 yılında yeni bir adım atarak
                lazer kesim makineleri üretimine de başladık. Bu yeni ürün grubumuz, yüksek hassasiyet ve hızlı üretim
                kabiliyetiyle dikkat çekmektedir.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Lazer kesim makinelerimiz, sektörlerin ihtiyaçlarına yönelik özelleştirilmiş çözümler sunarak
                müşterilere rekabet avantajı sağlamayı amaçlamaktadır.
              </p>
              <Link
                href="/projeler/lazer-kesim"
                className="inline-flex items-center px-8 py-4 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-200"
              >
                Lazer Kesim Çözümlerimiz
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Group Companies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Grup Şirketleriyle Daha İleriye</h2>
            <p className="text-xl text-gray-600">
              İşbirliğinin gücüne inanıyor ve sektörde varoluşumuzu farklı alanlara da taşıyoruz
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Robinova</h3>
              <p className="text-gray-600">
                Robinova, kaynak prosesi dışında kalan robotik projeler konusunda uzmanlaşmış grup şirketimizdir. Proses
                otomasyonu konusunda geniş çözümler sunar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Metaform Mühendislik</h3>
              <p className="text-gray-600">
                Metaform Mühendislik, sac şekillendirme kalıpları, kaynak fikstürleri ve ölçü kontrol mastarları imalatı
                konusundaki yetkinliği ile öne çıkmaktadır.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-orange-50 p-8 rounded-xl text-center">
              <Target className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Yerlileştirme</h3>
              <p className="text-gray-600">
                Yerel üretimin ve iş gücünün önemini anlayarak, yerli kaynakları kullanarak üretim ve geliştirme
                süreçlerimize katkı sağlamayı taahhüt ediyoruz.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl text-center">
              <Users className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Yerel İşbirlikleri</h3>
              <p className="text-gray-600">
                Yerli işbirlikleri kurarak, yerel tedarikçilerle işbirliği yaparak yerel ekonomiye katkıda bulunmayı ve
                sektörümüzün büyümesine destek olmayı hedefliyoruz.
              </p>
            </div>

            <div className="bg-orange-50 p-8 rounded-xl text-center">
              <Lightbulb className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Yerel Yetenek Geliştirme</h3>
              <p className="text-gray-600">
                Genç yetenekleri destekleyerek ve eğitim programlarıyla yerel insan kaynağının gelişimine katkıda
                bulunmayı önemsiyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rakamlarla Arkkontrol</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">16+</div>
              <div className="text-gray-600">Yıl Deneyim</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">500+</div>
              <div className="text-gray-600">Tamamlanan Proje</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">200+</div>
              <div className="text-gray-600">Mutlu Müşteri</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">50+</div>
              <div className="text-gray-600">Uzman Personel</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-orange-50 p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Misyonumuz</h2>
              <p className="text-lg text-gray-600">
                Metalin işlendiği tüm üretim sektörlerinde ve üretimin her alanında etkin ve verimli robotik kaynak,
                lazer kesim ve proses otomasyon çözümleri geliştirerek müşterilerimizin iş süreçlerini optimize
                etmelerine yardımcı olmaktır. Teknolojik yenilikleri yakından takip ederek, robotik kaynak
                uygulamalarında lider konumunu korumayı ve müşteri memnuniyetini en üst düzeyde sağlamayı amaçlıyoruz.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Vizyonumuz</h2>
              <p className="text-lg text-gray-600">
                Metalin işlendiği tüm üretim sektörlerinde ve üretimin diğer alanlarında öncü bir konumda yer alarak
                endüstriyel üretimin geleceğini yönlendiren bir marka olmaktır. Sektördeki en iyi uygulamaları
                kullanarak, sürdürülebilir ve yenilikçi çözümler sunarak küresel düzeyde tanınmış, metal işleme
                sektöründe, ilk adımdan son adıma kadar tüm prosesi projelendiren ve üreten bir firma haline gelmeyi
                hedefliyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
