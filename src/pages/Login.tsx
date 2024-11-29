import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      await login(formData.email, formData.password);
      // Navigation is handled in the AuthContext after successful login
    } catch (error: any) {
      if (error.response?.status === 401) {
        setErrorMessage('E-posta veya şifre hatalı.');
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setLoading(false);
    }
  };

  const onSwitchToRegister = () => {
    navigate('/register');
  };

  const onForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">Kan Bağışı</h2>
        <p className="text-center text-gray-600 mb-8">Hayat kurtarmak için giriş yapın</p>
        
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
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {errorMessage && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <button
              onClick={onForgotPassword}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Parolamı Unuttum
            </button>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Hesabınız yok mu?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Kayıt Olun
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;