import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { accountService } from "../../../shared/api/accountService";
import { validateEmail } from "../../../shared/lib/validation";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    setLoading(true);
    try {
      await accountService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError(getApiErrorMessage(err, "Bir hata oluştu. Lütfen tekrar deneyin."));
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
        <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Kod Gönderildi
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              E-posta adresinize 6 haneli bir doğrulama kodu gönderildi.
              Lütfen gelen kutunuzu kontrol edin.
            </p>
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                E-posta birkaç dakika içinde gelmezse, spam klasörünüzü
                kontrol edin.
              </p>
              <Button
                fullWidth
                onClick={() =>
                  navigate("/reset-password", { state: { email } })
                }
              >
                Kodu Girip Parolamı Sıfırla
              </Button>
              <button
                onClick={() => navigate("/login")}
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-600 mb-2">
          Parola Sıfırlama
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Parolanızı sıfırlamak için e-posta adresinizi girin
        </p>

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={loading}>
            {loading ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/login")}
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
