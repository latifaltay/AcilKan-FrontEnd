import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { toast } from "react-toastify";
import { notificationService } from "./notificationService";
import { signalrService } from "../messaging/signalrService";
import { useClickOutside } from "../../shared/hooks/useClickOutside";
import { formatDate } from "../../shared/lib/date";
import type { NotificationDto } from "../../shared/types";

function readConversationId(data: string | null): string | null {
  if (!data) return null;
  try {
    const parsed = JSON.parse(data) as { conversationId?: string };
    return typeof parsed.conversationId === "string"
      ? parsed.conversationId
      : null;
  } catch {
    return null;
  }
}

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const refreshUnreadCount = useCallback(async () => {
    try {
      setUnreadCount(await notificationService.getUnreadCount());
    } catch (error) {
      console.error("Okunmamış bildirim sayısı alınamadı:", error);
    }
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(1, 20);
      setNotifications(data.items);
    } catch (error) {
      console.error("Bildirimler yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
  }, [refreshUnreadCount]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initialize = async () => {
      try {
        await signalrService.start();
        cleanup = signalrService.onReceiveNotification((notification) => {
          toast.info(`${notification.title}: ${notification.body}`);

          if (notification.id) {
            setNotifications((prev) => [
              {
                id: notification.id!,
                title: notification.title,
                body: notification.body,
                type: notification.type,
                data: notification.data,
                isRead: false,
                createdAt: notification.createdAt,
              },
              ...prev,
            ]);
            setUnreadCount((prev) => prev + 1);
          } else {
            refreshUnreadCount();
          }
        });
      } catch (error) {
        console.error("SignalR bağlantısı kurulamadı:", error);
      }
    };

    initialize();

    return () => cleanup?.();
  }, [refreshUnreadCount]);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    if (next) loadNotifications();
  };

  const handleOpenNotification = async (notification: NotificationDto) => {
    try {
      if (!notification.isRead) {
        await notificationService.markRead(notification.id);
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Bildirim okundu olarak işaretlenemedi:", error);
    }

    const conversationId = readConversationId(notification.data);
    if (conversationId) {
      setIsOpen(false);
      navigate(`/messages?conversationId=${conversationId}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Bildirimler okundu olarak işaretlenemedi:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Bildirimler
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Tümünü okundu işaretle
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
            </div>
          ) : notifications.length === 0 ? (
            <p className="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400">
              Henüz bildiriminiz yok.
            </p>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                onClick={() => handleOpenNotification(notification)}
                className={`block w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  notification.isRead ? "" : "bg-red-50 dark:bg-red-900/20"
                }`}
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {notification.body}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
