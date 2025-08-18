import { DatabaseClient } from '../shared/types';
import { DatabaseUtils } from '../shared/utils';
import { AuditLog, CreateAuditLogData, AuditLogFilters } from './types';

export class AuditLogRepository {
  constructor(private db: DatabaseClient) {}

  async findAll(filters?: AuditLogFilters): Promise<AuditLog[]> {
    try {
      let query = this.db.from('audit_logs').select('*');

      if (filters) {
        query = this.applyAuditLogFilters(query, filters);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAllAuditLogs');
    }
  }

  async create(auditLogData: CreateAuditLogData): Promise<AuditLog> {
    try {
      DatabaseUtils.validateRequiredFields(auditLogData, [
        'user_id', 'action', 'resource_type', 'resource_id'
      ]);

      const sanitizedData = DatabaseUtils.sanitizeData(auditLogData);
      
      const { data, error } = await this.db
        .from('audit_logs')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'createAuditLog');
    }
  }

  async findByUserId(userId: string): Promise<AuditLog[]> {
    try {
      const { data, error } = await this.db
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAuditLogsByUserId');
    }
  }

  async findByResource(resourceType: string, resourceId: string): Promise<AuditLog[]> {
    try {
      const { data, error } = await this.db
        .from('audit_logs')
        .select('*')
        .eq('resource_type', resourceType)
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAuditLogsByResource');
    }
  }

  private applyAuditLogFilters(query: any, filters: AuditLogFilters): any {
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    
    if (filters.action) {
      query = query.eq('action', filters.action);
    }
    
    if (filters.resource_type) {
      query = query.eq('resource_type', filters.resource_type);
    }
    
    if (filters.resource_id) {
      query = query.eq('resource_id', filters.resource_id);
    }
    
    if (filters.date_range) {
      query = query
        .gte('created_at', filters.date_range.start.toISOString())
        .lte('created_at', filters.date_range.end.toISOString());
    }
    
    return query;
  }
}
