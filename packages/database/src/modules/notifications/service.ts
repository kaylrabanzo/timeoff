import { NotificationRepository } from './repository';
import { Notification, CreateNotificationData, UpdateNotificationData, NotificationFilters, NotificationStats } from './types';

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return this.notificationRepository.findByUserId(userId);
  }

  async getAllNotifications(filters?: NotificationFilters): Promise<Notification[]> {
    return this.notificationRepository.findAll(filters);
  }

  async createNotification(notificationData: CreateNotificationData): Promise<Notification> {
    try {
      return await this.notificationRepository.create(notificationData);
    } catch (error) {
      // Log the error but don't throw it to prevent breaking the main operation
      console.error('Failed to create notification:', error);
      console.error('Notification data:', notificationData);
      
      // Return a mock notification to prevent breaking the calling code
      // In production, you might want to queue this for retry or use a different approach
      return {
        id: 'notification-failed',
        user_id: notificationData.user_id,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        is_read: false,
        created_at: new Date(),
        updated_at: new Date()
      };
    }
  }

  async updateNotification(id: string, updates: UpdateNotificationData): Promise<Notification> {
    try {
      return await this.notificationRepository.update(id, updates);
    } catch (error) {
      console.error('Failed to update notification:', error);
      console.error('Notification ID:', id, 'Updates:', updates);
      throw error; // Re-throw for update operations as they're more critical
    }
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    try {
      return await this.notificationRepository.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      console.error('Notification ID:', id);
      throw error; // Re-throw for read operations as they're more critical
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      await this.notificationRepository.markAllAsRead(userId);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      console.error('User ID:', userId);
      throw error; // Re-throw for read operations as they're more critical
    }
  }

  async deleteNotification(id: string): Promise<void> {
    try {
      await this.notificationRepository.delete(id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
      console.error('Notification ID:', id);
      throw error; // Re-throw for delete operations as they're more critical
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getNotificationsByUser(userId);
      return notifications.filter(n => !n.is_read).length;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      console.error('User ID:', userId);
      return 0; // Return 0 as fallback
    }
  }

  async createSystemNotification(userId: string, title: string, message: string, type: string = 'info'): Promise<Notification> {
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type
    });
  }

  async createLeaveRequestNotification(userId: string, leaveRequestId: string, action: string): Promise<Notification> {
    const title = `Leave Request ${action}`;
    const message = `Your leave request has been ${action.toLowerCase()}.`;
    
    return this.createNotification({
      user_id: userId,
      title,
      message,
      type: action === 'approved' ? 'success' : action === 'rejected' ? 'error' : 'info'
    });
  }

  async createApprovalNotification(approverId: string, requesterName: string, leaveRequestId: string): Promise<Notification> {
    const title = 'Leave Request Pending Approval';
    const message = `${requesterName} has submitted a leave request that requires your approval.`;
    
    return this.createNotification({
      user_id: approverId,
      title,
      message,
      type: 'warning'
    });
  }
}
