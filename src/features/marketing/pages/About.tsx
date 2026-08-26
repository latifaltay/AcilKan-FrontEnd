export function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="w-full max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-red-600 text-center mb-8">
          Hakkımızda
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-16">
          {/* Hakkımızda Section */}
          <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-8">
            <section className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80"
                  alt="Kan bağışı istatistiklerini gösteren grafik"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-4xl font-semibold text-red-600">
                  Hakkımızda
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  KanDostum platformu, kan bağışçıları ile ihtiyacı olanları
                  bir araya getirerek hayat kurtarma misyonunu üstlenmiştir.
                  Kan bağışı sürecini daha erişilebilir hale getirmek için
                  çalışıyoruz.
                </p>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Teknolojinin gücünü kullanarak, toplumun her kesimine hitap
                  eden bir platform oluşturduk. Amacımız, kan bağışı
                  farkındalığını artırarak kan ihtiyacını karşılamaya katkı
                  sağlamak.
                </p>
              </div>
            </section>
          </div>

          {/* Kan Bağışı Hakkında Section */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-8">
            <section className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-full md:w-1/2 space-y-4">
                <h2 className="text-4xl font-semibold text-red-700 dark:text-red-400">
                  Kan Bağışı Hakkında
                </h2>

                <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    Misyonumuz
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    Kan bağışı platformumuz, ihtiyaç sahipleri ile gönüllü
                    bağışçıları bir araya getirerek hayat kurtarmayı
                    amaçlamaktadır. Teknolojinin gücünü kullanarak, kan bağışı
                    sürecini daha erişilebilir ve etkili hale getiriyoruz.
                  </p>
                </section>

                <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    Neden Kan Bağışı?
                  </h3>
                  <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                    <li>Tek bir bağış ile 3 kişinin hayatını kurtarabilirsiniz</li>
                    <li>Düzenli kan bağışı kalp hastalığı riskini azaltır</li>
                    <li>Kan değerlerinizin düzenli kontrolünü sağlar</li>
                    <li>Toplumsal dayanışmaya katkıda bulunursunuz</li>
                  </ul>
                </section>

                <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                  <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    Kimler Kan Bağışlayabilir?
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                      <h4 className="font-medium text-red-700 dark:text-red-400 mb-3">
                        Genel Şartlar
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>18-65 yaş arasında olmak</li>
                        <li>50 kg'ın üzerinde olmak</li>
                        <li>Kronik bir hastalığı olmamak</li>
                      </ul>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                      <h4 className="font-medium text-red-700 dark:text-red-400 mb-3">
                        Sağlık Kriterleri
                      </h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Tansiyon normal sınırlarda</li>
                        <li>Hemoglobin değerleri yeterli</li>
                        <li>Son 3 ayda bağış yapmamış olmak</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                    İletişim
                  </h3>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                      <p className="flex items-center">
                        <span className="font-medium w-32">Telefon:</span>
                        <span>0850 XXX XX XX</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium w-32">E-posta:</span>
                        <span>iletisim@kandostum.com</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-medium w-32">Adres:</span>
                        <span>
                          Örnek Mahallesi, Kan Bağışı Sokak No:1, İstanbul
                        </span>
                      </p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="w-full md:w-1/2">
                <img
                  src="https://images.unsplash.com/photo-1615461066928-3d3c3c3ed4c8?auto=format&fit=crop&w=800&q=80"
                  alt="Kan bağışının faydalarını gösteren grafik"
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
