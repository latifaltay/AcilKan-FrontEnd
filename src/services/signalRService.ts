import * as signalR from '@microsoft/signalr';
import { ConnectionStatus, MessageStatus, ReceiveMessagePayload, SendMessagePayload } from '../types/chat';

class SignalRService {
  private hubConnection: signalR.HubConnection | null = null;
  private readonly hubUrl = 'https://localhost:7132/chathub';
  private messageHandlers: ((message: ReceiveMessagePayload) => void)[] = [];
  private connectionStatusHandlers: ((status: ConnectionStatus) => void)[] = [];
  private userConnectedHandlers: ((userId: string) => void)[] = [];
  private userDisconnectedHandlers: ((userId: string) => void)[] = [];
  private messagesReadHandlers: ((userId: string, threadId: string) => void)[] = [];

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection() {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.hubUrl}?access_token=${token}`)
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
        },
      })
      .build();

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (message: ReceiveMessagePayload) => {
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.hubConnection.on('UserConnected', (userId: string) => {
      this.userConnectedHandlers.forEach(handler => handler(userId));
    });

    this.hubConnection.on('UserDisconnected', (userId: string) => {
      this.userDisconnectedHandlers.forEach(handler => handler(userId));
    });

    this.hubConnection.on('MessagesRead', (userId: string, threadId: string) => {
      this.messagesReadHandlers.forEach(handler => handler(userId, threadId));
    });

    this.hubConnection.onreconnecting(() => {
      this.notifyConnectionStatus(ConnectionStatus.RECONNECTING);
    });

    this.hubConnection.onreconnected(() => {
      this.notifyConnectionStatus(ConnectionStatus.CONNECTED);
    });

    this.hubConnection.onclose(() => {
      this.notifyConnectionStatus(ConnectionStatus.DISCONNECTED);
    });
  }

  public async startConnection(): Promise<void> {
    if (!this.hubConnection) {
      this.initializeConnection();
    }

    if (this.hubConnection?.state === signalR.HubConnectionState.Disconnected) {
      try {
        this.notifyConnectionStatus(ConnectionStatus.CONNECTING);
        await this.hubConnection?.start();
        this.notifyConnectionStatus(ConnectionStatus.CONNECTED);
      } catch (error) {
        console.error('SignalR Connection Error:', error);
        this.notifyConnectionStatus(ConnectionStatus.DISCONNECTED);
      }
    }
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.stop();
      this.notifyConnectionStatus(ConnectionStatus.DISCONNECTED);
    }
  }

  public async sendMessage(payload: SendMessagePayload): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      throw new Error('SignalR connection is not established');
    }

    try {
      await this.hubConnection.invoke('SendMessage', payload);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  public onMessage(handler: (message: ReceiveMessagePayload) => void): void {
    this.messageHandlers.push(handler);
  }

  public onConnectionStatus(handler: (status: ConnectionStatus) => void): void {
    this.connectionStatusHandlers.push(handler);
  }

  public onUserConnected(handler: (userId: string) => void): void {
    this.userConnectedHandlers.push(handler);
  }

  public onUserDisconnected(handler: (userId: string) => void): void {
    this.userDisconnectedHandlers.push(handler);
  }

  public onMessagesRead(handler: (userId: string, threadId: string) => void): void {
    this.messagesReadHandlers.push(handler);
  }

  private notifyConnectionStatus(status: ConnectionStatus): void {
    this.connectionStatusHandlers.forEach(handler => handler(status));
  }

  public getConnectionStatus(): ConnectionStatus {
    if (!this.hubConnection) return ConnectionStatus.DISCONNECTED;
    
    switch (this.hubConnection.state) {
      case signalR.HubConnectionState.Connected:
        return ConnectionStatus.CONNECTED;
      case signalR.HubConnectionState.Connecting:
        return ConnectionStatus.CONNECTING;
      case signalR.HubConnectionState.Reconnecting:
        return ConnectionStatus.RECONNECTING;
      default:
        return ConnectionStatus.DISCONNECTED;
    }
  }
}

export const signalRService = new SignalRService(); 