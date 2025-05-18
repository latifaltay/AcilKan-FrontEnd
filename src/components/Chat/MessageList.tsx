import React, { useEffect, useRef } from 'react';
import { Message } from '../../types/chat';
import { MessageBubble } from './MessageBubble';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';

interface MessageListProps {
  messages: Message[];
  threadId: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, threadId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { markThreadAsRead } = useChat();
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      markThreadAsRead(threadId);
    }
  }, [messages, threadId, markThreadAsRead]);

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === user?.id?.toString()}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}; 