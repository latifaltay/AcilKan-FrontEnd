import { useState } from "react";
import { MapPin, Clock, Droplet } from "lucide-react";
import { toast } from "react-toastify";
import { bloodDonationService } from "../../donations/bloodDonationService";
import { getRelativeTime } from "../../../shared/lib/date";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { getBloodGroupLabel } from "../../../shared/lib/bloodGroups";
import type { BloodRequestDto } from "../../../shared/types";

interface Props {
  request: BloodRequestDto;
}

const STATUS_LABELS: Record<BloodRequestDto["status"], string> = {
  Open: "Açık",
  InProgress: "Devam Ediyor",
  Fulfilled: "Tamamlandı",
  Cancelled: "İptal Edildi",
  Expired: "Süresi Doldu",
};

const STATUS_COLORS: Record<BloodRequestDto["status"], string> = {
  Open: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
  InProgress: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  Fulfilled: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  Cancelled: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  Expired: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
};

export default function BloodRequestCard({ request }: Props) {
  const [offering, setOffering] = useState(false);
  const [offered, setOffered] = useState(false);

  const canOffer = request.status === "Open" || request.status === "InProgress";

  const handleOffer = async () => {
    setOffering(true);
    try {
      const result = await bloodDonationService.createOffer(request.id);
      setOffered(true);
      toast.success(
        result.isOnWaitlist
          ? "Teklifiniz iletildi. Kontenjan dolu; yedek listedesiniz."
          : "Bağış teklifiniz iletildi. Teşekkür ederiz!"
      );
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Bağış teklifi gönderilirken bir hata oluştu.")
      );
    } finally {
      setOffering(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-600">
      <div className="flex justify-between items-start mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
          {getBloodGroupLabel(request.bloodGroup)}
        </span>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[request.status]}`}
        >
          {STATUS_LABELS[request.status]}
        </span>
      </div>

      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
        {request.hospitalName || "Hastane bilgisi yok"}
      </h4>

      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
        <p className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {request.cityName}, {request.districtName}
        </p>
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {getRelativeTime(request.requestDate)}
        </p>
        <p className="flex items-center">
          <Droplet className="h-4 w-4 mr-1" />
          {request.fulfilledUnits} onaylı / {request.reservedUnits} yolda /{" "}
          {request.requiredUnits} ihtiyaç
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hasta: {request.patientName} {request.patientSurname}
        </p>
      </div>

      <button
        onClick={handleOffer}
        disabled={offering || offered || !canOffer}
        className="w-full text-xs bg-red-600 text-white px-2 py-1.5 rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {offered
          ? "Teklif Gönderildi"
          : offering
          ? "Gönderiliyor..."
          : "Teklif Ver"}
      </button>
    </div>
  );
}
