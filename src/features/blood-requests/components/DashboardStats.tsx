import { useState, useEffect, useCallback } from "react";
import { Heart, Users, Clock } from "lucide-react";
import { profileService } from "../../profile/profileService";
import { formatDate } from "../../../shared/lib/date";

const UNKNOWN = "Bilinmiyor";

export default function DashboardStats() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    nextDonationDate: UNKNOWN,
    lastDonationDate: UNKNOWN,
  });

  const fetchStats = useCallback(async () => {
    try {
      const data = await profileService.getDashboard();
      setStats({
        totalDonations: data.totalDonationCount || 0,
        nextDonationDate: data.canDonateNow
          ? "Şimdi bağış yapabilirsiniz"
          : data.nextEligibleDonationDate
          ? formatDate(data.nextEligibleDonationDate)
          : UNKNOWN,
        lastDonationDate: data.lastDonationDate
          ? formatDate(data.lastDonationDate)
          : UNKNOWN,
      });
    } catch (error) {
      console.error("Dashboard istatistikleri yüklenemedi:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
            <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Toplam Bağış
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.totalDonations}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Yeni Bağış Yapabilme
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.nextDonationDate}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Son Bağış
            </p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {stats.lastDonationDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
