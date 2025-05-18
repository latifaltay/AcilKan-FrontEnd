import React from 'react';
import { ChatContainer } from '../components/Chat/ChatContainer';
import { ChatProvider } from '../context/ChatContext';

const Messages: React.FC = () => {
  return (
    <ChatProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Mesajlar</h1>
        <ChatContainer />
      </div>
    </ChatProvider>
  );
};

export default Messages;