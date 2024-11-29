// src/pages/Privacy.js

import React from 'react';

export function Privacy() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-xl p-8 space-y-16">

        {/* Gizlilik Politikası Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <section className="space-y-8">
            <h2 className="text-4xl font-semibold text-red-600">Gizlilik Politikası</h2>
            <p className="text-gray-700 leading-relaxed">
              KanDostum platformu, kullanıcı gizliliğine saygı gösterir ve kişisel verilerin korunmasını sağlamak amacıyla gerekli tüm önlemleri alır.
              Bu gizlilik politikası, platformumuza kaydolan veya platformumuzu kullanan kullanıcıların kişisel bilgilerinin nasıl toplandığını,
              kullanıldığını ve korunduğunu açıklamaktadır.
            </p>
          </section>
        </div>

        {/* Kişisel Verilerin Toplanması Section */}
        <div className="bg-red-50 rounded-lg p-8">
          <section className="space-y-8">
            <h2 className="text-4xl font-semibold text-red-700">Kişisel Verilerin Toplanması</h2>
            <p className="text-gray-700 leading-relaxed">
              Platformumuz, kullanıcı deneyimini iyileştirmek amacıyla bazı kişisel veriler toplar. Bu bilgiler; ad, soyad, e-posta adresi,
              iletişim bilgileri ve kullanıcı tercihlerini içerebilir. Toplanan veriler, yalnızca ilgili yasalara uygun olarak işlenir.
            </p>
          </section>
        </div>

        {/* Çerez Politikası Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <section className="space-y-8">
            <h2 className="text-4xl font-semibold text-red-600">Çerez Politikası</h2>
            <p className="text-gray-700 leading-relaxed">
              Platformumuz, kullanıcıların web sitemizi nasıl kullandığını anlamak ve deneyimlerini iyileştirmek için çerezler kullanır. Çerezler,
              tarayıcıya gönderilen ve kullanıcının cihazında saklanan küçük metin dosyalarıdır. Web sitesinde gezinme ve tercihlerinizi hatırlamak için kullanılır.
            </p>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-3xl font-semibold text-gray-800 mb-4">Çerez Yönetimi</h3>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                <li><strong>Zorunlu Çerezler:</strong> Web sitesinin temel işlevlerini sağlamak için gereklidir ve devre dışı bırakılamaz.</li>
                <li><strong>İstatistik Çerezleri:</strong> Web sitesi trafiğini ve kullanıcı davranışlarını analiz etmek için kullanılır. Bu çerezler anonim olarak bilgi toplar.</li>
                <li><strong>Reklam Çerezleri:</strong> Kullanıcıların ilgisini çekebilecek reklamları göstermek için kullanılır ve üçüncü taraflarla paylaşılabilir.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Çerez tercihlerinizi, tarayıcınızın ayarlarını değiştirerek yönetebilirsiniz. Çerezleri kabul etmek istemiyorsanız, tarayıcınızın ayarlarından çerezleri
                devre dışı bırakabilirsiniz; ancak bu durumda bazı web sitesi özellikleri düzgün çalışmayabilir.
              </p>
            </div>
          </section>
        </div>

        {/* Verilerin Kullanımı Section */}
        <div className="bg-red-50 rounded-lg p-8">
          <section className="space-y-8">
            <h2 className="text-4xl font-semibold text-red-700">Verilerin Kullanımı</h2>
            <p className="text-gray-700 leading-relaxed">
              Toplanan veriler, kullanıcıya daha iyi hizmet sunmak, kullanıcı deneyimini geliştirmek ve kullanıcıların ihtiyaçlarını karşılamak amacıyla kullanılır.
              Veriler, yalnızca kullanıcı onayı ile üçüncü taraflarla paylaşılır.
            </p>
          </section>
        </div>

        {/* İletişim Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <section className="space-y-8">
            <h2 className="text-4xl font-semibold text-red-600">İletişim</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center">
                  <span className="font-medium w-32">Telefon:</span>
                  <span>0850 XXX XX XX</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-32">E-posta:</span>
                  <span>iletisim@kanbagisi.com</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium w-32">Adres:</span>
                  <span>Örnek Mahallesi, Kan Bağışı Sokak No:1, İstanbul</span>
                </p>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

export default Privacy;
