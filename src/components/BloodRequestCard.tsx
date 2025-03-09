import { MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getRelativeTime } from "../utils/date";
import { useContext } from "react";
import { BloodDonationContext } from "../context/BloodDonationContext";

interface BloodRequest {
  requestId: number;
  requesterId: number;
  requiredUnits: number;
  requesterFullName: string;
  bloodGroupName: string | null;
  hospitalName: string;
  isIndependentDonation: boolean;
  city: string;
  district: string;
  isActive: boolean;
  requestDate: string;
  patientFullName: string;
  status: string;
}

interface Props {
  request: BloodRequest;
  onContact: () => void;
  onDonate: () => void;
}

export default function BloodRequestCard({ request }: Props) {
  const navigate = useNavigate();

  const { setSelectedBloodRequestId } = useContext(BloodDonationContext);

  const handleContact = () => {
    setSelectedBloodRequestId(request.requestId);

    navigate("/messages");
  };

  const handleDonate = async () => {
    try {
      const response = await api.post("/BloodDonation", {
        bloodRequestId: request.requestId,
        isActive: true,
      });

      if (response.status === 200) {
        console.log("Bağış isteği başarıyla gönderildi!");
      }
    } catch (error) {
      console.error("Bağış isteği sırasında hata oluştu:", error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border-l-4 border-red-600">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
            {request.bloodGroupName || "Belirtilmemiş"}
          </span>
          <h4 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {request.hospitalName}
          </h4>
        </div>
      </div>
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300 mb-3">
        <p className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {request.city}, {request.district}
        </p>
        <p className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {getRelativeTime(request.requestDate)}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hasta: {request.patientFullName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Talep Eden: {request.requesterFullName}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gerekli Kan Ünitesi: {request.requiredUnits}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hastane Bağımlı: {request.isIndependentDonation ? "Evet" : "Hayır"}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleContact}
          className="flex-1 text-xs bg-red-600 text-white px-2 py-1.5 rounded hover:bg-red-700 transition-colors"
        >
          İletişime Geç
        </button>
        <button
          onClick={handleDonate}
          className="flex-1 text-xs border border-red-600 text-red-600 px-2 py-1.5 rounded hover:bg-red-50 transition-colors"
        >
          Bağış Yap
        </button>
      </div>
    </div>
  );
}
