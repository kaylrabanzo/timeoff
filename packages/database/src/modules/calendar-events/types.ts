import { BaseEntity } from '../shared/types';

export interface CalendarEvent extends BaseEntity {
  title: string;
  start_date: Date;
  end_date: Date;
  type: string;
  user_id?: string;
  department_id?: string;
  is_all_day: boolean;
  description?: string;
  color?: string;
}

export interface CreateCalendarEventData {
  title: string;
  start_date: Date;
  end_date: Date;
  type: string;
  user_id?: string;
  department_id?: string;
  is_all_day?: boolean;
  description?: string;
  color?: string;
}

export interface UpdateCalendarEventData {
  title?: string;
  start_date?: Date;
  end_date?: Date;
  type?: string;
  user_id?: string;
  department_id?: string;
  is_all_day?: boolean;
  description?: string;
  color?: string;
}

export interface CalendarEventFilters {
  user_id?: string;
  department_id?: string;
  type?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
}

export interface CalendarEventStats {
  total_events: number;
  events_by_type: Record<string, number>;
  events_by_user: Record<string, number>;
}
