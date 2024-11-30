import api from './api';
import * as signalR from '@microsoft/signalr';

interface Message {
  toUserId: string;
  content: string;
}

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

  onMessage(callback: (message: any) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  async getContacts() {
    const response = await api.get('/Chat/GetContacts');
    return response.data;
  }

  async getChats(toUserId: string) {
    const response = await api.get(`/Chat/GetChats?toUserId=${toUserId}`);
    return response.data;
  }

  async sendMessage(message: Message) {
    const response = await api.post('/Chat/SendMessage', message);
    return response.data;
  }

  async deleteChat(contactId: string) {
    const response = await api.delete(`/Chat/DeleteChat/${contactId}`);
    return response.data;
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