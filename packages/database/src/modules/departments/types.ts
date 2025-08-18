import { BaseEntity } from '../shared/types';

export interface Department extends BaseEntity {
  name: string;
  description?: string;
  manager_id?: string;
  is_active: boolean;
}

export interface CreateDepartmentData {
  name: string;
  description?: string;
  manager_id?: string;
  is_active?: boolean;
}

export interface UpdateDepartmentData {
  name?: string;
  description?: string;
  manager_id?: string;
  is_active?: boolean;
}

export interface DepartmentFilters {
  is_active?: boolean;
  manager_id?: string;
}

export interface DepartmentStats {
  total_departments: number;
  active_departments: number;
  departments_with_manager: number;
}
