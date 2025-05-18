import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { signalRService } from '../services/signalRService';
import { ChatState, ConnectionStatus, Message, MessageStatus, ReceiveMessagePayload, SendMessagePayload, Thread } from '../types/chat';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface ChatContextType extends ChatState {
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  setActiveThread: (thread: Thread | null) => void;
  markThreadAsRead: (threadId: string) => Promise<void>;
  loadThreadMessages: (threadId: string) => Promise<void>;
  loadUserThreads: () => Promise<void>;
}

const initialState: ChatState = {
  activeThread: null,
  threads: [],
  messages: {},
  onlineUsers: [],
  connectionStatus: ConnectionStatus.DISCONNECTED,
};

type ChatAction =
  | { type: 'SET_ACTIVE_THREAD'; payload: Thread | null }
  | { type: 'SET_THREADS'; payload: Thread[] }
  | { type: 'ADD_MESSAGE'; payload: { threadId: string; message: Message } }
  | { type: 'SET_MESSAGES'; payload: { threadId: string; messages: Message[] } }
  | { type: 'SET_ONLINE_USERS'; payload: string[] }
  | { type: 'SET_CONNECTION_STATUS'; payload: ConnectionStatus }
  | { type: 'MARK_THREAD_AS_READ'; payload: string }
  | { type: 'UPDATE_MESSAGE_STATUS'; payload: { messageId: string; status: MessageStatus } };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThread: action.payload };
    case 'SET_THREADS':
      return { ...state, threads: action.payload };
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.threadId]: [
            ...(state.messages[action.payload.threadId] || []),
            action.payload.message,
          ],
        },
      };
    case 'SET_MESSAGES':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.threadId]: action.payload.messages,
        },
      };
    case 'SET_ONLINE_USERS':
      return { ...state, onlineUsers: action.payload };
    case 'SET_CONNECTION_STATUS':
      return { ...state, connectionStatus: action.payload };
    case 'MARK_THREAD_AS_READ':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload]: (state.messages[action.payload] || []).map(msg => ({
            ...msg,
            isRead: true,
          })),
        },
      };
    case 'UPDATE_MESSAGE_STATUS':
      return {
        ...state,
        messages: Object.entries(state.messages).reduce((acc, [threadId, messages]) => ({
          ...acc,
          [threadId]: messages.map(msg =>
            msg.id === action.payload.messageId
              ? { ...msg, status: action.payload.status }
              : msg
          ),
        }), {}),
      };
    default:
      return state;
  }
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    const setupSignalR = async () => {
      if (!user?.id) return;

      signalRService.onConnectionStatus(status => {
        dispatch({ type: 'SET_CONNECTION_STATUS', payload: status });
      });

      signalRService.onMessage(message => {
        const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: message.senderId,
          receiverId: message.receiverId,
          content: message.content,
          threadId: message.threadId,
          sentAt: new Date(message.sentAt),
          status: MessageStatus.DELIVERED,
          isRead: false,
        };

        dispatch({ type: 'ADD_MESSAGE', payload: { threadId: message.threadId, message: newMessage } });
      });

      signalRService.onUserConnected(userId => {
        dispatch({ type: 'SET_ONLINE_USERS', payload: [...state.onlineUsers, userId] });
      });

      signalRService.onUserDisconnected(userId => {
        dispatch({
          type: 'SET_ONLINE_USERS',
          payload: state.onlineUsers.filter(id => id !== userId),
        });
      });

      signalRService.onMessagesRead((userId, threadId) => {
        dispatch({ type: 'MARK_THREAD_AS_READ', payload: threadId });
      });

      await signalRService.startConnection();
    };

    setupSignalR();

    return () => {
      signalRService.stopConnection();
    };
  }, [user?.id]);

  const sendMessage = useCallback(async (payload: SendMessagePayload) => {
    if (!user?.id) throw new Error('User not authenticated');

    const tempMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      senderId: user.id.toString(),
      receiverId: payload.receiverId,
      content: payload.content,
      threadId: payload.threadId || Math.random().toString(36).substr(2, 9),
      sentAt: new Date(),
      status: MessageStatus.SENDING,
      isRead: false,
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { threadId: tempMessage.threadId, message: tempMessage },
    });

    try {
      await signalRService.sendMessage(payload);
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { messageId: tempMessage.id, status: MessageStatus.SENT },
      });
    } catch (error) {
      dispatch({
        type: 'UPDATE_MESSAGE_STATUS',
        payload: { messageId: tempMessage.id, status: MessageStatus.ERROR },
      });
      throw error;
    }
  }, [user?.id]);

  const setActiveThread = useCallback((thread: Thread | null) => {
    dispatch({ type: 'SET_ACTIVE_THREAD', payload: thread });
  }, []);

  const markThreadAsRead = useCallback(async (threadId: string) => {
    try {
      await api.post('/api/ChatMessages/MarkThreadAsRead', { threadId });
      dispatch({ type: 'MARK_THREAD_AS_READ', payload: threadId });
    } catch (error) {
      console.error('Error marking thread as read:', error);
    }
  }, []);

  const loadThreadMessages = useCallback(async (threadId: string) => {
    try {
      const response = await api.get(`/api/ChatMessages/GetThreadMessages?threadId=${threadId}`);
      dispatch({
        type: 'SET_MESSAGES',
        payload: { threadId, messages: response.data },
      });
    } catch (error) {
      console.error('Error loading thread messages:', error);
    }
  }, []);

  const loadUserThreads = useCallback(async () => {
    try {
      const response = await api.get('/api/ChatMessages/GetUserMessages');
      dispatch({ type: 'SET_THREADS', payload: response.data });
    } catch (error) {
      console.error('Error loading user threads:', error);
    }
  }, []);

  const value = {
    ...state,
    sendMessage,
    setActiveThread,
    markThreadAsRead,
    loadThreadMessages,
    loadUserThreads,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 