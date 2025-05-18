import React from 'react';
import { Message, MessageStatus } from '../../types/chat';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isOwnMessage }) => {
  const getStatusIcon = (status: MessageStatus) => {
    switch (status) {
      case MessageStatus.SENDING:
        return '🔄';
      case MessageStatus.SENT:
        return '✓';
      case MessageStatus.DELIVERED:
        return '✓✓';
      case MessageStatus.READ:
        return '✓✓';
      case MessageStatus.ERROR:
        return '❌';
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        <div
          className={`text-xs mt-1 flex items-center ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500'
          }`}
        >
          <span>{format(new Date(message.sentAt), 'HH:mm', { locale: tr })}</span>
          {isOwnMessage && (
            <span className="ml-2">{getStatusIcon(message.status)}</span>
          )}
        </div>
      </div>
    </div>
  );
}; 