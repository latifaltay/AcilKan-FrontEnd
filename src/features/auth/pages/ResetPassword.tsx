import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, Lock, Mail } from "lucide-react";
import { accountService } from "../../../shared/api/accountService";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";
import { getApiErrorMessage } from "../../../shared/api/apiError";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !code) {
      setError("Lütfen e-posta adresinizi ve doğrulama kodunu girin.");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Parolalar eşleşmiyor");
      return;
    }

    if (passwords.newPassword.length < 6) {
      setError("Parola en az 6 karakter olmalıdır");
      return;
    }

    setLoading(true);
    try {
      await accountService.resetPassword(
        email,
        code,
        passwords.newPassword,
        passwords.confirmPassword
      );
      setShowSuccessModal(true);

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Parola sıfırlama işlemi başarısız oldu. Lütfen tekrar deneyin."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold text-center text-red-600 mb-2">
          Yeni Parola Belirle
        </h2>

        <Input
          id="email"
          label="E-posta Adresi"
          type="email"
          icon={Mail}
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          id="code"
          label="Doğrulama Kodu"
          required
          fullWidth
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Yeni Parola
          </label>
          <div className="relative">
            <Input
              icon={Lock}
              type={showNewPassword ? "text" : "password"}
              required
              fullWidth
              className="pr-10"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Yeni Parola (Tekrar)
          </label>
          <div className="relative">
            <Input
              icon={Lock}
              type={showConfirmPassword ? "text" : "password"}
              required
              fullWidth
              className="pr-10"
              value={passwords.confirmPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmPassword: e.target.value })
              }
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth loading={loading}>
          {loading ? "Değiştiriliyor..." : "Parolayı Değiştir"}
        </Button>
      </form>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Parola Başarıyla Değiştirildi
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Yeni parolanız ile giriş yapabilirsiniz. Giriş sayfasına
                yönlendiriliyorsunuz...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
