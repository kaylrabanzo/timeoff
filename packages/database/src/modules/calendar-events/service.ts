import { CalendarEventRepository } from './repository';
import { CalendarEvent, CreateCalendarEventData, UpdateCalendarEventData, CalendarEventFilters } from './types';
import { AuditLogService } from '../audit-logs/service';

export class CalendarEventService {
  constructor(
    private calendarEventRepository: CalendarEventRepository,
    private auditLogService: AuditLogService
  ) {}

  async getAllCalendarEvents(filters?: CalendarEventFilters): Promise<CalendarEvent[]> {
    return this.calendarEventRepository.findAll(filters);
  }

  async getCalendarEventById(id: string): Promise<CalendarEvent> {
    return this.calendarEventRepository.findById(id);
  }

  async getCalendarEventsByDateRange(startDate: Date, endDate: Date, userId?: string, departmentId?: string): Promise<CalendarEvent[]> {
    return this.calendarEventRepository.findByDateRange(startDate, endDate, userId, departmentId);
  }

  async createCalendarEvent(eventData: CreateCalendarEventData, createdBy?: string): Promise<CalendarEvent> {
    const event = await this.calendarEventRepository.create(eventData);
    
    // Create audit log
    if (createdBy) {
      await this.auditLogService.createAuditLog({
        user_id: createdBy,
        action: 'CREATE_CALENDAR_EVENT',
        resource_type: 'calendar_event',
        resource_id: event.id,
        details: {
          event_title: event.title,
          event_type: event.type,
          start_date: event.start_date,
          end_date: event.end_date
        }
      });
    }
    
    return event;
  }

  async updateCalendarEvent(id: string, updates: UpdateCalendarEventData, updatedBy?: string): Promise<CalendarEvent> {
    const event = await this.calendarEventRepository.update(id, updates);
    
    // Create audit log
    if (updatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: updatedBy,
        action: 'UPDATE_CALENDAR_EVENT',
        resource_type: 'calendar_event',
        resource_id: id,
        details: {
          updated_fields: Object.keys(updates),
          event_title: event.title
        }
      });
    }
    
    return event;
  }

  async deleteCalendarEvent(id: string, deletedBy?: string): Promise<void> {
    const event = await this.calendarEventRepository.findById(id);
    
    await this.calendarEventRepository.delete(id);
    
    // Create audit log
    if (deletedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deletedBy,
        action: 'DELETE_CALENDAR_EVENT',
        resource_type: 'calendar_event',
        resource_id: id,
        details: {
          deleted_event_title: event.title,
          event_type: event.type
        }
      });
    }
  }

  async createLeaveEvent(userId: string, startDate: Date, endDate: Date, leaveType: string, createdBy?: string): Promise<CalendarEvent> {
    const eventData: CreateCalendarEventData = {
      title: `${leaveType} Leave`,
      start_date: startDate,
      end_date: endDate,
      type: 'leave',
      user_id: userId,
      is_all_day: true,
      color: '#ff6b6b'
    };

    return this.createCalendarEvent(eventData, createdBy);
  }

  async createHolidayEvent(title: string, startDate: Date, endDate: Date, createdBy?: string): Promise<CalendarEvent> {
    const eventData: CreateCalendarEventData = {
      title,
      start_date: startDate,
      end_date: endDate,
      type: 'holiday',
      is_all_day: true,
      color: '#4ecdc4'
    };

    return this.createCalendarEvent(eventData, createdBy);
  }

  async createCompanyEvent(title: string, startDate: Date, endDate: Date, description?: string, createdBy?: string): Promise<CalendarEvent> {
    const eventData: CreateCalendarEventData = {
      title,
      start_date: startDate,
      end_date: endDate,
      type: 'company_event',
      description,
      is_all_day: false,
      color: '#45b7d1'
    };

    return this.createCalendarEvent(eventData, createdBy);
  }
}
