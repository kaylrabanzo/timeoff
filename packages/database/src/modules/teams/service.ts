import { TeamRepository } from './repository';
import { Team, CreateTeamData, UpdateTeamData, TeamFilters } from './types';
import { AuditLogService } from '../audit-logs/service';

export class TeamService {
  constructor(
    private teamRepository: TeamRepository,
    private auditLogService: AuditLogService
  ) {}

  async getAllTeams(filters?: TeamFilters): Promise<Team[]> {
    return this.teamRepository.findAll(filters);
  }

  async getTeamById(id: string): Promise<Team> {
    return this.teamRepository.findById(id);
  }

  async getTeamsByDepartment(departmentId: string): Promise<Team[]> {
    return this.teamRepository.findByDepartment(departmentId);
  }

  async createTeam(teamData: CreateTeamData, createdBy?: string): Promise<Team> {
    const team = await this.teamRepository.create(teamData);
    
    // Create audit log
    if (createdBy) {
      await this.auditLogService.createAuditLog({
        user_id: createdBy,
        action: 'CREATE_TEAM',
        resource_type: 'team',
        resource_id: team.id,
        details: {
          team_name: team.name,
          department_id: team.department_id,
          lead_id: team.lead_id
        }
      });
    }
    
    return team;
  }

  async updateTeam(id: string, updates: UpdateTeamData, updatedBy?: string): Promise<Team> {
    const team = await this.teamRepository.update(id, updates);
    
    // Create audit log
    if (updatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: updatedBy,
        action: 'UPDATE_TEAM',
        resource_type: 'team',
        resource_id: id,
        details: {
          updated_fields: Object.keys(updates),
          team_name: team.name
        }
      });
    }
    
    return team;
  }

  async deleteTeam(id: string, deletedBy?: string): Promise<void> {
    const team = await this.teamRepository.findById(id);
    
    await this.teamRepository.delete(id);
    
    // Create audit log
    if (deletedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deletedBy,
        action: 'DELETE_TEAM',
        resource_type: 'team',
        resource_id: id,
        details: {
          deleted_team_name: team.name,
          department_id: team.department_id
        }
      });
    }
  }

  async deactivateTeam(id: string, deactivatedBy?: string): Promise<Team> {
    const team = await this.updateTeam(id, { is_active: false }, deactivatedBy);
    
    // Create audit log
    if (deactivatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: deactivatedBy,
        action: 'DEACTIVATE_TEAM',
        resource_type: 'team',
        resource_id: id,
        details: {
          deactivated_team_name: team.name
        }
      });
    }
    
    return team;
  }

  async activateTeam(id: string, activatedBy?: string): Promise<Team> {
    const team = await this.updateTeam(id, { is_active: true }, activatedBy);
    
    // Create audit log
    if (activatedBy) {
      await this.auditLogService.createAuditLog({
        user_id: activatedBy,
        action: 'ACTIVATE_TEAM',
        resource_type: 'team',
        resource_id: id,
        details: {
          activated_team_name: team.name
        }
      });
    }
    
    return team;
  }
}
