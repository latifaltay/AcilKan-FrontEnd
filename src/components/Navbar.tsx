import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Droplet,
  Menu,
  Moon,
  Sun,
  X,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useClickOutside } from "../hooks/useClickOutside";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileDropdownRef, () => {
    setIsProfileOpen(false);
  });
  const { user } = useAuth(); // Ensure 'user' is coming from your auth context

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  const AuthenticatedNav = () => (
    <>
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/home"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Anasayfa
        </Link>
        {/* <Link to="/activeUser" className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium">
          Aktif Kullanıcılar
        </Link> */}
        <Link
          to="/messages"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Mesajlar
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {/* bakılacak */}
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white">
              {user?.name?.[1]?.toUpperCase() || "X"}
              {/* {user?.surname?.[0]?.toUpperCase() || 'X'} */}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profilim
                </div>
              </Link>
              <Link
                to="/AccountSettings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setIsProfileOpen(false)}
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Hesap Ayarları
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/home"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Anasayfa
            </Link>
            <Link
              to="/activeUser"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Aktif Kullanıcılar
            </Link>
            <Link
              to="/messages"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Mesajlar
            </Link>
            <Link
              to="/profile"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Profilim
            </Link>
            <Link
              to="/AccountSettings"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Hesap Ayarları
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </>
  );

  const UnauthenticatedNav = () => (
    <>
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Ana Sayfa
        </Link>
        <Link
          to="/about"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Hakkımızda
        </Link>
        <Link
          to="/contact"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          İletişim
        </Link>
        <Link
          to="/blog"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Blog
        </Link>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <Link
          to="/login"
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
        >
          Giriş Yap
        </Link>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              İletişim
            </Link>
            <Link
              to="/blog"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="block bg-red-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-red-700"
              onClick={() => setIsOpen(false)}
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      )}
    </>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Droplet className="h-8 w-8 text-red-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                KanDostum
              </span>
            </Link>
          </div>

          {isAuthenticated ? <AuthenticatedNav /> : <UnauthenticatedNav />}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
