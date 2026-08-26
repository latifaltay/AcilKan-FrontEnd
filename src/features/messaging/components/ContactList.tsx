import React from "react";
import { Search, MessageCircle } from "lucide-react";
import type { ConversationSummaryDto } from "../../../shared/types";
import { getInitials } from "../../../shared/lib/user";

interface ContactListProps {
  conversations: ConversationSummaryDto[];
  selectedConversation: ConversationSummaryDto | null;
  searchQuery: string;
  isLoading: boolean;
  onSearchChange: (query: string) => void;
  onSelectConversation: (conversation: ConversationSummaryDto) => void;
}

const EmptyContacts = () => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-4">
      <MessageCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
      Henüz hiç sohbetiniz yok
    </h3>
    <p className="text-gray-500 dark:text-gray-400 mb-4">
      Bir bağış teklifi verdiğinizde veya kabul ettiğinizde, karşı taraf ile
      sohbet burada otomatik olarak açılır.
    </p>
  </div>
);

export const ContactList: React.FC<ContactListProps> = ({
  conversations,
  selectedConversation,
  searchQuery,
  isLoading,
  onSearchChange,
  onSelectConversation,
}) => {
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
        ) : conversations.length === 0 ? (
          <EmptyContacts />
        ) : (
          conversations.map((conversation) => {
            const fullName = `${conversation.otherPartyName} ${conversation.otherPartySurname}`;
            return (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  selectedConversation?.id === conversation.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-12 h-12 shrink-0 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <span className="text-red-600 dark:text-red-400 font-medium">
                        {getInitials(fullName)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {fullName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {conversation.lastMessageContent ?? "Henüz mesaj yok"}
                      </p>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="shrink-0 ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-red-600 text-white text-xs font-medium">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
