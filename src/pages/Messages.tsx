import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Send, X, MessageCircle, Trash2 } from 'lucide-react';
import { chatService } from '../services/chatService';
import { ChatUser, ChatMessage, ChatConversation } from '../types';
import { DeleteConfirmModal } from '../components/Messages/DeleteConfirmModal';
import { signalRService } from '../services/signalRService';

export default function Messages() {
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<ChatConversation | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();

    // Kan isteğinden gelen kullanıcı ID'si varsa, o kullanıcıyla konuşmayı başlat
    const selectedUserId = location.state?.selectedUserId;
    if (selectedUserId) {
      const conversation = conversations.find(conv => conv.participants[0].id === selectedUserId);
      if (conversation) {
        setSelectedConversation(conversation);
        loadMessages(conversation.id);
      } else {
        // Eğer konuşma yoksa, yeni bir konuşma başlat
        startNewConversation(selectedUserId);
      }
    }

    // SignalR event handlers
    chatService.onNewMessage((message) => {
      if (selectedConversation?.id === message.senderId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
      }
      // Konuşma listesini güncelle
      loadConversations();
    });

    chatService.onMessageRead((conversationId) => {
      if (selectedConversation?.id === conversationId) {
        setMessages(prev => prev.map(msg => ({ ...msg, isRead: true })));
      }
      // Konuşma listesini güncelle
      loadConversations();
    });

    chatService.onUserStatusChanged((userId, isOnline) => {
      setConversations(prev => prev.map(conv => {
        if (conv.participants[0].id === userId) {
          return {
            ...conv,
            participants: [
              { ...conv.participants[0], isOnline }
            ]
          };
        }
        return conv;
      }));
    });

    return () => {
      // Cleanup
      signalRService.disconnect();
    };
  }, [selectedConversation, location.state]);

  const startNewConversation = async (userId: number) => {
    try {
      // Yeni konuşma oluştur
      const response = await chatService.createConversation(userId);
      setSelectedConversation(response);
      setMessages([]);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      setIsLoading(true);
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
      // Mesajlar yüklendikten sonra scroll yap
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    const messageContainer = document.getElementById('messageContainer');
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  };

  // Mesajlar değiştiğinde scroll yap
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    const trimmedMessage = messageText.trim();
    setMessageText(''); // Önce input'u temizleyelim

    try {
      const newMessage = await chatService.sendMessage({
        senderId: 1, // Mock user ID
        receiverId: selectedConversation.participants[0].id,
        content: trimmedMessage,
        isOwn: true
      });

      // Mesajları güncelle
      setMessages(prevMessages => [...prevMessages, newMessage]);

      // Konuşma listesini güncelle
      const updatedConversations = await chatService.getConversations();
      setConversations(updatedConversations);

      // Seçili konuşmayı güncelle
      const updatedConversation = updatedConversations.find(
        conv => conv.id === selectedConversation.id
      );
      if (updatedConversation) {
        setSelectedConversation(updatedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageText(trimmedMessage);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, conversation: ChatConversation) => {
    e.stopPropagation(); // Prevent conversation selection
    setConversationToDelete(conversation);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (conversationToDelete) {
      try {
        await chatService.deleteConversation(conversationToDelete.id);
        setConversations(prev => prev.filter(conv => conv.id !== conversationToDelete.id));
        if (selectedConversation?.id === conversationToDelete.id) {
          setSelectedConversation(null);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error deleting conversation:', error);
      } finally {
        setShowDeleteModal(false);
        setConversationToDelete(null);
      }
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 min-h-[600px]">
            {/* Sol Panel - Konuşma Listesi */}
            <div className="col-span-4 border-r border-gray-200 dark:border-gray-700">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Konuşma ara..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[500px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <p className="text-gray-500 dark:text-gray-400">
                      Henüz hiç konuşmanız yok
                    </p>
                  </div>
                ) : (
                  filteredConversations.map(conversation => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        selectedConversation?.id === conversation.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.participants[0].avatar}
                            alt={conversation.participants[0].name}
                            className="w-12 h-12 rounded-full"
                          />
                          {conversation.participants[0].isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {conversation.participants[0].name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {conversation.lastMessage && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {conversation.lastMessage.timestamp}
                                </span>
                              )}
                              <button
                                onClick={(e) => handleDeleteClick(e, conversation)}
                                className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                              {conversation.lastMessage ? (
                                conversation.lastMessage.content
                              ) : (
                                'Henüz mesaj yok'
                              )}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Sağ Panel - Mesajlaşma Alanı */}
            <div className="col-span-8">
              {selectedConversation ? (
                <>
                  {/* Sohbet Başlığı */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src={selectedConversation.participants[0].avatar}
                          alt={selectedConversation.participants[0].name}
                          className="w-10 h-10 rounded-full"
                        />
                        {selectedConversation.participants[0].isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {selectedConversation.participants[0].name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedConversation.participants[0].isOnline ? 'Çevrimiçi' : selectedConversation.participants[0].lastActive}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedConversation(null)}
                      className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Mesaj Listesi */}
                  <div 
                    id="messageContainer"
                    className="p-4 space-y-4 overflow-y-auto h-[400px] scrollbar-hide"
                    style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end'
                    }}
                  >
                    <div className="flex-1">
                      {messages.map(message => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} mb-4`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.isOwn
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className={`text-xs mt-1 ${
                              message.isOwn ? 'text-red-100' : 'text-gray-500 dark:text-gray-400'
                            }`}>
                              {message.timestamp}
                              {message.isOwn && (
                                <span className="ml-1">
                                  {message.isRead ? '✓✓' : '✓'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mesaj Gönderme Formu */}
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
                      {conversations.length === 0 
                        ? 'Henüz hiç mesajınız yok. Kan bağışçıları ile iletişime geçerek sohbet başlatabilirsiniz.'
                        : 'Sohbet başlatmak için bir kişi seçin'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setConversationToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        userName={conversationToDelete?.participants[0].name || ''}
      />
    </div>
  );
} 