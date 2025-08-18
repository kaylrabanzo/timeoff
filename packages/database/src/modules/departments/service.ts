import { DepartmentRepository } from './repository';
import { Department, CreateDepartmentData, UpdateDepartmentData, DepartmentFilters } from './types';
import { AuditLogService } from '../audit-logs/service';

export class DepartmentService {
  constructor(
    private departmentRepository: DepartmentRepository,
    private auditLogService: AuditLogService
  ) {}

  async getAllDepartments(filters?: DepartmentFilters): Promise<Department[]> {
    return this.departmentRepository.findAll(filters);
  }

  async getDepartmentById(id: string): Promise<Department> {
    return this.departmentRepository.findById(id);
  }

  async createDepartment(departmentData: CreateDepartmentData, createdBy?: string): Promise<Department> {
    const department = await this.departmentRepository.create(departmentData);
    
    // Create audit log
    if (createdBy) {
      await this.auditLogService.createAuditLog({
        user_id: createdBy,
        action: 'CREATE_DEPARTMENT',
        resource_type: 'department',
        resource_id: department.id,
        details: {
          department_name: department.name,
          manager_id: department.manager_id
        }
      });
    }
    
    return department;
  }

  async updateDepartment(id: string, updates: UpdateDepartmentData, updatedBy?: string): Promise<Department> {
    const department = await this.departmentRepository.update(id, updates);
    
    // Create audit log
    if (updatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: updatedBy,
        action: 'UPDATE_DEPARTMENT',
        resource_type: 'department',
        resource_id: id,
        details: {
          updated_fields: Object.keys(updates),
          department_name: department.name
        }
      });
    }
    
    return department;
  }

  async deleteDepartment(id: string, deletedBy?: string): Promise<void> {
    const department = await this.departmentRepository.findById(id);
    
    await this.departmentRepository.delete(id);
    
    // Create audit log
    if (deletedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deletedBy,
        action: 'DELETE_DEPARTMENT',
        resource_type: 'department',
        resource_id: id,
        details: {
          deleted_department_name: department.name
        }
      });
    }
  }

  async deactivateDepartment(id: string, deactivatedBy?: string): Promise<Department> {
    const department = await this.updateDepartment(id, { is_active: false }, deactivatedBy);
    
    // Create audit log
    if (deactivatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deactivatedBy,
        action: 'DEACTIVATE_DEPARTMENT',
        resource_type: 'department',
        resource_id: id,
        details: {
          deactivated_department_name: department.name
        }
      });
    }
    
    return department;
  }

  async activateDepartment(id: string, activatedBy?: string): Promise<Department> {
    const department = await this.updateDepartment(id, { is_active: true }, activatedBy);
    
    // Create audit log
    if (activatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: activatedBy,
        action: 'ACTIVATE_DEPARTMENT',
        resource_type: 'department',
        resource_id: id,
        details: {
          activated_department_name: department.name
        }
      });
    }
    
    return department;
  }
}
