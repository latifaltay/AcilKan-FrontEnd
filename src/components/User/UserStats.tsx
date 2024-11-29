import React from 'react';
import { Users, Heart, Bell, Calendar } from 'lucide-react';

export default function UserStats() {
  const stats = [
    {
      title: "Toplam Kullanıcı",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "blue"
    },
    {
      title: "Toplam Bağış",
      value: "856",
      change: "+23%",
      icon: Heart,
      color: "red"
    },
    {
      title: "Aktif İlanlar",
      value: "43",
      change: "+8%",
      icon: Bell,
      color: "yellow"
    },
    {
      title: "Bu Ay",
      value: "156",
      change: "+15%",
      icon: Calendar,
      color: "green"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
              <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
                <p className={`ml-2 text-sm font-medium text-${stat.color}-600`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}