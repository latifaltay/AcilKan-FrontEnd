import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');


    try {
      const response = await fetch(`https://localhost:7132/api/AppUser/ForgotPassword?email=${email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      

      if (response.ok) {
        setIsSubmitted(true); // Başarılı durumda kullanıcıya bildirim göster

      } else {
        const result = await response.json();
        setError(result.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');

      }
    } catch (err) {

      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">E-posta Gönderildi</h2>
            <p className="text-gray-600 mb-6">
              Parola sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                E-posta birkaç dakika içinde gelmezse, spam klasörünüzü kontrol edin.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center text-red-600 hover:text-red-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Giriş sayfasına dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">Parola Sıfırlama</h2>
        <p className="text-center text-gray-600 mb-8">
          Parolanızı sıfırlamak için e-posta adresinizi girin
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-lg shadow-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-posta Adresi
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Sıfırlama Bağlantısı Gönder
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Girişe Dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;