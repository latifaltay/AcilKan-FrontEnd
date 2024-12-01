import React from 'react';
import { Check, CheckCheck, MessageCircle } from 'lucide-react';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  messagesEndRef,
}) => {
  const EmptyMessages = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <MessageCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Henüz mesaj yok
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Bu sohbette henüz hiç mesaj bulunmuyor. Mesaj göndererek sohbeti başlatabilirsiniz.
      </p>
    </div>
  );

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-[400px]">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      ) : messages.length === 0 ? (
        <EmptyMessages />
      ) : (
        messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.isOwn
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <p>{message.content}</p>
              <div className={`text-xs mt-1 flex items-center justify-end ${
                message.isOwn ? 'text-red-100' : 'text-gray-500'
              }`}>
                {message.timestamp}
                {message.isOwn && (
                  <span className="ml-1">
                    {message.read ? (
                      <CheckCheck className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};