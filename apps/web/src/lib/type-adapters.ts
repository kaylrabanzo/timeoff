import { LeaveBalance, LeaveRequest, LeaveType, RequestStatus, Notification as TypesNotification } from '@timeoff/types'

// Database types (what the service returns)
export interface DatabaseLeaveRequest {
  id: string;
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
  created_at: Date;
  updated_at: Date;
}

export interface DatabaseLeaveBalance {
  id: string;
  user_id: string;
  leave_type: string;
  total_allowance: number;
  used_days: number;
  remaining_days: number;
  carried_over: number;
  year: number;
  updated_at: Date;
}

export interface DatabaseNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id?: string;
  created_at: Date;
}

// Type adapter functions
export function adaptLeaveRequest(dbRequest: DatabaseLeaveRequest): LeaveRequest {
  return {
    ...dbRequest,
    leave_type: dbRequest.leave_type as LeaveType,
    status: dbRequest.status as RequestStatus,
  }
}

export function adaptLeaveBalance(dbBalance: DatabaseLeaveBalance): LeaveBalance {
  return {
    ...dbBalance,
    leave_type: dbBalance.leave_type as LeaveType,
  }
}

export function adaptNotification(dbNotification: DatabaseNotification): TypesNotification {
  return {
    ...dbNotification,
    type: dbNotification.type as any, // Assuming the notification types match
  }
}

export function adaptLeaveRequests(dbRequests: DatabaseLeaveRequest[]): LeaveRequest[] {
  return dbRequests.map(adaptLeaveRequest)
}

export function adaptLeaveBalances(dbBalances: DatabaseLeaveBalance[]): LeaveBalance[] {
  return dbBalances.map(adaptLeaveBalance)
}

export function adaptNotifications(dbNotifications: DatabaseNotification[]): TypesNotification[] {
  return dbNotifications.map(adaptNotification)
}
