import React from 'react';
import { Thread } from '../../types/chat';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ThreadListProps {
  threads: Thread[];
  activeThread: Thread | null;
  onThreadSelect: (thread: Thread) => void;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  activeThread,
  onThreadSelect,
}) => {
  return (
    <div className="w-80 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">Mesajlar</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {threads.map((thread) => (
          <button
            key={thread.id}
            onClick={() => onThreadSelect(thread)}
            className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
              activeThread?.id === thread.id ? 'bg-blue-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {thread.participants.join(', ')}
                </p>
                {thread.lastMessage && (
                  <p className="text-sm text-gray-500 truncate">
                    {thread.lastMessage.content}
                  </p>
                )}
              </div>
              <div className="ml-4 flex-shrink-0">
                {thread.lastMessage && (
                  <p className="text-xs text-gray-500">
                    {format(new Date(thread.lastMessage.sentAt), 'HH:mm', {
                      locale: tr,
                    })}
                  </p>
                )}
                {thread.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-500 rounded-full">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 