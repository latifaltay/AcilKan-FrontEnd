import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  Bell,
  LogOut,
  Droplet
} from 'lucide-react';

export default function UserSidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 h-screen shadow-lg fixed">
      <div className="p-4">
        <Link to="/user" className="flex items-center space-x-2">
          <Droplet className="h-8 w-8 text-red-600" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">KanDostum</span>
        </Link>
      </div>

      <nav className="mt-8">
        <div className="px-4 space-y-2">
          <Link
            to="/user"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/user/users"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Users className="h-5 w-5" />
            <span>Kullanıcılar</span>
          </Link>

          <Link
            to="/user/content"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <FileText className="h-5 w-5" />
            <span>İçerik Yönetimi</span>
          </Link>

          <Link
            to="/user/notifications"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Bell className="h-5 w-5" />
            <span>Bildirimler</span>
          </Link>

          <Link
            to="/user/settings"
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Settings className="h-5 w-5" />
            <span>Ayarlar</span>
          </Link>

          <button
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </nav>
    </div>
  );
}