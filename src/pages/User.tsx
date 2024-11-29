import React from 'react';
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Heart,
  Bell,
  Calendar,
  TrendingUp
} from 'lucide-react';
import UserStats from '../components/User/UserStats';
import UserChart from '../components/User/UserChart';
import RecentDonations from '../components/User/RecentDonations';
import UserSidebar from '../components/User/UserSidebar';

export default function User() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        <UserSidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Yönetim Paneli
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sistem istatistikleri ve yönetim araçları
              </p>
            </div>

            {/* Stats Grid */}
            <UserStats />

            {/* Charts Section */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UserChart
                title="Aylık Kan Bağışları"
                type="bar"
                data={[65, 59, 80, 81, 56, 55, 40]}
                labels={['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz']}
              />
              <UserChart
                title="Kan Grubu Dağılımı"
                type="doughnut"
                data={[30, 20, 25, 15, 10]}
                labels={['A Rh+', 'O Rh+', 'B Rh+', 'AB Rh+', 'Diğer']}
              />
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <RecentDonations />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}