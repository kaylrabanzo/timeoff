import { BaseEntity } from '../shared/types';

export interface Team extends BaseEntity {
  name: string;
  department_id: string;
  description?: string;
  lead_id?: string;
  is_active: boolean;
}

export interface CreateTeamData {
  name: string;
  department_id: string;
  description?: string;
  lead_id?: string;
  is_active?: boolean;
}

export interface UpdateTeamData {
  name?: string;
  department_id?: string;
  description?: string;
  lead_id?: string;
  is_active?: boolean;
}

export interface TeamFilters {
  department_id?: string;
  is_active?: boolean;
  lead_id?: string;
}

export interface TeamStats {
  total_teams: number;
  active_teams: number;
  teams_by_department: Record<string, number>;
}
