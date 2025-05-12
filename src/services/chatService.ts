import { ChatUser, ChatMessage, ChatConversation } from '../types';
import api from './api';
import { signalRService } from './signalRService';

class ChatService {
  private hubConnection: any; // SignalR bağlantısı için hazırlık

  // Mock data
  private mockUsers: ChatUser[] = [
    {
      id: 1,
      name: 'Ahmet Yılmaz',
      avatar: 'https://placehold.co/100x100/red/white?text=AY',
      bloodType: 'A+',
      lastActive: '5 dk önce',
      isOnline: true
    },
    {
      id: 2,
      name: 'Mehmet Demir',
      avatar: 'https://placehold.co/100x100/red/white?text=MD',
      bloodType: 'B+',
      lastActive: '10 dk önce',
      isOnline: false
    },
    // Daha fazla mock kullanıcı eklenebilir
  ];

  private mockMessages: ChatMessage[] = [
    {
      id: 1,
      senderId: 1,
      receiverId: 2,
      content: 'Merhaba, kan bağışı konusunda yardımcı olabilir misiniz?',
      timestamp: '10:30',
      isRead: true,
      isOwn: true
    },
    {
      id: 2,
      senderId: 2,
      receiverId: 1,
      content: 'Tabii ki, nasıl yardımcı olabilirim?',
      timestamp: '10:32',
      isRead: true,
      isOwn: false
    },
    {
      id: 3,
      senderId: 1,
      receiverId: 2,
      content: 'Yarın kan bağışı yapabilir miyim?',
      timestamp: '10:35',
      isRead: true,
      isOwn: true
    },
    {
      id: 4,
      senderId: 2,
      receiverId: 1,
      content: 'Evet, yarın saat 14:00\'te müsaitim.',
      timestamp: '10:40',
      isRead: false,
      isOwn: false
    }
  ];

  // SignalR bağlantısını başlat
  async startConnection() {
    // SignalR bağlantısı için hazırlık
    console.log('SignalR connection will be implemented here');
  }

  // Kullanıcı listesini getir
  async getUsers(): Promise<ChatUser[]> {
    return this.mockUsers;
  }

  // Konuşma listesini getir
  async getConversations(): Promise<ChatConversation[]> {
    const response = await api.get('/conversations');
    return response.data;
  }

  // Yeni konuşma oluştur
  async createConversation(userId: number): Promise<ChatConversation> {
    const response = await api.post('/conversations', { userId });
    return response.data;
  }

  // Belirli bir konuşmanın mesajlarını getir
  async getMessages(conversationId: number): Promise<ChatMessage[]> {
    const response = await api.get(`/conversations/${conversationId}/messages`);
    return response.data;
  }

  // Yeni mesaj gönder
  async sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'isRead'>): Promise<ChatMessage> {
    const response = await api.post(`/conversations/${message.receiverId}/messages`, {
      content: message.content
    });
    return response.data;
  }

  // Mesajları okundu olarak işaretle
  async markMessagesAsRead(conversationId: number): Promise<void> {
    await api.put(`/conversations/${conversationId}/messages/read`);
  }

  // Konuşmayı sil
  async deleteConversation(conversationId: number): Promise<void> {
    await api.delete(`/conversations/${conversationId}`);
  }

  // SignalR event handlers
  onNewMessage(handler: (message: ChatMessage) => void) {
    signalRService.onNewMessage(handler);
  }

  onMessageRead(handler: (conversationId: number) => void) {
    signalRService.onMessageRead(handler);
  }

  onUserStatusChanged(handler: (userId: number, isOnline: boolean) => void) {
    signalRService.onUserStatusChanged(handler);
  }
}

export const chatService = new ChatService(); 