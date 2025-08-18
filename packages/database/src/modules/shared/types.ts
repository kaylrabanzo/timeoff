// Shared types used across all modules
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
  deleted_at?: Date;
}

export interface DatabaseClient {
  from: (table: string) => any;
  channel: (name: string) => any;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  orderBy?: {
    column: string;
    direction: 'asc' | 'desc';
  };
}

export interface FilterOptions {
  [key: string]: any;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ServiceError extends Error {
  code: string;
  details?: Record<string, any>;
}

export interface AuditLogData {
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}
