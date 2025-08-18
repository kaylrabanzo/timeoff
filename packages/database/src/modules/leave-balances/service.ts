import { LeaveBalanceRepository } from './repository';
import { LeaveBalance, CreateLeaveBalanceData, UpdateLeaveBalanceData, LeaveBalanceFilters, LeaveBalanceSummary } from './types';
import { LeaveRequest } from '../leave-requests/types';

export class LeaveBalanceService {
  constructor(private leaveBalanceRepository: LeaveBalanceRepository) {}

  async getLeaveBalance(userId: string, year: number): Promise<LeaveBalance[]> {
    return this.leaveBalanceRepository.findByUserId(userId, year);
  }

  async getAllLeaveBalances(filters?: LeaveBalanceFilters): Promise<LeaveBalance[]> {
    return this.leaveBalanceRepository.findAll(filters);
  }

  async createLeaveBalance(balanceData: CreateLeaveBalanceData): Promise<LeaveBalance> {
    // Calculate remaining days if not provided
    const dataWithCalculations = {
      ...balanceData,
      used_days: balanceData.used_days || 0,
      remaining_days: balanceData.remaining_days || (balanceData.total_allowance - (balanceData.used_days || 0)),
      carried_over: balanceData.carried_over || 0
    };

    return this.leaveBalanceRepository.upsert(dataWithCalculations);
  }

  async updateLeaveBalance(id: string, updates: UpdateLeaveBalanceData): Promise<LeaveBalance> {
    return this.leaveBalanceRepository.update(id, updates);
  }

  async updateBalanceAfterApproval(request: LeaveRequest): Promise<void> {
    // Find the user's leave balance for the current year
    const currentYear = new Date().getFullYear();
    const balances = await this.leaveBalanceRepository.findByUserId(request.user_id, currentYear);
    
    // Find the balance for the specific leave type
    const balance = balances.find(b => b.leave_type === request.leave_type);
    
    if (balance) {
      // Update the used days and remaining days
      const newUsedDays = balance.used_days + request.total_days;
      const newRemainingDays = balance.total_allowance - newUsedDays;
      
      await this.leaveBalanceRepository.update(balance.id, {
        used_days: newUsedDays,
        remaining_days: newRemainingDays
      });
    }
  }

  async getLeaveBalanceSummary(userId: string, year: number): Promise<LeaveBalanceSummary> {
    const balances = await this.leaveBalanceRepository.findByUserId(userId, year);
    
    const totalRemaining = balances.reduce((sum, balance) => sum + balance.remaining_days, 0);
    const totalUsed = balances.reduce((sum, balance) => sum + balance.used_days, 0);
    
    return {
      user_id: userId,
      balances,
      total_remaining: totalRemaining,
      total_used: totalUsed
    };
  }

  async carryOverBalances(userId: string, fromYear: number, toYear: number): Promise<void> {
    const oldBalances = await this.leaveBalanceRepository.findByUserId(userId, fromYear);
    
    for (const oldBalance of oldBalances) {
      if (oldBalance.remaining_days > 0) {
        // Create new balance for the next year with carried over days
        await this.leaveBalanceRepository.upsert({
          user_id: userId,
          leave_type: oldBalance.leave_type,
          total_allowance: oldBalance.total_allowance + oldBalance.remaining_days,
          used_days: 0,
          remaining_days: oldBalance.total_allowance + oldBalance.remaining_days,
          carried_over: oldBalance.remaining_days,
          year: toYear
        });
      }
    }
  }
}
