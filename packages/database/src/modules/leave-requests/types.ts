import { BaseEntity, SoftDeleteEntity } from '../shared/types';

export interface LeaveRequest extends SoftDeleteEntity {
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: string;
  attachments?: string[];
  approver_id?: string;
  approved_at?: Date;
  rejected_at?: Date;
  rejection_reason?: string;
  approval_comments?: string;
  is_half_day?: boolean;
  half_day_type?: 'morning' | 'afternoon';
}

export interface CreateLeaveRequestData {
  user_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status?: string;
  attachments?: string[];
  is_half_day?: boolean;
  half_day_type?: 'morning' | 'afternoon';
}

export interface UpdateLeaveRequestData {
  leave_type?: string;
  start_date?: string;
  end_date?: string;
  total_days?: number;
  reason?: string;
  status?: string;
  attachments?: string[];
  is_half_day?: boolean;
  half_day_type?: 'morning' | 'afternoon';
}

export interface LeaveRequestFilters {
  user_id?: string;
  leave_type?: string;
  status?: string;
  approver_id?: string;
  date_range?: {
    start: Date;
    end: Date;
  };
  is_half_day?: boolean;
}

export interface LeaveRequestWithUser extends LeaveRequest {
  users: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    department: string;
    team: string;
    role: string;
    manager_id?: string;
  };
}

export interface LeaveRequestStats {
  total_requests: number;
  pending_requests: number;
  approved_requests: number;
  rejected_requests: number;
  cancelled_requests: number;
  requests_by_type: Record<string, number>;
  requests_by_status: Record<string, number>;
}

export interface ApprovalData {
  approver_id: string;
  comments?: string;
  rejection_reason?: string;
}
