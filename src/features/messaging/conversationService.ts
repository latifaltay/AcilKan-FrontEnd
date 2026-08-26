import { donationApi } from "../../shared/api/httpClient";
import { unwrap, unwrapMessage, type ApiSuccess, type PaginatedList } from "../../shared/api/envelope";
import type { ConversationSummaryDto, MessageDto } from "../../shared/types";

export const conversationService = {
  async getConversations(): Promise<ConversationSummaryDto[]> {
    return unwrap(
      donationApi.get<ApiSuccess<ConversationSummaryDto[]>>("/Conversations")
    );
  },

  async getMessages(
    conversationId: string,
    pageNumber = 1,
    pageSize = 30
  ): Promise<PaginatedList<MessageDto>> {
    return unwrap(
      donationApi.get<ApiSuccess<PaginatedList<MessageDto>>>(
        `/Conversations/${conversationId}/messages`,
        { params: { pageNumber, pageSize } }
      )
    );
  },

  async sendMessage(conversationId: string, content: string): Promise<MessageDto> {
    return unwrap(
      donationApi.post<ApiSuccess<MessageDto>>(
        `/Conversations/${conversationId}/messages`,
        { content }
      )
    );
  },

  async markRead(conversationId: string): Promise<string> {
    return unwrapMessage(
      donationApi.post(`/Conversations/${conversationId}/read`)
    );
  },
};
