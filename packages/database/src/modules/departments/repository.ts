import { DatabaseClient } from '../shared/types';
import { DatabaseUtils } from '../shared/utils';
import { Department, CreateDepartmentData, UpdateDepartmentData, DepartmentFilters } from './types';

export class DepartmentRepository {
  constructor(private db: DatabaseClient) {}

  async findAll(filters?: DepartmentFilters): Promise<Department[]> {
    try {
      let query = this.db.from('departments').select('*');

      if (filters) {
        query = DatabaseUtils.applyFilters(query, filters);
      }

      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAllDepartments');
    }
  }

  async findById(id: string): Promise<Department> {
    try {
      const { data, error } = await this.db
        .from('departments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findDepartmentById');
    }
  }

  async create(departmentData: CreateDepartmentData): Promise<Department> {
    try {
      DatabaseUtils.validateRequiredFields(departmentData, ['name']);

      const sanitizedData = DatabaseUtils.sanitizeData(departmentData);
      
      const { data, error } = await this.db
        .from('departments')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'createDepartment');
    }
  }

  async update(id: string, updates: UpdateDepartmentData): Promise<Department> {
    try {
      const sanitizedUpdates = DatabaseUtils.sanitizeData(updates);
      
      const { data, error } = await this.db
        .from('departments')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'updateDepartment');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('departments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'deleteDepartment');
    }
  }
}
