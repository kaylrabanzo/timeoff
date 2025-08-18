import { BaseEntity } from '../shared/types';

export interface LeaveBalance extends BaseEntity {
  user_id: string;
  leave_type: string;
  total_allowance: number;
  used_days: number;
  remaining_days: number;
  carried_over: number;
  year: number;
}

export interface CreateLeaveBalanceData {
  user_id: string;
  leave_type: string;
  total_allowance: number;
  used_days?: number;
  remaining_days?: number;
  carried_over?: number;
  year: number;
}

export interface UpdateLeaveBalanceData {
  total_allowance?: number;
  used_days?: number;
  remaining_days?: number;
  carried_over?: number;
}

export interface LeaveBalanceFilters {
  user_id?: string;
  leave_type?: string;
  year?: number;
}

export interface LeaveBalanceSummary {
  user_id: string;
  balances: LeaveBalance[];
  total_remaining: number;
  total_used: number;
}
