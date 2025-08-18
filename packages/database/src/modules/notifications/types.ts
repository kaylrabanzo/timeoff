import { BaseEntity } from '../shared/types';

export interface Notification extends BaseEntity {
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id?: string;
}

export interface CreateNotificationData {
  user_id: string;
  title: string;
  message: string;
  type: string;
  related_id?: string;
}

export interface UpdateNotificationData {
  title?: string;
  message?: string;
  type?: string;
  is_read?: boolean;
  related_id?: string;
}

export interface NotificationFilters {
  user_id?: string;
  type?: string;
  is_read?: boolean;
  related_id?: string;
}

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  notifications_by_type: Record<string, number>;
}
