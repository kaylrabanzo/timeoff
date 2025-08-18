import { DatabaseClient } from '../shared/types';
import { DatabaseUtils } from '../shared/utils';
import { CalendarEvent, CreateCalendarEventData, UpdateCalendarEventData, CalendarEventFilters } from './types';

export class CalendarEventRepository {
  constructor(private db: DatabaseClient) {}

  async findAll(filters?: CalendarEventFilters): Promise<CalendarEvent[]> {
    try {
      let query = this.db.from('calendar_events').select('*');

      if (filters) {
        query = this.applyCalendarEventFilters(query, filters);
      }

      const { data, error } = await query.order('start_date');
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAllCalendarEvents');
    }
  }

  async findById(id: string): Promise<CalendarEvent> {
    try {
      const { data, error } = await this.db
        .from('calendar_events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findCalendarEventById');
    }
  }

  async findByDateRange(startDate: Date, endDate: Date, userId?: string, departmentId?: string): Promise<CalendarEvent[]> {
    try {
      let query = this.db
        .from('calendar_events')
        .select('*')
        .gte('start_date', startDate.toISOString())
        .lte('end_date', endDate.toISOString());

      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (departmentId) {
        query = query.eq('department_id', departmentId);
      }

      const { data, error } = await query.order('start_date');
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findCalendarEventsByDateRange');
    }
  }

  async create(eventData: CreateCalendarEventData): Promise<CalendarEvent> {
    try {
      DatabaseUtils.validateRequiredFields(eventData, [
        'title', 'start_date', 'end_date', 'type'
      ]);

      const sanitizedData = DatabaseUtils.sanitizeData(eventData);
      
      const { data, error } = await this.db
        .from('calendar_events')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'createCalendarEvent');
    }
  }

  async update(id: string, updates: UpdateCalendarEventData): Promise<CalendarEvent> {
    try {
      const sanitizedUpdates = DatabaseUtils.sanitizeData(updates);
      
      const { data, error } = await this.db
        .from('calendar_events')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'updateCalendarEvent');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('calendar_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'deleteCalendarEvent');
    }
  }

  private applyCalendarEventFilters(query: any, filters: CalendarEventFilters): any {
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.department_id) {
      query = query.eq('department_id', filters.department_id);
    }
    
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    
    if (filters.date_range) {
      query = query
        .gte('start_date', filters.date_range.start.toISOString())
        .lte('end_date', filters.date_range.end.toISOString());
    }
    
    return query;
  }
}
