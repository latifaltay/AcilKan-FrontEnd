import { Notification } from '../types';
import api from './api';
import { signalRService } from './signalRService';

class NotificationService {
  // Tüm bildirimleri getir
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  }

  // Okunmamış bildirim sayısını getir
  async getUnreadCount(): Promise<number> {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  }

  // Bildirimi okundu olarak işaretle
  async markAsRead(id: number): Promise<void> {
    await api.put(`/notifications/${id}/read`);
  }

  // Tüm bildirimleri okundu olarak işaretle
  async markAllAsRead(): Promise<void> {
    await api.put('/notifications/read-all');
  }

  // SignalR event handler
  onNewNotification(handler: (notification: Notification) => void) {
    signalRService.onNewNotification(handler);
  }
}

export const notificationService = new NotificationService(); 