import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDatabaseService } from '@/providers/database-provider'
import { User, LeaveRequest, LeaveBalance, Notification } from '@timeoff/types'
import { calculateTotalDays } from '@/lib/date-utils'
import { 
  DatabaseLeaveRequest, 
  DatabaseLeaveBalance, 
  DatabaseNotification,
  adaptLeaveRequests,
  adaptLeaveBalances,
  adaptNotifications
} from '@/lib/type-adapters'

interface DashboardDataReturn {
  leaveBalance: LeaveBalance[]
  recentRequests: LeaveRequest[]
  teamRequests: LeaveRequest[]
  teamStats: any
  allRequests: LeaveRequest[]
  notifications: Notification[]
  balanceLoading: boolean
  requestsLoading: boolean
  teamRequestsLoading: boolean
  teamStatsLoading: boolean
  allRequestsLoading: boolean
  notificationsLoading: boolean
  isCreatingLeaveRequest: boolean
  stats: {
    totalRequests: number
    pendingRequests: number
    approvedRequests: number
    unreadNotifications: number
    teamMembersCount?: number
    teamPendingRequests?: number
    teamApprovedThisMonth?: number
    allPendingRequests?: number
  }
  getRequestsData: (selectedTab: string) => LeaveRequest[]
  createLeaveRequest: (data: Omit<DatabaseLeaveRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<DatabaseLeaveRequest>
  calculateTotalDays: (startDate: Date, endDate: Date) => number
  isManager: boolean
  isAdminOrHR: boolean
}

export function useDashboardData(user: User): DashboardDataReturn {
  const databaseService = useDatabaseService()
  const queryClient = useQueryClient()

  // Role-based flags
  const isManager = user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr'
  const isAdminOrHR = user.role === 'admin' || user.role === 'hr'

  // Fetch user's leave balance
  const { data: leaveBalance, isLoading: balanceLoading } = useQuery({
    queryKey: ['leaveBalance', user.id],
    queryFn: () => databaseService.getLeaveBalance(user.id, new Date().getFullYear()),
  })

  // Fetch user's recent requests
  const { data: recentRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['recentRequests', user.id],
    queryFn: () => databaseService.getLeaveRequestsByUser(user.id),
  })

  // Fetch team data for managers
  const { data: teamRequests, isLoading: teamRequestsLoading } = useQuery({
    queryKey: ['teamLeaveRequests', user.id],
    queryFn: () => isManager ? databaseService.getTeamLeaveRequests(user.id, user.department) : Promise.resolve([]),
    enabled: isManager
  })

  // Fetch team stats for managers
  const { data: teamStats, isLoading: teamStatsLoading } = useQuery({
    queryKey: ['teamStats', user.id],
    queryFn: () => isManager ? databaseService.getManagerTeamStats(user.id) : Promise.resolve(null),
    enabled: isManager
  })

  // Fetch all requests for admins/HR
  const { data: allRequests, isLoading: allRequestsLoading } = useQuery({
    queryKey: ['allLeaveRequests'],
    queryFn: () => isAdminOrHR ? databaseService.getAllLeaveRequests() : Promise.resolve([]),
    enabled: isAdminOrHR
  })

  // Fetch notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user.id],
    queryFn: () => databaseService.getNotificationsByUser(user.id, 5),
  })

  // Create leave request mutation
  const { mutateAsync: createLeaveRequest, isPending: isCreatingLeaveRequest } = useMutation({
    mutationFn: async (data: Omit<DatabaseLeaveRequest, 'id' | 'created_at' | 'updated_at'>) => {
      const newRequest = await databaseService.createLeaveRequest(data)

      // Auto-approve for managers if enabled (configurable)
      if (isManager && data.status === 'pending') {
        // Optional: Add a setting to control auto-approval for managers
        // For now, we'll auto-approve manager's own requests
        await databaseService.approveLeaveRequest(newRequest.id, user.id, 'Auto-approved (Manager self-leave)')
      }

      return newRequest
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveBalance', user.id] })
      queryClient.invalidateQueries({ queryKey: ['recentRequests', user.id] })
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
      queryClient.invalidateQueries({ queryKey: ['teamLeaveRequests'] })
      queryClient.invalidateQueries({ queryKey: ['allLeaveRequests'] })
    }
  })

  // Compute statistics
  const stats = {
    totalRequests: recentRequests?.length || 0,
    pendingRequests: recentRequests?.filter(req => req.status === 'pending').length || 0,
    approvedRequests: recentRequests?.filter(req => req.status === 'approved').length || 0,
    unreadNotifications: notifications?.filter(n => !n.is_read).length || 0,
    teamMembersCount: teamStats?.teamMembersCount || 0,
    teamPendingRequests: teamRequests?.filter(req => req.status === 'pending').length || 0,
    teamApprovedThisMonth: teamStats?.monthlyApprovedCount || 0,
    allPendingRequests: allRequests?.filter(req => req.status === 'pending').length || 0,
  }

  // Determine which data to show in requests table
  const getRequestsData = (selectedTab: string): LeaveRequest[] => {
    if (selectedTab === 'requests') {
      if (isAdminOrHR) {
        return adaptLeaveRequests(allRequests || [])
      } else if (isManager) {
        return adaptLeaveRequests(teamRequests || [])
      }
    }
    return adaptLeaveRequests(recentRequests || [])
  }

  return {
    // Data (converted to types package types)
    leaveBalance: adaptLeaveBalances(leaveBalance || []),
    recentRequests: adaptLeaveRequests(recentRequests || []),
    teamRequests: adaptLeaveRequests(teamRequests || []),
    teamStats,
    allRequests: adaptLeaveRequests(allRequests || []),
    notifications: adaptNotifications(notifications || []),
    
    // Loading states
    balanceLoading,
    requestsLoading,
    teamRequestsLoading,
    teamStatsLoading,
    allRequestsLoading,
    notificationsLoading,
    isCreatingLeaveRequest,
    
    // Computed values
    stats,
    getRequestsData,
    
    // Actions
    createLeaveRequest,
    calculateTotalDays,
    
    // Role flags
    isManager,
    isAdminOrHR
  }
}
