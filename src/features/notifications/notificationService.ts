import { donationApi } from "../../shared/api/httpClient";
import { unwrap, unwrapMessage, type ApiSuccess, type PaginatedList } from "../../shared/api/envelope";
import type { NotificationDto } from "../../shared/types";

export const notificationService = {
  async getNotifications(
    pageNumber = 1,
    pageSize = 20
  ): Promise<PaginatedList<NotificationDto>> {
    return unwrap(
      donationApi.get<ApiSuccess<PaginatedList<NotificationDto>>>(
        "/Notifications",
        { params: { pageNumber, pageSize } }
      )
    );
  },

  async getUnreadCount(): Promise<number> {
    return unwrap(
      donationApi.get<ApiSuccess<number>>("/Notifications/unread-count")
    );
  },

  async markRead(id: string): Promise<string> {
    return unwrapMessage(donationApi.post(`/Notifications/${id}/read`));
  },

  async markAllRead(): Promise<string> {
    return unwrapMessage(donationApi.post("/Notifications/read-all"));
  },
};
