import { useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronUp, Clock, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { bloodRequestService } from "../../blood-requests/bloodRequestService";
import { bloodDonationService } from "../bloodDonationService";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { getBloodGroupLabel } from "../../../shared/lib/bloodGroups";
import { formatDate } from "../../../shared/lib/date";
import { Button } from "../../../shared/ui/Button";
import type { BloodDonationOfferDto, BloodRequestDto } from "../../../shared/types";

const OFFER_STATUS_LABELS: Record<BloodDonationOfferDto["status"], string> = {
  Pending: "Beklemede",
  Accepted: "Kabul Edildi",
  Confirmed: "Onaylandı",
  Rejected: "Reddedildi",
  Cancelled: "İptal Edildi",
  Expired: "Süresi Doldu",
};

const REQUEST_STATUS_LABELS: Record<BloodRequestDto["status"], string> = {
  Open: "Açık",
  InProgress: "Devam Ediyor",
  Fulfilled: "Tamamlandı",
  Cancelled: "İptal Edildi",
  Expired: "Süresi Doldu",
};

function canAcceptOffer(request: BloodRequestDto): boolean {
  return (
    (request.status === "Open" || request.status === "InProgress") &&
    request.reservedUnits + request.fulfilledUnits < request.requiredUnits
  );
}

function OfferRow({
  offer,
  canAccept,
  onAccept,
  onReject,
  onRegenerate,
}: {
  offer: BloodDonationOfferDto;
  canAccept: boolean;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  onRegenerate: (id: string) => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  const wrap = (fn: () => Promise<void>) => async () => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-medium text-gray-900 dark:text-white">
            {offer.donorName} {offer.donorSurname}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
            {getBloodGroupLabel(offer.donorBloodGroup)}
          </span>
          {offer.isOnWaitlist && offer.status === "Pending" && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200">
              Yedek
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {OFFER_STATUS_LABELS[offer.status]} · {formatDate(offer.offeredDate)}
        </p>
        {offer.status === "Accepted" && offer.confirmationCode && (
          <p className="text-sm mt-1 text-red-600 dark:text-red-400 font-mono">
            Onay Kodu: <span className="font-bold">{offer.confirmationCode}</span>
            {offer.confirmationCodeExpiresAt && (
              <span className="ml-2 text-gray-500 dark:text-gray-400 font-normal inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {formatDate(offer.confirmationCodeExpiresAt)}
                &apos;a kadar geçerli
              </span>
            )}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {offer.status === "Pending" && (
          <>
            <Button
              size="sm"
              disabled={busy || !canAccept}
              title={
                !canAccept
                  ? "Rezervasyon kontenjanı dolu"
                  : undefined
              }
              onClick={wrap(() => onAccept(offer.id))}
            >
              Kabul Et
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={wrap(() => onReject(offer.id))}
            >
              Reddet
            </Button>
          </>
        )}
        {offer.status === "Accepted" && (
          <>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={wrap(() => onRegenerate(offer.id))}
            >
              <RefreshCw className="h-3.5 w-3.5 mr-1" />
              Yeni kod üret
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={wrap(() => onReject(offer.id))}
            >
              Rezervasyonu İptal
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MyRequests() {
  const [requests, setRequests] = useState<BloodRequestDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [offersByRequest, setOffersByRequest] = useState<
    Record<string, BloodDonationOfferDto[]>
  >({});
  const [loadingOffers, setLoadingOffers] = useState<Record<string, boolean>>({});
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await bloodRequestService.getMyBloodRequests();
      setRequests(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Talepleriniz yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const loadOffers = useCallback(async (requestId: string) => {
    setLoadingOffers((prev) => ({ ...prev, [requestId]: true }));
    try {
      const offers = await bloodDonationService.getOffersForRequest(requestId);
      setOffersByRequest((prev) => ({ ...prev, [requestId]: offers }));
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Teklifler yüklenemedi."));
    } finally {
      setLoadingOffers((prev) => ({ ...prev, [requestId]: false }));
    }
  }, []);

  const handleToggle = (requestId: string) => {
    const next = expandedId === requestId ? null : requestId;
    setExpandedId(next);
    if (next !== null && !offersByRequest[next]) {
      loadOffers(next);
    }
  };

  const handleAccept = async (offerId: string, requestId: string) => {
    try {
      const result = await bloodDonationService.acceptOffer(offerId);
      toast.success(
        `Teklif kabul edildi. Onay kodu: ${result.confirmationCode}`
      );
      await Promise.all([loadOffers(requestId), loadRequests()]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Teklif kabul edilemedi."));
    }
  };

  const handleReject = async (offerId: string, requestId: string) => {
    try {
      await bloodDonationService.rejectOffer(offerId);
      toast.success("Teklif reddedildi.");
      await Promise.all([loadOffers(requestId), loadRequests()]);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Teklif reddedilemedi."));
    }
  };

  const handleRegenerate = async (offerId: string, requestId: string) => {
    try {
      const result = await bloodDonationService.regenerateCode(offerId);
      toast.success(
        `Yeni kod üretildi: ${result.confirmationCode}`
      );
      loadOffers(requestId);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Kod yenilenemedi."));
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    setCancellingId(requestId);
    try {
      await bloodRequestService.cancelBloodRequest(requestId);
      toast.success("Talep iptal edildi.");
      setExpandedId(null);
      loadRequests();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Talep iptal edilemedi."));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Taleplerim
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center text-gray-500 dark:text-gray-400">
            Henüz bir kan talebi oluşturmadınız.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => {
              const isActive =
                request.status === "Open" || request.status === "InProgress";
              return (
                <div
                  key={request.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-2 p-4">
                    <button
                      onClick={() => handleToggle(request.id)}
                      className="flex-1 flex items-center justify-between text-left min-w-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {request.patientName} {request.patientSurname} ·{" "}
                          {getBloodGroupLabel(request.bloodGroup)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {request.fulfilledUnits} onaylı / {request.reservedUnits}{" "}
                          yolda / {request.requiredUnits} ihtiyaç ·{" "}
                          {REQUEST_STATUS_LABELS[request.status]} ·{" "}
                          {formatDate(request.requestDate)}
                        </p>
                      </div>
                      {expandedId === request.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                    {isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={cancellingId === request.id}
                        onClick={() => handleCancelRequest(request.id)}
                      >
                        Talebi İptal Et
                      </Button>
                    )}
                  </div>

                  {expandedId === request.id && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                      {loadingOffers[request.id] ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                        </div>
                      ) : (offersByRequest[request.id] ?? []).length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                          Bu talebe henüz teklif gelmedi.
                        </p>
                      ) : (
                        offersByRequest[request.id].map((offer) => (
                          <OfferRow
                            key={offer.id}
                            offer={offer}
                            canAccept={canAcceptOffer(request)}
                            onAccept={(id) => handleAccept(id, request.id)}
                            onReject={(id) => handleReject(id, request.id)}
                            onRegenerate={(id) =>
                              handleRegenerate(id, request.id)
                            }
                          />
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
