import type { NotificationType } from "./enums";

export interface NotificationDto {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  data: string | null;
  isRead: boolean;
  createdAt: string;
}
