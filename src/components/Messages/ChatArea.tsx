import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { ChatHeader } from './ChatHeader';
import { NewMessageForm } from './NewMessageForm';
import { Contact, Message } from '../../types';
import { MessageCircle } from 'lucide-react';

interface ChatAreaProps {
  selectedContact: Contact | null;
  showNewMessage: boolean;
  messages: Message[];
  messageText: string;
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageTextChange: (text: string) => void;
  onDeleteChat: (contactId: number) => void;
  onCancelNewMessage: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedContact,
  showNewMessage,
  messages,
  messageText,
  isLoading,
  messagesEndRef,
  onSendMessage,
  onMessageTextChange,
  onDeleteChat,
  onCancelNewMessage,
}) => {
  if (!selectedContact && !showNewMessage) {
    return (
      <div className="col-span-8 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16">
            <MessageCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Sohbet başlatmak için bir kişi seçin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-8">
      {showNewMessage ? (
        <NewMessageForm
          messageText={messageText}
          onSendMessage={onSendMessage}
          onMessageTextChange={onMessageTextChange}
          onCancel={onCancelNewMessage}
        />
      ) : (
        <>
          <ChatHeader
            contact={selectedContact!}
            onDeleteChat={onDeleteChat}
          />
          <MessageList
            messages={messages}
            isLoading={isLoading}
            messagesEndRef={messagesEndRef}
          />
          <MessageInput
            messageText={messageText}
            onSendMessage={onSendMessage}
            onMessageTextChange={onMessageTextChange}
          />
        </>
      )}
    </div>
  );
};