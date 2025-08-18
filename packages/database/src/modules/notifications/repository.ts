import { DatabaseClient } from '../shared/types';
import { DatabaseUtils } from '../shared/utils';
import { Notification, CreateNotificationData, UpdateNotificationData, NotificationFilters } from './types';

export class NotificationRepository {
  constructor(private db: DatabaseClient) {}

  async findByUserId(userId: string, limit = 50): Promise<Notification[]> {
    try {
      const { data, error } = await this.db
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findNotificationsByUserId');
    }
  }

  async findAll(filters?: NotificationFilters): Promise<Notification[]> {
    try {
      let query = this.db.from('notifications').select('*');

      if (filters) {
        query = DatabaseUtils.applyFilters(query, filters);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAllNotifications');
    }
  }

  async create(notificationData: CreateNotificationData): Promise<Notification> {
    try {
      DatabaseUtils.validateRequiredFields(notificationData, [
        'user_id', 'title', 'message', 'type'
      ]);

      const sanitizedData = DatabaseUtils.sanitizeData(notificationData);
      
      const { data, error } = await this.db
        .from('notifications')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'createNotification');
    }
  }

  async update(id: string, updates: UpdateNotificationData): Promise<Notification> {
    try {
      const sanitizedUpdates = DatabaseUtils.sanitizeData(updates);
      
      const { data, error } = await this.db
        .from('notifications')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'updateNotification');
    }
  }

  async markAsRead(id: string): Promise<Notification> {
    try {
      const { data, error } = await this.db
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'markNotificationAsRead');
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'markAllNotificationsAsRead');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'deleteNotification');
    }
  }
}
