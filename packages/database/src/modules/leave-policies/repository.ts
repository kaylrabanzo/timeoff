import { DatabaseClient } from '../shared/types';
import { DatabaseUtils } from '../shared/utils';
import { LeavePolicy, CreateLeavePolicyData, UpdateLeavePolicyData, LeavePolicyFilters } from './types';

export class LeavePolicyRepository {
  constructor(private db: DatabaseClient) {}

  async findAll(filters?: LeavePolicyFilters): Promise<LeavePolicy[]> {
    try {
      let query = this.db.from('leave_policies').select('*');

      if (filters) {
        query = DatabaseUtils.applyFilters(query, filters);
      }

      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAllLeavePolicies');
    }
  }

  async findById(id: string): Promise<LeavePolicy> {
    try {
      const { data, error } = await this.db
        .from('leave_policies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findLeavePolicyById');
    }
  }

  async findByLeaveType(leaveType: string): Promise<LeavePolicy[]> {
    try {
      const { data, error } = await this.db
        .from('leave_policies')
        .select('*')
        .eq('leave_type', leaveType)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findLeavePoliciesByType');
    }
  }

  async create(policyData: CreateLeavePolicyData): Promise<LeavePolicy> {
    try {
      DatabaseUtils.validateRequiredFields(policyData, [
        'name', 'leave_type', 'default_allowance', 'max_carry_over', 'accrual_rate', 'accrual_frequency'
      ]);

      const sanitizedData = DatabaseUtils.sanitizeData(policyData);
      
      const { data, error } = await this.db
        .from('leave_policies')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'createLeavePolicy');
    }
  }

  async update(id: string, updates: UpdateLeavePolicyData): Promise<LeavePolicy> {
    try {
      const sanitizedUpdates = DatabaseUtils.sanitizeData(updates);
      
      const { data, error } = await this.db
        .from('leave_policies')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'updateLeavePolicy');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('leave_policies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'deleteLeavePolicy');
    }
  }
}
