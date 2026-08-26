import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import type { ConfirmationResult } from "firebase/auth";
import { getFirebaseAuth, getFirebaseAuthModule } from "../../../shared/config/firebase";
import { accountService } from "../../../shared/api/accountService";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { Input } from "../../../shared/ui/Input";
import { Button } from "../../../shared/ui/Button";

interface Props {
  isVerified: boolean;
  onVerified: () => void;
}

/** Firebase Phone Auth (invisible reCAPTCHA + SMS OTP) ile telefon doğrulama akışı. */
export function PhoneVerification({ isVerified, onVerified }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const [{ RecaptchaVerifier, signInWithPhoneNumber }, auth] =
        await Promise.all([getFirebaseAuthModule(), getFirebaseAuth()]);

      if (!recaptchaContainerRef.current) {
        throw new Error("reCAPTCHA konteyneri bulunamadı");
      }

      const verifier = new RecaptchaVerifier(
        auth,
        recaptchaContainerRef.current,
        { size: "invisible" }
      );

      const formattedNumber = phoneNumber.startsWith("+")
        ? phoneNumber
        : `+${phoneNumber.replace(/\D/g, "")}`;

      confirmationResultRef.current = await signInWithPhoneNumber(
        auth,
        formattedNumber,
        verifier
      );
      setStep("otp");
    } catch (err) {
      console.error("SMS gönderim hatası:", err);
      setError("SMS kodu gönderilemedi. Numarayı kontrol edip tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!confirmationResultRef.current) {
      setError("Önce SMS kodu isteyin.");
      return;
    }

    setLoading(true);
    try {
      const credential = await confirmationResultRef.current.confirm(otp);
      const idToken = await credential.user.getIdToken();
      await accountService.confirmPhone(idToken);
      toast.success("Telefon numaranız doğrulandı!");
      onVerified();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Kod doğrulanamadı. Lütfen tekrar deneyin.")
      );
    } finally {
      setLoading(false);
    }
  };

  if (isVerified) {
    return (
      <p className="text-sm text-green-600 dark:text-green-400">
        Telefon numaranız doğrulanmış.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div ref={recaptchaContainerRef} />
      {step === "phone" ? (
        <form onSubmit={handleSendCode} className="space-y-3">
          <Input
            label="Telefon Numarası (Firebase ile SMS doğrulama)"
            type="tel"
            required
            fullWidth
            placeholder="+905XXXXXXXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <Button type="submit" loading={loading}>
            SMS Kodu Gönder
          </Button>
        </form>
      ) : (
        <form onSubmit={handleConfirmCode} className="space-y-3">
          <Input
            label="SMS Kodu"
            required
            fullWidth
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" loading={loading}>
              Doğrula
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("phone")}
            >
              Numarayı Değiştir
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
