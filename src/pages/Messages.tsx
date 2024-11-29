import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Trash2, Check, CheckCheck } from 'lucide-react';
import { chatService } from '../services/chatService';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: number;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  read: boolean;
}

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

export default function Messages() {
  const { user } = useAuth();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);

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
      loadChatHistory(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async (contactId: string) => {
    try {
      const history = await chatService.getChats(contactId);
      setMessages(history.map((msg: any) => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: msg.senderId === user?.id,
        read: msg.read
      })));
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact || !user) return;

    try {
      await chatService.sendMessage({
        toUserId: selectedContact.id,
        content: messageText
      });

      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDeleteChat = (contactId: string) => {
    setContactToDelete(contactId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteChat = () => {
    if (contactToDelete) {
      setContacts(contacts.filter(contact => contact.id !== contactToDelete));
      if (selectedContact?.id === contactToDelete) {
        setSelectedContact(null);
        setMessages([]);
      }
      setShowDeleteConfirm(false);
      setContactToDelete(null);
    }
  };

  // Rest of the component JSX remains the same...
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      {/* Existing JSX */}
    </div>
  );
}