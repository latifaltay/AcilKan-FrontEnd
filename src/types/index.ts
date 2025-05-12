export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  address: string;
  lastDonation?: string;
  totalDonations?: number;
  avatar?: string;
}

export interface DonationHistory {
  id: number;
  date: string;
  location: string;
  type: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface BloodRequest {
  id: number;
  patientName: string;
  bloodType: string;
  hospital: string;
  location: string;
  urgency: string;
  distance: string;
  unitsNeeded: number;
  createdAt: string;
}

export interface ChatUser {
  id: number;
  name: string;
  avatar?: string;
  bloodType: string;
  lastActive: string;
  isOnline: boolean;
}

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  timestamp: string;
  isRead: boolean;
  isOwn: boolean;
}

export interface ChatConversation {
  id: number;
  participants: ChatUser[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
}

export interface Notification {
  id: number;
  type: 'message' | 'blood_request' | 'donation';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  link?: string;
}