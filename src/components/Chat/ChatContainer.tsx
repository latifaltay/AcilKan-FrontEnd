import React, { useEffect } from 'react';
import { ThreadList } from './ThreadList';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { useChat } from '../../context/ChatContext';
import { ConnectionStatus, Thread } from '../../types/chat';

export const ChatContainer: React.FC = () => {
  const {
    threads,
    activeThread,
    messages,
    connectionStatus,
    setActiveThread,
    loadUserThreads,
    loadThreadMessages,
  } = useChat();

  useEffect(() => {
    loadUserThreads();
  }, [loadUserThreads]);

  useEffect(() => {
    if (activeThread) {
      loadThreadMessages(activeThread.id);
    }
  }, [activeThread, loadThreadMessages]);

  const handleThreadSelect = (thread: Thread) => {
    setActiveThread(thread);
  };

  if (connectionStatus === ConnectionStatus.DISCONNECTED) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Bağlantı kesildi</h3>
          <p className="mt-1 text-sm text-gray-500">
            Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ThreadList
        threads={threads}
        activeThread={activeThread}
        onThreadSelect={handleThreadSelect}
      />
      <div className="flex-1 flex flex-col">
        {activeThread ? (
          <>
            <div className="border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900">
                {activeThread.participants.join(', ')}
              </h3>
            </div>
            <MessageList
              messages={messages[activeThread.id] || []}
              threadId={activeThread.id}
            />
            <MessageInput
              receiverId={activeThread.participants[0]}
              threadId={activeThread.id}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">
                Mesaj seçilmedi
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Sohbet etmek için bir mesaj seçin veya yeni bir mesaj başlatın.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 