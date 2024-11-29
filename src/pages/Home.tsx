import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Clock, MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Home() {
  const supportingOrganizations = [
    {
      name: "Kızılay",
      description: "Türk Kızılayı Kan Hizmetleri",
      logo: "https://images.unsplash.com/photo-1536856136534-bb679c52a9aa?auto=format&fit=crop&w=400&h=300&q=80"
    },
    {
      name: "Sağlık Bakanlığı",
      description: "T.C. Sağlık Bakanlığı",
      logo: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=400&h=300&q=80"
    },
    {
      name: "Hastaneler Birliği",
      description: "Özel Hastaneler ve Sağlık Kuruluşları Derneği",
      logo: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&h=300&q=80"
    },
    {
      name: "Tıp Fakülteleri",
      description: "Üniversite Tıp Fakülteleri Birliği",
      logo: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=400&h=300&q=80"
    },
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-red-600">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover mix-blend-multiply filter brightness-50"
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=1920&q=80"
            alt="Blood Donation"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Bir Damla Kan, Bir Hayat Kurtar
          </h1>
          <p className="mt-6 text-xl text-gray-100 max-w-3xl">
            KanDostum ile ihtiyaç sahipleri ve kan bağışçılarını bir araya getiriyoruz. 
            Hemen üye ol, hayat kurtarmaya başla.
          </p>
          <div className="mt-10">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
            >
              Hemen Üye Ol
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Neden KanDostum?
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mx-auto">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Hızlı Eşleşme</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Acil kan ihtiyaçlarında hızlı eşleşme sağlıyoruz
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mx-auto">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Konum Bazlı</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                En yakın kan bağışçılarını buluyoruz
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mx-auto">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Güvenli İletişim</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Bağışçılar ve ihtiyaç sahipleri güvenle iletişim kurabilir
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-600 text-white mx-auto">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Hayat Kurtarın</h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Bir damla kan ile bir hayat kurtarabilirsiniz
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Supporting Organizations Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Destekleyen Kurumlar
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Kan bağışı misyonumuzu destekleyen değerli kurumlar
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              reverseDirection: false
            }}
            loop={true}
            direction="horizontal"
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
            }}
            className="organization-slider"
          >
            {supportingOrganizations.map((org, index) => (
              <SwiperSlide key={index} className="h-auto">
                <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 h-full flex flex-col">
                  <div className="relative pb-[75%] mb-3">
                    <img
                      src={org.logo}
                      alt={org.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {org.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Hayat kurtarmaya hazır mısınız?</span>
            <span className="block text-red-200">Hemen üye olun, kan bağışçısı olun.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
              >
                Hemen Başla
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}