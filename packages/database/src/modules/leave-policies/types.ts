import { BaseEntity } from '../shared/types';

export interface LeavePolicy extends BaseEntity {
  name: string;
  leave_type: string;
  default_allowance: number;
  max_carry_over: number;
  accrual_rate: number;
  accrual_frequency: string;
  approval_required: boolean;
  requires_documentation: boolean;
  is_active: boolean;
}

export interface CreateLeavePolicyData {
  name: string;
  leave_type: string;
  default_allowance: number;
  max_carry_over: number;
  accrual_rate: number;
  accrual_frequency: string;
  approval_required?: boolean;
  requires_documentation?: boolean;
  is_active?: boolean;
}

export interface UpdateLeavePolicyData {
  name?: string;
  leave_type?: string;
  default_allowance?: number;
  max_carry_over?: number;
  accrual_rate?: number;
  accrual_frequency?: string;
  approval_required?: boolean;
  requires_documentation?: boolean;
  is_active?: boolean;
}

export interface LeavePolicyFilters {
  leave_type?: string;
  is_active?: boolean;
  approval_required?: boolean;
}

export interface LeavePolicyStats {
  total_policies: number;
  active_policies: number;
  policies_by_type: Record<string, number>;
}
