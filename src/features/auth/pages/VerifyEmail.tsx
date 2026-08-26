import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailCheck } from "lucide-react";
import { toast } from "react-toastify";
import { accountService } from "../../../shared/api/accountService";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = (location.state as { email?: string } | null)?.email ?? "";

  const [email, setEmail] = useState(emailFromState);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Lütfen e-posta adresinizi girin.");
      return;
    }

    setSubmitting(true);
    try {
      await accountService.confirmEmail(email, code);
      toast.success("E-posta adresiniz doğrulandı! Şimdi giriş yapabilirsiniz.");
      navigate("/login");
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Doğrulama başarısız oldu. Kodu kontrol edip tekrar deneyin."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Kodu tekrar göndermek için e-posta adresinizi girin.");
      return;
    }

    setResending(true);
    try {
      await accountService.resendEmailConfirmation(email);
      toast.success("Doğrulama kodu tekrar gönderildi.");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Kod gönderilemedi. Lütfen tekrar deneyin."));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <MailCheck className="h-10 w-10 text-red-600 mx-auto mb-2" />
          <h2 className="text-3xl font-bold text-red-600">E-postanızı Doğrulayın</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {email
              ? `${email} adresine gönderilen 6 haneli kodu girin.`
              : "E-posta adresinize gönderilen 6 haneli kodu girin."}
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

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/30 p-2 rounded">
              {error}
            </div>
          )}

          <Button type="submit" fullWidth loading={submitting}>
            {submitting ? "Doğrulanıyor..." : "Doğrula"}
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="w-full text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            {resending ? "Gönderiliyor..." : "Kodu Tekrar Gönder"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;
