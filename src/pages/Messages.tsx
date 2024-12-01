import React, { useState, useEffect, useRef, useContext } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { BloodDonationContext } from '../context/BloodDonationContext';
import { ContactList } from '../components/Messages/ContactList';
import { ChatArea } from '../components/Messages/ChatArea';
import { DeleteConfirmModal } from '../components/Messages/DeleteConfirmModal';
import { Contact, Message } from '../types';

export default function Messages() {
  const { user } = useAuth();
  const { selectedBloodRequestId, setSelectedBloodRequestId } = useContext(BloodDonationContext);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewMessage, setShowNewMessage] = useState(false);

  useEffect(() => {
    if (selectedBloodRequestId) {
      setShowNewMessage(true);
    }
  }, [selectedBloodRequestId]);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initializeChat = async () => {
      if (isConnecting) return;
      setIsConnecting(true);
      
      try {
        await chatService.start();
        cleanup = chatService.onMessage((message) => {
          setMessages(prev => [...prev, {
            id: message.id,
            senderId: message.senderId,
            content: message.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: message.senderId === user?.id,
            read: false,
            text: message.text
          }]);
        });
      } catch (error) {
        console.error('Failed to initialize chat:', error);
      } finally {
        setIsConnecting(false);
      }
    };

    initializeChat();

    return () => {
      if (cleanup) cleanup();
      chatService.stop();
    };
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      loadChatHistory(selectedContact.id);
      setShowNewMessage(false);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const contactsList = await chatService.getContacts();
      console.log("🚀 ~ loadContacts ~ contactsList:", contactsList)
      setContacts(contactsList || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async (contactId: number) => {
    try {
      setIsLoading(true);
      const history = await chatService.getChats(contactId);
      setMessages(history ? history.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: msg.senderId === user?.id,
        read: msg.read
      })) : []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    try {
      if (showNewMessage && selectedBloodRequestId) {
        await chatService.sendMessage({
          toUserId: selectedBloodRequestId,
          content: messageText
        });
        setShowNewMessage(false);
        setSelectedBloodRequestId(undefined);
      } else if (selectedContact) {
        await chatService.sendMessage({
          toUserId: selectedContact.id,
          content: messageText
        });
      }
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteChat = (contactId: number) => {
    setContactToDelete(contactId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteChat = async () => {
    if (contactToDelete) {
      try {
        await chatService.deleteChat(contactToDelete);
        setContacts(contacts.filter(contact => contact.id !== contactToDelete));
        if (selectedContact?.id === contactToDelete) {
          setSelectedContact(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error deleting chat:', error);
      } finally {
        setShowDeleteConfirm(false);
        setContactToDelete(null);
      }
    }
  };

  const handleCancelNewMessage = () => {
    setShowNewMessage(false);
    setSelectedBloodRequestId(undefined);
    setMessageText('');
  };


  // const filteredContacts = contacts.filter(contact =>
  //   //contact.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) 

  //   console.log("🚀 ~ Messages ~ contact:", contact)
  // ); 
  
  //console.log("🚀 ~ Messages ~ filteredContacts:", filteredContacts)

  const filteredContacts = contacts;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 min-h-[600px]">
            <ContactList
              contacts={filteredContacts}
              selectedContact={selectedContact}
              searchQuery={searchQuery}
              isLoading={isLoading}
              onSearchChange={setSearchQuery}
              onSelectContact={setSelectedContact}
            />
            <ChatArea
              selectedContact={selectedContact}
              showNewMessage={showNewMessage}
              messages={messages}
              messageText={messageText}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              onSendMessage={handleSendMessage}
              onMessageTextChange={setMessageText}
              onDeleteChat={handleDeleteChat}
              onCancelNewMessage={handleCancelNewMessage}
            />
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={confirmDeleteChat}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}