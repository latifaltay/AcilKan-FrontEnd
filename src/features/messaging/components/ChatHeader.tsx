import React from "react";
import type { ConversationSummaryDto } from "../../../shared/types";
import { getInitials } from "../../../shared/lib/user";

interface ChatHeaderProps {
  conversation: ConversationSummaryDto;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation }) => {
  const fullName = `${conversation.otherPartyName} ${conversation.otherPartySurname}`;

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <span className="text-red-600 dark:text-red-400 font-medium">
            {getInitials(fullName)}
          </span>
        </div>
        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            {fullName}
          </h3>
        </div>
      </div>
    </div>
  );
};
