import api from './api';
import * as signalR from '@microsoft/signalr';

class ChatService {
  private hubConnection: signalR.HubConnection;
  private messageCallbacks: ((message: any) => void)[] = [];
  private isConnecting: boolean = false;

  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7132/chatHub', {
        accessTokenFactory: () => localStorage.getItem('accessToken') || ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('ReceiveMessage', (message) => {
      this.messageCallbacks.forEach(callback => callback(message));
    });
  }

  async start() {
    try {
      if (this.isConnecting) return;
      if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.stop();
      }
      
      this.isConnecting = true;
      await this.hubConnection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
      setTimeout(() => this.start(), 5000);
    } finally {
      this.isConnecting = false;
    }
  }

  async getChats(toUserId: string) {
    try {
      const response = await api.get(`/Chat/GetChats?toUserId=${toUserId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chats:', error);
      throw error;
    }
  }

  async sendMessage(message: { toUserId: string; content: string }) {
    try {
      const response = await api.post('/Chat/SendMessage', message);
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async stop() {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.stop();
      this.messageCallbacks = [];
    }
  }

  getConnectionState() {
    return this.hubConnection.state;
  }
}

export const chatService = new ChatService();