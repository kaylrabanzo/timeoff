import { LeavePolicyRepository } from './repository';
import { LeavePolicy, CreateLeavePolicyData, UpdateLeavePolicyData, LeavePolicyFilters } from './types';
import { AuditLogService } from '../audit-logs/service';

export class LeavePolicyService {
  constructor(
    private leavePolicyRepository: LeavePolicyRepository,
    private auditLogService: AuditLogService
  ) {}

  async getAllLeavePolicies(filters?: LeavePolicyFilters): Promise<LeavePolicy[]> {
    return this.leavePolicyRepository.findAll(filters);
  }

  async getLeavePolicyById(id: string): Promise<LeavePolicy> {
    return this.leavePolicyRepository.findById(id);
  }

  async getLeavePoliciesByType(leaveType: string): Promise<LeavePolicy[]> {
    return this.leavePolicyRepository.findByLeaveType(leaveType);
  }

  async createLeavePolicy(policyData: CreateLeavePolicyData, createdBy?: string): Promise<LeavePolicy> {
    const policy = await this.leavePolicyRepository.create(policyData);
    
    // Create audit log
    if (createdBy) {
      await this.auditLogService.createAuditLog({
        user_id: createdBy,
        action: 'CREATE_LEAVE_POLICY',
        resource_type: 'leave_policy',
        resource_id: policy.id,
        details: {
          policy_name: policy.name,
          leave_type: policy.leave_type,
          default_allowance: policy.default_allowance
        }
      });
    }
    
    return policy;
  }

  async updateLeavePolicy(id: string, updates: UpdateLeavePolicyData, updatedBy?: string): Promise<LeavePolicy> {
    const policy = await this.leavePolicyRepository.update(id, updates);
    
    // Create audit log
    if (updatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: updatedBy,
        action: 'UPDATE_LEAVE_POLICY',
        resource_type: 'leave_policy',
        resource_id: id,
        details: {
          updated_fields: Object.keys(updates),
          policy_name: policy.name
        }
      });
    }
    
    return policy;
  }

  async deleteLeavePolicy(id: string, deletedBy?: string): Promise<void> {
    const policy = await this.leavePolicyRepository.findById(id);
    
    await this.leavePolicyRepository.delete(id);
    
    // Create audit log
    if (deletedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deletedBy,
        action: 'DELETE_LEAVE_POLICY',
        resource_type: 'leave_policy',
        resource_id: id,
        details: {
          deleted_policy_name: policy.name,
          leave_type: policy.leave_type
        }
      });
    }
  }

  async deactivateLeavePolicy(id: string, deactivatedBy?: string): Promise<LeavePolicy> {
    const policy = await this.updateLeavePolicy(id, { is_active: false }, deactivatedBy);
    
    // Create audit log
    if (deactivatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deactivatedBy,
        action: 'DEACTIVATE_LEAVE_POLICY',
        resource_type: 'leave_policy',
        resource_id: id,
        details: {
          deactivated_policy_name: policy.name
        }
      });
    }
    
    return policy;
  }

  async activateLeavePolicy(id: string, activatedBy?: string): Promise<LeavePolicy> {
    const policy = await this.updateLeavePolicy(id, { is_active: true }, activatedBy);
    
    // Create audit log
    if (activatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: activatedBy,
        action: 'ACTIVATE_LEAVE_POLICY',
        resource_type: 'leave_policy',
        resource_id: id,
        details: {
          activated_policy_name: policy.name
        }
      });
    }
    
    return policy;
  }

  async getActivePolicies(): Promise<LeavePolicy[]> {
    return this.leavePolicyRepository.findAll({ is_active: true });
  }

  async getPolicyForLeaveType(leaveType: string): Promise<LeavePolicy | null> {
    const policies = await this.getLeavePoliciesByType(leaveType);
    return policies.length > 0 ? policies[0] : null;
  }
}
