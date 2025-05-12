import * as signalR from '@microsoft/signalr';
import { ChatMessage, Notification } from '../types';

class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private notificationHandlers: ((notification: Notification) => void)[] = [];
  private userStatusHandlers: ((userId: number, isOnline: boolean) => void)[] = [];
  private messageReadHandlers: ((conversationId: number) => void)[] = [];

  constructor() {
    this.startConnection();
  }

  private async startConnection() {
    try {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL || 'https://localhost:7132'}/chatHub`, {
          accessTokenFactory: () => localStorage.getItem('token') || ''
        })
        .withAutomaticReconnect()
        .build();

      // Client methods
      this.hubConnection.on('onNewMessage', (message: ChatMessage) => {
        this.messageHandlers.forEach(handler => handler(message));
      });

      this.hubConnection.on('onNewNotification', (notification: Notification) => {
        this.notificationHandlers.forEach(handler => handler(notification));
      });

      this.hubConnection.on('onUserStatusChanged', (userId: number, isOnline: boolean) => {
        this.userStatusHandlers.forEach(handler => handler(userId, isOnline));
      });

      this.hubConnection.on('onMessageRead', (conversationId: number) => {
        this.messageReadHandlers.forEach(handler => handler(conversationId));
      });

      await this.hubConnection.start();
      await this.hubConnection.invoke('userConnected');
      console.log('SignalR Connected');
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      setTimeout(() => this.startConnection(), 5000);
    }
  }

  // Event handlers
  public onNewMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
  }

  public onNewNotification(handler: (notification: Notification) => void) {
    this.notificationHandlers.push(handler);
  }

  public onUserStatusChanged(handler: (userId: number, isOnline: boolean) => void) {
    this.userStatusHandlers.push(handler);
  }

  public onMessageRead(handler: (conversationId: number) => void) {
    this.messageReadHandlers.push(handler);
  }

  // Server methods
  public async sendMessage(conversationId: number, content: string) {
    if (this.hubConnection) {
      await this.hubConnection.invoke('sendMessage', conversationId, content);
    }
  }

  public async markMessagesAsRead(conversationId: number) {
    if (this.hubConnection) {
      await this.hubConnection.invoke('markMessagesAsRead', conversationId);
    }
  }

  public async disconnect() {
    if (this.hubConnection) {
      await this.hubConnection.invoke('userDisconnected');
      await this.hubConnection.stop();
    }
  }
}

export const signalRService = new SignalRService(); 