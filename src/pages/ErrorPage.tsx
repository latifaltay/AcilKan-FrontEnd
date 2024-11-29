import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft, RefreshCw } from 'lucide-react';

export function ErrorPage() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 md:p-12">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full mb-8">
            <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Bir Şeyler Yanlış Gitti
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Üzgünüz, aradığınız sayfaya şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin veya ana sayfaya dönün.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={handleGoBack}
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Geri Dön
            </button>

            <button
              onClick={handleGoHome}
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              Ana Sayfa
            </button>

            <button
              onClick={handleRefresh}
              className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Yenile
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Yardıma mı ihtiyacınız var?
            </h2>
            <div className="text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Sorun devam ederse, lütfen bizimle iletişime geçin:
              </p>
              <a
                href="mailto:destek@kandostum.com"
                className="text-red-600 dark:text-red-400 hover:underline"
              >
                destek@kandostum.com
              </a>
            </div>
          </div>
        </div>

        {/* Error Code */}
        <p className="mt-8 text-gray-500 dark:text-gray-400">
          Hata Kodu: 404 - Sayfa Bulunamadı
        </p>
      </div>
    </div>
  );
}

export default ErrorPage;