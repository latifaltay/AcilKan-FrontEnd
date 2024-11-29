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

export interface Contact {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

export interface Message {
  id: number;
  senderId: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
}