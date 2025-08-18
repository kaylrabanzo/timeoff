import { DatabaseClient } from '../shared/types';
import { DatabaseUtils } from '../shared/utils';
import { Team, CreateTeamData, UpdateTeamData, TeamFilters } from './types';

export class TeamRepository {
  constructor(private db: DatabaseClient) {}

  async findAll(filters?: TeamFilters): Promise<Team[]> {
    try {
      let query = this.db.from('teams').select('*');

      if (filters) {
        query = DatabaseUtils.applyFilters(query, filters);
      }

      const { data, error } = await query.order('name');
      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findAllTeams');
    }
  }

  async findById(id: string): Promise<Team> {
    try {
      const { data, error } = await this.db
        .from('teams')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findTeamById');
    }
  }

  async findByDepartment(departmentId: string): Promise<Team[]> {
    try {
      const { data, error } = await this.db
        .from('teams')
        .select('*')
        .eq('department_id', departmentId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'findTeamsByDepartment');
    }
  }

  async create(teamData: CreateTeamData): Promise<Team> {
    try {
      DatabaseUtils.validateRequiredFields(teamData, ['name', 'department_id']);

      const sanitizedData = DatabaseUtils.sanitizeData(teamData);
      
      const { data, error } = await this.db
        .from('teams')
        .insert(sanitizedData)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'createTeam');
    }
  }

  async update(id: string, updates: UpdateTeamData): Promise<Team> {
    try {
      const sanitizedUpdates = DatabaseUtils.sanitizeData(updates);
      
      const { data, error } = await this.db
        .from('teams')
        .update(sanitizedUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'updateTeam');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await this.db
        .from('teams')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw DatabaseUtils.handleDatabaseError(error, 'deleteTeam');
    }
  }
}
