import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Droplet } from "lucide-react";
import { useAuth } from "../AuthContext";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { getApiErrorMessage, isUnauthorizedError } from "../../../shared/api/apiError";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
    } catch (error) {
      if (isUnauthorizedError(error)) {
        setErrorMessage("E-posta veya şifre hatalı.");
      } else {
        setErrorMessage(
          getApiErrorMessage(
            error,
            "Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin."
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Droplet className="h-10 w-10 text-red-600 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-red-600">Kan Bağışı</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Hayat kurtarmak için giriş yapın
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
        >
          <Input
            id="email"
            label="E-posta Adresi"
            type="email"
            icon={Mail}
            required
            fullWidth
            placeholder="ornek@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <Input
            id="password"
            label="Şifre"
            type="password"
            icon={Lock}
            required
            fullWidth
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          {errorMessage && (
            <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/30 p-2 rounded">
              {errorMessage}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Parolamı Unuttum
          </button>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Hesabınız yok mu?{" "}
            <button
              onClick={() => navigate("/register")}
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
