import { UserRepository } from './repository';
import { User, CreateUserData, UpdateUserData, UserFilters, UserStats, ManagerTeamStats } from './types';
import { AuditLogService } from '../audit-logs/service';
import { LeaveRequestService } from '../leave-requests/service';

export class UserService {
  constructor(
    private userRepository: UserRepository,
    private auditLogService: AuditLogService,
    private leaveRequestService: LeaveRequestService
  ) {}

  async getUserById(id: string): Promise<User> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.userRepository.findByEmail(email);
  }

  async getAllUsers(filters?: UserFilters): Promise<User[]> {
    return this.userRepository.findAll(filters);
  }

  async createUser(userData: CreateUserData, createdBy?: string): Promise<User> {
    const user = await this.userRepository.create(userData);
    
    // Create audit log (handle failures gracefully)
    if (createdBy) {
      try {
        await this.auditLogService.createAuditLog({
          user_id: createdBy,
          action: 'CREATE_USER',
          resource_type: 'user',
          resource_id: user.id,
          details: {
            user_email: user.email,
            user_role: user.role,
            department: user.department
          }
        });
      } catch (error) {
        console.error('Failed to create audit log for user creation:', error);
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return user;
  }

  async updateUser(id: string, updates: UpdateUserData, updatedBy?: string): Promise<User> {
    const user = await this.userRepository.update(id, updates);
    
    // Create audit log (handle failures gracefully)
    if (updatedBy) {
      try {
        await this.auditLogService.createAuditLog({
          user_id: updatedBy,
          action: 'UPDATE_USER',
          resource_type: 'user',
          resource_id: id,
          details: {
            updated_fields: Object.keys(updates),
            user_email: user.email
          }
        });
      } catch (error) {
        console.error('Failed to create audit log for user update:', error);
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return user;
  }

  async deleteUser(id: string, deletedBy?: string): Promise<void> {
    const user = await this.userRepository.findById(id);
    
    await this.userRepository.delete(id);
    
    // Create audit log (handle failures gracefully)
    if (deletedBy) {
      try {
        await this.auditLogService.createAuditLog({
          user_id: deletedBy,
          action: 'DELETE_USER',
          resource_type: 'user',
          resource_id: id,
          details: {
            deleted_user_email: user.email,
            deleted_user_role: user.role
          }
        });
      } catch (error) {
        console.error('Failed to create audit log for user deletion:', error);
        // Don't fail the main operation if audit logging fails
      }
    }
  }

  async getTeamMembers(managerId: string): Promise<User[]> {
    return this.userRepository.getTeamMembers(managerId);
  }

  async getUserStats(): Promise<UserStats> {
    return this.userRepository.getStats();
  }

  async getManagerTeamStats(managerId: string): Promise<ManagerTeamStats> {
    // Get team members count
    const teamMembers = await this.getTeamMembers(managerId);
    
    // Get pending requests count for team
    const pendingRequests = await this.leaveRequestService.getPendingLeaveRequests(managerId);
    
    // Get approved requests this month for team
    const currentMonth = new Date();
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Use the optimized repository method
    const monthlyApproved = await this.leaveRequestService.getMonthlyApprovedRequestsForManager(
      managerId, 
      startOfMonth, 
      endOfMonth
    );

    return {
      teamMembersCount: teamMembers.length,
      pendingRequestsCount: pendingRequests.length,
      monthlyApprovedCount: monthlyApproved.length
    };
  }

  async deactivateUser(id: string, deactivatedBy?: string): Promise<User> {
    const user = await this.updateUser(id, { is_active: false }, deactivatedBy);
    
    // Create audit log (handle failures gracefully)
    if (deactivatedBy) {
      try {
        await this.auditLogService.createAuditLog({
          user_id: deactivatedBy,
          action: 'DEACTIVATE_USER',
          resource_type: 'user',
          resource_id: id,
          details: {
            deactivated_user_email: user.email
          }
        });
      } catch (error) {
        console.error('Failed to create audit log for user deactivation:', error);
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return user;
  }

  async activateUser(id: string, activatedBy?: string): Promise<User> {
    const user = await this.updateUser(id, { is_active: true }, activatedBy);
    
    // Create audit log (handle failures gracefully)
    if (activatedBy) {
      try {
        await this.auditLogService.createAuditLog({
          user_id: activatedBy,
          action: 'ACTIVATE_USER',
          resource_type: 'user',
          resource_id: id,
          details: {
            activated_user_email: user.email
          }
        });
      } catch (error) {
        console.error('Failed to create audit log for user activation:', error);
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return user;
  }

  async changeUserRole(id: string, newRole: string, changedBy?: string): Promise<User> {
    const user = await this.updateUser(id, { role: newRole }, changedBy);
    
    // Create audit log (handle failures gracefully)
    if (changedBy) {
      try {
        await this.auditLogService.createAuditLog({
          user_id: changedBy,
          action: 'CHANGE_USER_ROLE',
          resource_type: 'user',
          resource_id: id,
          details: {
            user_email: user.email,
            new_role: newRole,
            previous_role: user.role
          }
        });
      } catch (error) {
        console.error('Failed to create audit log for user role change:', error);
        // Don't fail the main operation if audit logging fails
      }
    }
    
    return user;
  }
}
