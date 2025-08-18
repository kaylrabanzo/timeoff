import { LeaveRequestRepository } from './repository';
import {
  LeaveRequest,
  CreateLeaveRequestData,
  UpdateLeaveRequestData,
  LeaveRequestFilters,
  LeaveRequestWithUser,
  LeaveRequestStats,
  ApprovalData
} from './types';
import { AuditLogService } from '../audit-logs/service';
import { NotificationService } from '../notifications/service';
import { LeaveBalanceService } from '../leave-balances/service';
import { UserService } from '../users/service';

export class LeaveRequestService {
  constructor(
    private leaveRequestRepository: LeaveRequestRepository,
    private auditLogService: AuditLogService,
    private notificationService: NotificationService,
    private leaveBalanceService: LeaveBalanceService,
    private userService: UserService
  ) {}

  async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    return this.leaveRequestRepository.findById(id);
  }

  async getLeaveRequestsByUser(userId: string): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.findByUserId(userId);
  }

  async getAllLeaveRequests(filters?: LeaveRequestFilters): Promise<LeaveRequestWithUser[]> {
    return this.leaveRequestRepository.findAll(filters);
  }

  async getPendingLeaveRequests(approverId?: string): Promise<LeaveRequestWithUser[]> {
    return this.leaveRequestRepository.findPendingRequests(approverId);
  }

  async getTeamLeaveRequests(managerId: string): Promise<LeaveRequestWithUser[]> {
    return this.leaveRequestRepository.findTeamRequests(managerId);
  }

  async createLeaveRequest(leaveRequestData: CreateLeaveRequestData): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.create(leaveRequestData);
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: leaveRequestData.user_id,
        action: 'CREATE_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: leaveRequest.id,
        details: {
          leave_request_id: leaveRequest.id,
          leave_type: leaveRequestData.leave_type,
          start_date: leaveRequestData.start_date,
          end_date: leaveRequestData.end_date
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request creation:', error);
      // Don't fail the creation if audit logging fails
    }
    
    // Send notification to approver if approval is required
    if (leaveRequest.approver_id) {
      try {
        // Get user name for the notification
        const user = await this.userService.getUserById(leaveRequestData.user_id);
        await this.notificationService.createApprovalNotification(
          leaveRequest.approver_id,
          user?.first_name || 'A user',
          leaveRequest.id
        );
      } catch (error) {
        console.error('Failed to send approval notification:', error);
        // Don't fail the creation if notification fails
      }
    }
    
    return leaveRequest;
  }

  async updateLeaveRequest(id: string, updates: UpdateLeaveRequestData): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.update(id, updates);
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: leaveRequest.user_id,
        action: 'UPDATE_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: id,
        details: {
          leave_request_id: id,
          updated_fields: Object.keys(updates)
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request update:', error);
      // Don't fail the update if audit logging fails
    }
    
    return leaveRequest;
  }

  async approveLeaveRequest(id: string, approverId: string, approvalData: ApprovalData): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.approve(id, approverId, approvalData.comments);
    
    // Update leave balance
    try {
      await this.leaveBalanceService.updateBalanceAfterApproval(leaveRequest);
    } catch (error) {
      console.error('Failed to update leave balance after approval:', error);
      // Don't fail the approval if balance update fails
    }
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: approverId,
        action: 'APPROVE_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: id,
        details: {
          leave_request_id: id,
          approved_by: approverId,
          approval_notes: approvalData.comments
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request approval:', error);
      // Don't fail the approval if audit logging fails
    }
    
    // Send notification to user
    try {
      await this.notificationService.createLeaveRequestNotification(
        leaveRequest.user_id,
        id,
        'approved'
      );
    } catch (error) {
      console.error('Failed to send approval notification:', error);
      // Don't fail the approval if notification fails
    }
    
    return leaveRequest;
  }

  async rejectLeaveRequest(id: string, approverId: string, approvalData: ApprovalData): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.reject(id, approverId, approvalData.rejection_reason || '');
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: approverId,
        action: 'REJECT_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: id,
        details: {
          leave_request_id: id,
          rejected_by: approverId,
          rejection_reason: approvalData.rejection_reason
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request rejection:', error);
      // Don't fail the rejection if audit logging fails
    }
    
    // Send notification to user
    try {
      await this.notificationService.createLeaveRequestNotification(
        leaveRequest.user_id,
        id,
        'rejected'
      );
    } catch (error) {
      console.error('Failed to send rejection notification:', error);
      // Don't fail the rejection if notification fails
    }
    
    return leaveRequest;
  }

  async cancelLeaveRequest(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.cancel(id);
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: leaveRequest.user_id,
        action: 'CANCEL_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: id,
        details: {
          leave_request_id: id
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request cancellation:', error);
      // Don't fail the cancellation if audit logging fails
    }
    
    return leaveRequest;
  }

  async softDeleteLeaveRequest(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.softDelete(id);
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: 'system',
        action: 'SOFT_DELETE_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: id,
        details: {
          leave_request_id: id
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request soft deletion:', error);
      // Don't fail the deletion if audit logging fails
    }
    
    return leaveRequest;
  }

  async restoreLeaveRequest(id: string): Promise<LeaveRequest> {
    const leaveRequest = await this.leaveRequestRepository.restore(id);
    
    // Create audit log
    try {
      await this.auditLogService.createAuditLog({
        user_id: 'system',
        action: 'RESTORE_LEAVE_REQUEST',
        resource_type: 'leave_request',
        resource_id: id,
        details: {
          leave_request_id: id
        }
      });
    } catch (error) {
      console.error('Failed to create audit log for leave request restoration:', error);
      // Don't fail the restoration if audit logging fails
    }
    
    return leaveRequest;
  }

  async bulkUpdateLeaveRequests(ids: string[], updates: UpdateLeaveRequestData): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.bulkUpdate(ids, updates);
  }

  async getActiveLeaveRequests(userId: string): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.getActiveRequests(userId);
  }

  async getLeaveRequestStats(): Promise<LeaveRequestStats> {
    return this.leaveRequestRepository.getStats();
  }

  async getMonthlyApprovedRequestsForManager(managerId: string, startDate: Date, endDate: Date): Promise<LeaveRequest[]> {
    return this.leaveRequestRepository.getMonthlyApprovedRequestsForManager(managerId, startDate, endDate);
  }
}
