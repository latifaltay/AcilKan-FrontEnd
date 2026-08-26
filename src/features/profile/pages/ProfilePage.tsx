import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getInitials } from "../../../shared/lib/user";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import { getBloodGroupLabel } from "../../../shared/lib/bloodGroups";
import { formatDate } from "../../../shared/lib/date";
import { accountService } from "../../../shared/api/accountService";
import { bloodDonationService } from "../../donations/bloodDonationService";
import type {
  MyDonationOfferDto,
  MyProfileDto,
  ReceivedDonationItemDto,
} from "../../../shared/types";

const OFFER_STATUS_LABELS: Record<MyDonationOfferDto["status"], string> = {
  Pending: "Beklemede",
  Accepted: "Kabul Edildi",
  Confirmed: "Onaylandı",
  Rejected: "Reddedildi",
  Cancelled: "İptal Edildi",
  Expired: "Süresi Doldu",
};

const OFFER_STATUS_COLORS: Record<MyDonationOfferDto["status"], string> = {
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  Accepted: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  Confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  Rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  Cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  Expired: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

export function ProfilePage() {
  const [profile, setProfile] = useState<MyProfileDto | null>(null);
  const [offers, setOffers] = useState<MyDonationOfferDto[]>([]);
  const [receivedDonations, setReceivedDonations] = useState<ReceivedDonationItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"given" | "received">("given");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileData, offersData, receivedData] = await Promise.all([
        accountService.getMe(),
        bloodDonationService.getMyOffers(),
        bloodDonationService.getReceivedDonations(1, 20),
      ]);
      setProfile(profileData);
      setOffers(offersData);
      setReceivedDonations(receivedData.items);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Profil bilgileri yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>
    );
  }

  const fullName = `${profile.name} ${profile.surname}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sol Sidebar - Profil Özeti */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-red-600 dark:text-red-400 font-bold">
                    {getInitials(fullName)}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {fullName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {getBloodGroupLabel(profile.bloodGroup)} Kan Grubu
                </p>
              </div>

              <div className="border-t dark:border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Toplam Bağış
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {profile.totalDonationCount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Son Bağış
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {profile.lastDonationDate ? formatDate(profile.lastDonationDate) : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">
                    Bağış Durumu
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {profile.canDonateNow ? "Uygun" : "Bekleme süresinde"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Ana İçerik */}
          <div className="md:col-span-2">
            {/* Profil Bilgileri */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Profil Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ad Soyad
                  </label>
                  <p className="text-gray-800 dark:text-white">{fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    E-posta
                  </label>
                  <p className="text-gray-800 dark:text-white">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kan Grubu
                  </label>
                  <p className="text-gray-800 dark:text-white">
                    {getBloodGroupLabel(profile.bloodGroup)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Konum
                  </label>
                  <p className="text-gray-800 dark:text-white">
                    {profile.districtName}, {profile.cityName}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Bağış Geçmişi
              </h3>

              {/* Tabs */}
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <div className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("given")}
                    className={`pb-4 text-sm font-medium ${
                      activeTab === "given"
                        ? "border-b-2 border-red-500 text-red-600"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Verdiğim Teklifler
                  </button>
                  <button
                    onClick={() => setActiveTab("received")}
                    className={`pb-4 text-sm font-medium ${
                      activeTab === "received"
                        ? "border-b-2 border-red-500 text-red-600"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300"
                    }`}
                  >
                    Aldığım Bağışlar
                  </button>
                </div>
              </div>

              {activeTab === "given" ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Hasta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Hastane
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Durum
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {offers.map((offer) => (
                        <tr key={offer.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {formatDate(offer.offeredDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {offer.patientName} {offer.patientSurname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {offer.hospitalName ?? "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex flex-wrap items-center gap-1">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${OFFER_STATUS_COLORS[offer.status]}`}
                              >
                                {OFFER_STATUS_LABELS[offer.status]}
                              </span>
                              {offer.isOnWaitlist && offer.status === "Pending" && (
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                  Yedek
                                </span>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {offers.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Henüz bir bağış teklifinde bulunmadınız.
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700">
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Bağışçı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Hasta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Kan Grubu
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {receivedDonations.map((donation) => (
                        <tr key={donation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {formatDate(donation.confirmedAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {donation.donorName} {donation.donorSurname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {donation.patientName} {donation.patientSurname}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                            {getBloodGroupLabel(donation.bloodGroup)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {receivedDonations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Henüz onaylanmış bir bağış almadınız.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
