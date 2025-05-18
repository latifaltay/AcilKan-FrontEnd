export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  threadId: string;
  sentAt: Date;
  status: MessageStatus;
  isRead: boolean;
}

export interface Thread {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

export interface ChatState {
  activeThread: Thread | null;
  threads: Thread[];
  messages: Record<string, Message[]>;
  onlineUsers: string[];
  connectionStatus: ConnectionStatus;
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  ERROR = 'error'
}

export enum ConnectionStatus {
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  RECONNECTING = 'reconnecting'
}

export interface SendMessagePayload {
  receiverId: string;
  content: string;
  threadId?: string;
}

export interface ReceiveMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
  threadId: string;
  sentAt: Date;
}

export interface MessagesReadPayload {
  userId: string;
  threadId: string;
} 