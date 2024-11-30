import React from 'react';
import { useState, Dispatch, SetStateAction } from 'react';
import MessageList from '../components/MessageList';
import NewMessageForm from '../components/NewMessageForm';
import Layout from '../components/Layout';
import { Message } from '../src/types';

const MessagesPage: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const handleMessageSelect = (message: Message | null) => {
    setSelectedMessage(message);
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-1/3 border-r">
          <MessageList 
            onMessageSelect={handleMessageSelect}
            selectedMessage={selectedMessage}
          />
        </div>
        
        <div className="w-2/3 p-4">
          <NewMessageForm />
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage; 