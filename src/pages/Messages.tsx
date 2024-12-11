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
            read: false
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
      console.log('Selected contact changed:', selectedContact);
      loadChatHistory(selectedContact.toUserId); // Use toUserId instead of id
      setShowNewMessage(false);
    }
  }, [selectedContact]);


  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const contactsList = await chatService.getContacts();
      console.log('Loaded contacts:', contactsList); // Debug log
      setContacts(contactsList || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async (toUserId: number) => {
    try {
      console.log('Loading chat history for contact:', toUserId); // Debug log
      setIsLoading(true);
      const chatResponse = await chatService.getChats(toUserId);
      
      if (chatResponse && chatResponse.messageInfo) {
        const formattedMessages = chatResponse.messageInfo
          .filter(msg => msg.content) // Filter out empty messages
          .map((msg, index) => ({
            id: index,
            senderId: user?.id || 0,
            content: msg.content,
            timestamp: new Date(msg.sendDate).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            isOwn: index % 2 === 0, // Alternate between sent and received messages
            read: true
          }));
        
        console.log('Formatted messages:', formattedMessages); // Debug log
        setMessages(formattedMessages);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSelect = (contact: Contact) => {
    console.log('Contact selected:', contact); // Debug log
    setSelectedContact(contact);
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
      
      // Reload chat history after sending message
      if (selectedContact) {
        loadChatHistory(selectedContact.id);
      }
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

  const filteredContacts = contacts.filter(contact =>
    contact.userFullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              onSelectContact={handleContactSelect}
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