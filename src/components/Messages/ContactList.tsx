import React from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { Contact } from '../../types';

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  searchQuery: string;
  isLoading: boolean;
  onSearchChange: (query: string) => void;
  onSelectContact: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  selectedContact,
  searchQuery,
  isLoading,
  onSearchChange,
  onSelectContact,
}) => {
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

  const handleContactClick = (contact: Contact) => {
    console.log('Contact clicked:', contact); // Debug log
    onSelectContact(contact);
  };

  return (
    <div className="col-span-4 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Kişi ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
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
        ) : contacts.length === 0 ? (
          <EmptyContacts />
        ) : (
          contacts.map(contact => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedContact?.id === contact.id ? 'bg-gray-100 dark:bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-medium">
                      {contact.userFullName
                        .split(' ')
                        .map(n => n[0].toUpperCase())
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">{contact.userFullName.toUpperCase()}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{contact.lastMessageInfo}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};