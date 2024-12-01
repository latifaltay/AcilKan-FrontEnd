import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  messageText: string;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageTextChange: (text: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  messageText,
  onSendMessage,
  onMessageTextChange,
}) => {
  return (
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
  );
};