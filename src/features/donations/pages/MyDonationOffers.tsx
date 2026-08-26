import { useState, useEffect, useCallback } from "react";
import { Clock } from "lucide-react";
import { toast } from "react-toastify";
import { bloodDonationService } from "../bloodDonationService";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { formatDate } from "../../../shared/lib/date";
import { Button } from "../../../shared/ui/Button";
import { Input } from "../../../shared/ui/Input";
import type { MyDonationOfferDto } from "../../../shared/types";

const STATUS_LABELS: Record<MyDonationOfferDto["status"], string> = {
  Pending: "Beklemede",
  Accepted: "Kabul Edildi",
  Confirmed: "Onaylandı",
  Rejected: "Reddedildi",
  Cancelled: "İptal Edildi",
  Expired: "Süresi Doldu",
};

const STATUS_COLORS: Record<MyDonationOfferDto["status"], string> = {
  Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  Accepted: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  Confirmed: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  Rejected: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  Cancelled: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  Expired: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
};

export default function MyDonationOffers() {
  const [offers, setOffers] = useState<MyDonationOfferDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [codeInputs, setCodeInputs] = useState<Record<string, string>>({});

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setOffers(await bloodDonationService.getMyOffers());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Teklifleriniz yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const handleCancel = async (offerId: string) => {
    setBusyId(offerId);
    try {
      await bloodDonationService.cancelOffer(offerId);
      toast.success("Teklif iptal edildi.");
      loadOffers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Teklif iptal edilemedi."));
    } finally {
      setBusyId(null);
    }
  };

  const handleMedicalReject = async (offerId: string) => {
    setBusyId(offerId);
    try {
      await bloodDonationService.medicalReject(offerId);
      toast.success("Tıbbi red kaydedildi.");
      loadOffers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Tıbbi red işlemi başarısız."));
    } finally {
      setBusyId(null);
    }
  };

  const handleConfirm = async (offerId: string) => {
    const code = codeInputs[offerId];
    if (!code || code.length !== 6) return;

    setBusyId(offerId);
    try {
      await bloodDonationService.confirmOffer(offerId, code);
      toast.success("Bağışınız onaylandı, teşekkür ederiz!");
      loadOffers();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Kod doğrulanamadı."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Bağış Tekliflerim
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : offers.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
            Henüz bir bağış teklifinde bulunmadınız.
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[offer.status]}`}
                    >
                      {STATUS_LABELS[offer.status]}
                    </span>
                    {offer.isOnWaitlist && offer.status === "Pending" && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
                        Yedek listedesiniz
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {offer.patientName} {offer.patientSurname}
                    {offer.hospitalName ? ` · ${offer.hospitalName}` : ""}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Teklif tarihi: {formatDate(offer.offeredDate)}
                  </p>
                  {offer.status === "Accepted" && offer.confirmationCodeExpiresAt && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Kod süresi: {formatDate(offer.confirmationCodeExpiresAt)}
                    </p>
                  )}
                  {offer.isOnWaitlist && offer.status === "Pending" && (
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Kontenjan dolu; slot açılırsa sıranız gelebilir.
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {(offer.status === "Pending" || offer.status === "Accepted") && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={busyId === offer.id}
                      onClick={() => handleCancel(offer.id)}
                    >
                      İptal Et
                    </Button>
                  )}
                  {offer.status === "Accepted" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busyId === offer.id}
                        onClick={() => handleMedicalReject(offer.id)}
                      >
                        Kan veremedim / tıbbi red
                      </Button>
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Hastanede size verilen kod"
                          maxLength={6}
                          value={codeInputs[offer.id] ?? ""}
                          onChange={(e) =>
                            setCodeInputs((prev) => ({
                              ...prev,
                              [offer.id]: e.target.value.replace(/\D/g, ""),
                            }))
                          }
                          className="w-40"
                        />
                        <Button
                          size="sm"
                          disabled={
                            busyId === offer.id ||
                            (codeInputs[offer.id] ?? "").length !== 6
                          }
                          onClick={() => handleConfirm(offer.id)}
                        >
                          Onayla
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
