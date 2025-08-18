import { BaseEntity } from '../shared/types';

export interface AuditLog extends BaseEntity {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface CreateAuditLogData {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface AuditLogFilters {
  user_id?: string;
  action?: string;
  resource_type?: string;
  resource_id?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
}

export interface AuditLogStats {
  total_logs: number;
  logs_by_action: Record<string, number>;
  logs_by_resource_type: Record<string, number>;
  logs_by_user: Record<string, number>;
}
