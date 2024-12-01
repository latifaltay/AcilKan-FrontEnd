import React from 'react';
import { ArrowLeft, Send } from 'lucide-react';

interface NewMessageFormProps {
  messageText: string;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageTextChange: (text: string) => void;
  onCancel: () => void;
}

export const NewMessageForm: React.FC<NewMessageFormProps> = ({
  messageText,
  onSendMessage,
  onMessageTextChange,
  onCancel,
}) => {
  return (
    <>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h3 className="font-medium text-gray-900 dark:text-white">
            Yeni Mesaj
          </h3>
        </div>
      </div>

      <div className="flex flex-col h-[500px]">
        <div className="flex-grow p-4">
          <p className="text-gray-600 dark:text-gray-400">
            Kan bağışı talebi için mesajınızı yazın
          </p>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={onSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => onMessageTextChange(e.target.value)}
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
      </div>
    </>
  );
};