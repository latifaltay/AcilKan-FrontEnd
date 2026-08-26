export interface ConversationSummaryDto {
  id: string;
  bloodDonationId: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartySurname: string;
  lastMessageContent: string | null;
  lastMessageAt: string | null;
  unreadCount: number;
  /** Yalnızca ilgili bağış teklifi Pending veya Accepted iken true. */
  canSendMessage: boolean;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  isRead: boolean;
}
