import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Trash2, Check, CheckCheck, MessageCircle } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      loadChatHistory(selectedContact.id);
    }
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadContacts = async () => {
    try {
      setIsLoading(true);
      const contactsList = await chatService.getContacts();
      setContacts(contactsList || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadChatHistory = async (contactId: string) => {
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

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const EmptyContacts = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <MessageCircle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Henüz hiç mesajınız yok
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        Kan bağışçıları ile iletişime geçerek sohbet başlatabilirsiniz.
      </p>
    </div>
  );

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 min-h-[600px]">
            {/* Contacts Sidebar */}
            <div className="col-span-4 border-r border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Kişi ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div className="overflow-y-auto h-[500px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : filteredContacts.length === 0 ? (
                  <EmptyContacts />
                ) : (
                  filteredContacts.map(contact => (
                    <div
                      key={contact.id}
                      onClick={() => setSelectedContact(contact)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedContact?.id === contact.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-600 font-medium">
                              {contact.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">{contact.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{contact.lastMessage}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">{contact.timestamp}</span>
                          {contact.unread > 0 && (
                            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                              {contact.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="col-span-8">
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 font-medium">
                          {selectedContact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {selectedContact.name}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteChat(selectedContact.id)}
                      className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Messages */}
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

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-16">
                      <MessageCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">
                      Sohbet başlatmak için bir kişi seçin
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Sohbeti Sil
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Bu sohbeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                İptal
              </button>
              <button
                onClick={confirmDeleteChat}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}