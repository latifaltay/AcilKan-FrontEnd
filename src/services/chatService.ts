import api from './api';
import * as signalR from '@microsoft/signalr';
import { Contact, Message as MessageType, ChatResponse } from '../types';

interface Message {
  toUserId: number;
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

  onMessage(callback: (message: MessageType) => void) {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
    };
  }

  async getContacts() {
    try {
      const response = await api.get<Contact[]>('/Chat/GetContacts');
      console.log('Contacts loaded:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error loading contacts:', error);
      throw error;
    }
  }

  async getChats(toUserId: number) {
    try {
      console.log('Fetching chat history for userId:', toUserId); // Debug log
      const response = await api.get<ChatResponse>(`/Chat/GetChats/${toUserId}`);
      console.log('Chat history response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  async sendMessage(message: Message) {
    const response = await api.post('/Chat/SendMessage', message);
    return response.data;
  }

  async deleteChat(contactId: number) {
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