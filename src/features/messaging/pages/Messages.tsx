import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { conversationService } from "../conversationService";
import { signalrService } from "../signalrService";
import { useAuth } from "../../auth/AuthContext";
import { ContactList } from "../components/ContactList";
import { ChatArea } from "../components/ChatArea";
import { getApiErrorMessage } from "../../../shared/api/apiError";
import type { ConversationSummaryDto, MessageDto } from "../../../shared/types";

export default function Messages() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState<ConversationSummaryDto[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationSummaryDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // SignalR dinleyicisi mount'ta bir kez kurulur; seçili sohbeti ref ile tutarız.
  const selectedConversationRef = useRef<ConversationSummaryDto | null>(null);
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoadingConversations(true);
      const data = await conversationService.getConversations();
      setConversations(data);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Sohbetler yüklenemedi."));
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoadingMessages(true);
      const data = await conversationService.getMessages(conversationId);
      setMessages(data.items.slice().reverse());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Mesajlar yüklenemedi."));
      setMessages([]);
      return;
    } finally {
      setIsLoadingMessages(false);
    }

    try {
      if (signalrService.isConnected()) {
        await signalrService.markMessagesRead(conversationId);
      } else {
        await conversationService.markRead(conversationId);
      }
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
      );
    } catch (error) {
      console.error("Mesajlar okundu olarak işaretlenemedi:", error);
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    let cleanupMessage: (() => void) | undefined;
    let cancelled = false;

    const initialize = async () => {
      try {
        await signalrService.start();
        if (cancelled) return;
        cleanupMessage = signalrService.onReceiveMessage((message) => {
          const current = selectedConversationRef.current;
          if (current && message.conversationId === current.id) {
            setMessages((prev) => {
              // Gönderene de yayınlandığı için id ile tekilleştir.
              if (prev.some((m) => m.id === message.id)) return prev;
              return [...prev, message];
            });
          }
          loadConversations();
        });
      } catch (error) {
        console.error("SignalR bağlantısı kurulamadı:", error);
      }
    };

    initialize();

    return () => {
      cancelled = true;
      cleanupMessage?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  }, [messages]);

  const handleSelectConversation = (conversation: ConversationSummaryDto) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  useEffect(() => {
    const conversationId = searchParams.get("conversationId");
    if (!conversationId || conversations.length === 0) return;
    if (selectedConversation?.id === conversationId) return;

    const match = conversations.find((c) => c.id === conversationId);
    if (match) {
      setSelectedConversation(match);
      loadMessages(match.id);
    }
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, searchParams]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = messageText.trim();
    if (!content || !selectedConversation) return;
    if (!selectedConversation.canSendMessage) {
      toast.error("Sohbet salt okunur; mesaj gönderilemez.");
      return;
    }

    setMessageText("");
    try {
      let sent: MessageDto;
      if (signalrService.isConnected()) {
        try {
          sent = await signalrService.sendMessage(
            selectedConversation.id,
            content
          );
        } catch (hubError) {
          // Hub düşmüş / invoke hata vermişse REST fallback.
          console.warn("SignalR mesaj gönderimi başarısız, REST deneniyor:", hubError);
          sent = await conversationService.sendMessage(
            selectedConversation.id,
            content
          );
        }
      } else {
        sent = await conversationService.sendMessage(
          selectedConversation.id,
          content
        );
      }

      setMessages((prev) => {
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent];
      });
      loadConversations();
    } catch (error) {
      setMessageText(content);
      toast.error(getApiErrorMessage(error, "Mesaj gönderilemedi."));
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    `${conversation.otherPartyName} ${conversation.otherPartySurname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-12 min-h-[600px]">
            <ContactList
              conversations={filteredConversations}
              selectedConversation={selectedConversation}
              searchQuery={searchQuery}
              isLoading={isLoadingConversations}
              onSearchChange={setSearchQuery}
              onSelectConversation={handleSelectConversation}
            />
            <ChatArea
              selectedConversation={selectedConversation}
              messages={messages}
              currentUserId={user?.id ?? ""}
              messageText={messageText}
              isLoading={isLoadingMessages}
              containerRef={messagesContainerRef}
              onSendMessage={handleSendMessage}
              onMessageTextChange={setMessageText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
