import React from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import type { ConversationSummaryDto, MessageDto } from "../../../shared/types";
import { MessageCircle } from "lucide-react";

interface ChatAreaProps {
  selectedConversation: ConversationSummaryDto | null;
  messages: MessageDto[];
  currentUserId: string;
  messageText: string;
  isLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onSendMessage: (e: React.FormEvent) => void;
  onMessageTextChange: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  selectedConversation,
  messages,
  currentUserId,
  messageText,
  isLoading,
  containerRef,
  onSendMessage,
  onMessageTextChange,
}) => {
  if (!selectedConversation) {
    return (
      <div className="col-span-8 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4 mx-auto mb-4 w-16">
            <MessageCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Sohbet başlatmak için bir kişi seçin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-8">
      <ChatHeader conversation={selectedConversation} />
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        isLoading={isLoading}
        containerRef={containerRef}
      />
      <MessageInput
        messageText={messageText}
        onSendMessage={onSendMessage}
        onMessageTextChange={onMessageTextChange}
        disabled={!selectedConversation.canSendMessage}
        disabledReason="Sohbet salt okunur"
      />
    </div>
  );
};
