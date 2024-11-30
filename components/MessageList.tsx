import React from 'react';
import { useEffect, useState } from 'react';
import { Message, User } from '../src/types';

interface MessageListProps {
  onMessageSelect: (message: Message | null) => void;
  selectedMessage: Message | null;
}

const MessageList: React.FC<MessageListProps> = ({ onMessageSelect, selectedMessage }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});

  useEffect(() => {
    fetchMessages();
    fetchUsers(); // Kullanıcı bilgilerini çek
  }, []);

  const fetchMessages = async () => {
    // API çağrısı yapılacak
    // Örnek veri:
    setMessages([
      { 
        id: 1, 
        senderId: 1,
        text: 'Merhaba',
        timestamp: '2024-03-20',
        isOwn: false
      },
      { 
        id: 2, 
        senderId: 2,
        text: 'Toplantı hakkında',
        timestamp: '2024-03-19',
        isOwn: false
      },
    ]);
  };

  const fetchUsers = async () => {
    // API çağrısı yapılacak
    // Örnek veri:
    setUsers({
      1: { id: 1, name: 'John Doe', email: '', phone: '', bloodType: '', address: '' },
      2: { id: 2, name: 'Jane Smith', email: '', phone: '', bloodType: '', address: '' },
    });
  };

  return (
    <div className="h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">Mesajlar</h2>
      </div>
      <div className="overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
              selectedMessage?.id === message.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onMessageSelect(message)}
          >
            <div className="font-semibold">{users[message.senderId]?.name}</div>
            <div className="text-sm text-gray-600">{message.text}</div>
            <div className="text-xs text-gray-400">{message.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList; 