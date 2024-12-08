import React from 'react';
import { Trash2 } from 'lucide-react';
import { Contact } from '../../types';

interface ChatHeaderProps {
  contact: Contact;
  onDeleteChat: (contactId: number) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ contact, onDeleteChat }) => {
  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">

          <span className="text-red-600 font-medium">
            {contact.userFullName
              .split(' ')
              .map(n => n[0].toUpperCase())
              .join('')}
          </span>

        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {contact.userFullName.toUpperCase()}
          </h3>
        </div>
      </div>
      {/* Açılacak kontrol edilecek */}
      <button
        onClick={() => onDeleteChat(contact.id)}
        className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
};
