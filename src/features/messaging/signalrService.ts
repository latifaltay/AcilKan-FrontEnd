import * as signalR from "@microsoft/signalr";
import { HUB_URL } from "../../shared/config/env";
import type { MessageDto, NotificationType } from "../../shared/types";

/** Tekil bildirimde `id` vardır, toplu fan-out'ta (örn. yakındaki kan talebi) yoktur. */
export interface NotificationEventPayload {
  id?: string;
  title: string;
  body: string;
  type: NotificationType;
  data: string | null;
  createdAt: string;
}

type MessageListener = (message: MessageDto) => void;
type NotificationListener = (notification: NotificationEventPayload) => void;

class SignalrService {
  private connection: signalR.HubConnection | null = null;
  private startPromise: Promise<void> | null = null;
  private messageListeners: MessageListener[] = [];
  private notificationListeners: NotificationListener[] = [];
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private stoppedByUser = false;

  private getConnection(): signalR.HubConnection {
    if (!this.connection) {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(HUB_URL, {
          accessTokenFactory: () => localStorage.getItem("accessToken") || "",
          // Bearer token; credentials: include CORS wildcard ile çakışıyordu.
          withCredentials: false,
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 20000])
        .build();

      this.connection.on("ReceiveMessage", (message: MessageDto) => {
        this.messageListeners.forEach((listener) => listener(message));
      });

      this.connection.on(
        "ReceiveNotification",
        (notification: NotificationEventPayload) => {
          this.notificationListeners.forEach((listener) =>
            listener(notification)
          );
        }
      );

      this.connection.onclose(() => {
        this.startPromise = null;
        if (!this.stoppedByUser) {
          this.scheduleReconnect();
        }
      });

      this.connection.onreconnecting(() => {
        this.startPromise = null;
      });

      this.connection.onreconnected(() => {
        this.startPromise = null;
      });
    }

    return this.connection;
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer || this.stoppedByUser) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.start().catch(() => {
        this.scheduleReconnect();
      });
    }, 5000);
  }

  async start(): Promise<void> {
    this.stoppedByUser = false;
    const connection = this.getConnection();

    if (connection.state === signalR.HubConnectionState.Connected) {
      return;
    }

    if (
      connection.state === signalR.HubConnectionState.Connecting ||
      connection.state === signalR.HubConnectionState.Reconnecting
    ) {
      if (this.startPromise) return this.startPromise;
    }

    if (!this.startPromise) {
      this.startPromise = connection
        .start()
        .then(() => {
          this.startPromise = null;
        })
        .catch((error) => {
          this.startPromise = null;
          this.scheduleReconnect();
          throw error;
        });
    }

    return this.startPromise;
  }

  async stop(): Promise<void> {
    this.stoppedByUser = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.startPromise = null;
    if (
      this.connection &&
      this.connection.state !== signalR.HubConnectionState.Disconnected
    ) {
      await this.connection.stop();
    }
  }

  onReceiveMessage(listener: MessageListener): () => void {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(
        (l) => l !== listener
      );
    };
  }

  onReceiveNotification(listener: NotificationListener): () => void {
    this.notificationListeners.push(listener);
    return () => {
      this.notificationListeners = this.notificationListeners.filter(
        (l) => l !== listener
      );
    };
  }

  async sendMessage(conversationId: string, content: string): Promise<MessageDto> {
    return this.getConnection().invoke<MessageDto>(
      "SendMessage",
      conversationId,
      content
    );
  }

  async markMessagesRead(conversationId: string): Promise<void> {
    await this.getConnection().invoke("MarkMessagesRead", conversationId);
  }

  getState(): signalR.HubConnectionState {
    return this.getConnection().state;
  }

  isConnected(): boolean {
    return this.getState() === signalR.HubConnectionState.Connected;
  }
}

export const signalrService = new SignalrService();
