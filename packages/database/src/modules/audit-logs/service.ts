import { AuditLogRepository } from './repository';
import { AuditLog, CreateAuditLogData, AuditLogFilters } from './types';

export class AuditLogService {
  constructor(private auditLogRepository: AuditLogRepository) {}

  async getAllAuditLogs(filters?: AuditLogFilters): Promise<AuditLog[]> {
    return this.auditLogRepository.findAll(filters);
  }

  async createAuditLog(auditLogData: CreateAuditLogData): Promise<AuditLog> {
    try {
      return await this.auditLogRepository.create(auditLogData);
    } catch (error) {
      // Log the error but don't throw it to prevent breaking the main operation
      console.error('Failed to create audit log:', error);
      console.error('Audit log data:', auditLogData);
      
      // Return a mock audit log to prevent breaking the calling code
      // In production, you might want to queue this for retry or use a different approach
      return {
        id: 'audit-log-failed',
        user_id: auditLogData.user_id,
        action: auditLogData.action,
        resource_type: auditLogData.resource_type,
        resource_id: auditLogData.resource_id,
        details: auditLogData.details,
        ip_address: auditLogData.ip_address,
        user_agent: auditLogData.user_agent,
        created_at: new Date(),
        updated_at: new Date()
      };
    }
  }

  async getAuditLogsByUserId(userId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByUserId(userId);
  }

  async getAuditLogsByResource(resourceType: string, resourceId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.findByResource(resourceType, resourceId);
  }

  async logUserAction(userId: string, action: string, resourceType: string, resourceId: string, details?: Record<string, any>): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details: details || {}
    });
  }

  async logLogin(userId: string, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      action: 'USER_LOGIN',
      resource_type: 'auth',
      resource_id: userId,
      details: { login_time: new Date().toISOString() },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  async logLogout(userId: string, ipAddress?: string, userAgent?: string): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      action: 'USER_LOGOUT',
      resource_type: 'auth',
      resource_id: userId,
      details: { logout_time: new Date().toISOString() },
      ip_address: ipAddress,
      user_agent: userAgent
    });
  }

  async logDataAccess(userId: string, resourceType: string, resourceId: string, accessType: 'read' | 'write' | 'delete'): Promise<AuditLog> {
    return this.createAuditLog({
      user_id: userId,
      action: `DATA_${accessType.toUpperCase()}`,
      resource_type: resourceType,
      resource_id: resourceId,
      details: { access_type: accessType, timestamp: new Date().toISOString() }
    });
  }
}
