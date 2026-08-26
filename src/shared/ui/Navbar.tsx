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
import { useTheme } from "./ThemeContext";
import { useAuth, type AuthUser } from "../../features/auth/AuthContext";
import { useClickOutside } from "../hooks/useClickOutside";
import { getInitials } from "../lib/user";
import NotificationBell from "../../features/notifications/NotificationBell";

interface ThemeToggleProps {
  isDark: boolean;
  toggleTheme: () => void;
}

function ThemeToggleButton({ isDark, toggleTheme }: ThemeToggleProps) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

interface AuthenticatedNavProps extends ThemeToggleProps {
  user: AuthUser | null;
  isOpen: boolean;
  isProfileOpen: boolean;
  profileDropdownRef: React.RefObject<HTMLDivElement | null>;
  onToggleProfile: () => void;
  onCloseProfile: () => void;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
}

function AuthenticatedNav({
  user,
  isDark,
  toggleTheme,
  isOpen,
  isProfileOpen,
  profileDropdownRef,
  onToggleProfile,
  onCloseProfile,
  onCloseMobileMenu,
  onLogout,
}: AuthenticatedNavProps) {
  return (
    <>
      <div className="hidden md:flex items-center space-x-4">
        <Link
          to="/home"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Anasayfa
        </Link>
        <Link
          to="/my-requests"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Taleplerim
        </Link>
        <Link
          to="/my-offers"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Bağış Tekliflerim
        </Link>
        <Link
          to="/messages"
          className="text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Mesajlar
        </Link>
        <NotificationBell />
        <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />

        {/* Profile Dropdown */}
        <div
          className="relative"
          ref={profileDropdownRef as React.RefObject<HTMLDivElement>}
        >
          <button
            onClick={onToggleProfile}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {getInitials(user?.name)}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onCloseProfile}
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Profilim
                </div>
              </Link>
              <Link
                to="/account-settings"
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={onCloseProfile}
              >
                <div className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Hesap Ayarları
                </div>
              </Link>
              <button
                onClick={onLogout}
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
              onClick={onCloseMobileMenu}
            >
              Anasayfa
            </Link>
            <Link
              to="/my-requests"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Taleplerim
            </Link>
            <Link
              to="/my-offers"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Bağış Tekliflerim
            </Link>
            <Link
              to="/messages"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Mesajlar
            </Link>
            <Link
              to="/profile"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Profilim
            </Link>
            <Link
              to="/account-settings"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Hesap Ayarları
            </Link>
            <button
              onClick={onLogout}
              className="block w-full text-left text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </>
  );
}

interface UnauthenticatedNavProps extends ThemeToggleProps {
  isOpen: boolean;
  onCloseMobileMenu: () => void;
}

function UnauthenticatedNav({
  isDark,
  toggleTheme,
  isOpen,
  onCloseMobileMenu,
}: UnauthenticatedNavProps) {
  return (
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
        <ThemeToggleButton isDark={isDark} toggleTheme={toggleTheme} />
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
              onClick={onCloseMobileMenu}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/about"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Hakkımızda
            </Link>
            <Link
              to="/contact"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              İletişim
            </Link>
            <Link
              to="/blog"
              className="block text-gray-700 dark:text-gray-200 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium"
              onClick={onCloseMobileMenu}
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="block bg-red-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-red-700"
              onClick={onCloseMobileMenu}
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(profileDropdownRef, () => {
    setIsProfileOpen(false);
  });

  const handleLogout = () => {
    void logout();
    setIsProfileOpen(false);
  };

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

          {isAuthenticated ? (
            <AuthenticatedNav
              user={user}
              isDark={isDark}
              toggleTheme={toggleTheme}
              isOpen={isOpen}
              isProfileOpen={isProfileOpen}
              profileDropdownRef={profileDropdownRef}
              onToggleProfile={() => setIsProfileOpen((prev) => !prev)}
              onCloseProfile={() => setIsProfileOpen(false)}
              onCloseMobileMenu={() => setIsOpen(false)}
              onLogout={handleLogout}
            />
          ) : (
            <UnauthenticatedNav
              isDark={isDark}
              toggleTheme={toggleTheme}
              isOpen={isOpen}
              onCloseMobileMenu={() => setIsOpen(false)}
            />
          )}

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
