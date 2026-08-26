export function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 space-y-16">
          {/* Kullanım Koşulları Section */}
          <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg p-8">
            <section className="w-full space-y-4">
              <h2 className="text-4xl font-semibold text-red-600">
                Kullanım Koşulları
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                KanDostum platformuna erişim sağladığınızda, aşağıda
                belirtilen kullanım koşullarını kabul etmiş sayılırsınız.
                Lütfen bu koşulları dikkatlice okuyunuz.
              </p>

              <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  1. Hizmetin Kapsamı
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  KanDostum, kan bağışçısı ve kan ihtiyacı olan kişileri bir
                  araya getiren bir platformdur. Platformda sağlanan
                  hizmetler, yalnızca bilgilendirme amaçlıdır.
                </p>
              </section>

              <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  2. Kullanıcı Yükümlülükleri
                </h3>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                  <li>
                    Kullanıcılar, sisteme doğru ve güncel bilgiler sağlamaktan
                    sorumludur.
                  </li>
                  <li>
                    Kan bağışı için gerekli sağlık kriterlerini taşımak
                    kullanıcı sorumluluğundadır.
                  </li>
                  <li>
                    Platformda paylaşılacak bilgilerin yasalara ve ahlak
                    kurallarına uygun olması gerekmektedir.
                  </li>
                </ul>
              </section>

              <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  3. Gizlilik Politikası
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Kullanıcı bilgileri gizlilik politikamıza uygun olarak
                  işlenir. Detaylar için{" "}
                  <a href="/privacy" className="text-red-600 underline">
                    gizlilik politikamıza
                  </a>{" "}
                  göz atabilirsiniz.
                </p>
              </section>

              <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  4. Çerezler
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Web sitemizde kullanıcı deneyimini geliştirmek için
                  çerezler kullanılmaktadır. Çerez yönetimi ve
                  tercihlerinizi{" "}
                  <a href="/privacy" className="text-red-600 underline">
                    Gizlilik Politikası
                  </a>{" "}
                  sayfamızdan düzenleyebilirsiniz.
                </p>
              </section>

              <section className="border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  5. Sorumluluk Reddi
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Platformumuzda sağlanan bilgiler doğruluk ve güncellik
                  açısından sürekli olarak kontrol edilse de, eksiksiz veya
                  hatasız olacağını garanti etmiyoruz. Kullanıcılar,
                  platformdaki bilgileri kendi sorumlulukları dahilinde
                  kullanır.
                </p>
              </section>

              <section className="pb-6">
                <h3 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
                  6. Koşulların Güncellenmesi
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  KanDostum kullanım koşullarını zaman zaman güncelleme
                  hakkını saklı tutar. Yapılan değişiklikler, bu sayfada
                  yayımlandığı anda geçerli olur.
                </p>
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;
