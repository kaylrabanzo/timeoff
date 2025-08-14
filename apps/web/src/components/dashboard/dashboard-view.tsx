'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Clock,
  TrendingUp,
  FileText,
  Bell,
  Loader2,
} from 'lucide-react'
import { LeaveBalanceCard } from './leave-balance-card'
import { RecentRequestsCard } from './recent-requests-card'
import { TeamAvailabilityCard } from './team-availability-card'
import { UnifiedCalendarView } from './unified-calendar-view'
import { LeaveRequestForm } from '../leave-request-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDatabaseService } from '@/providers/database-provider'
import { LeaveBalance, LeaveRequest, LeaveType, RequestStatus, User } from '@timeoff/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarLegend } from '../shared/calendar/calendar-legend'
import { DataTable as LeaveRequestDataTable } from '../leave-request/data-table'
import { differenceInDays, endOfDay, format, startOfDay } from 'date-fns'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface DashboardViewProps {
  user: User
}

export function DashboardView({ user }: DashboardViewProps) {
  const { slug } = useParams()
  const databaseService = useDatabaseService()

  const selectedTab = slug as 'overview' | 'requests' | 'calendar' || 'overview'
  const queryClient = useQueryClient()

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

  // Manager-specific queries
  const isManager = user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr'

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
    queryFn: () => (user.role === 'admin' || user.role === 'hr') ? databaseService.getAllLeaveRequests() : Promise.resolve([]),
    enabled: user.role === 'admin' || user.role === 'hr'
  })

  // Fetch notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user.id],
    queryFn: () => databaseService.getNotificationsByUser(user.id, 5),
  })

  // create leave request
  const { mutateAsync: createLeaveRequest, isPending: isCreatingLeaveRequest } = useMutation({
    mutationFn: async (data: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at'>) => {
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

  const pendingRequests = recentRequests?.filter(req => req.status === 'pending').length || 0
  const approvedRequests = recentRequests?.filter(req => req.status === 'approved').length || 0
  const unreadNotifications = notifications?.filter(n => !n.is_read).length || 0

  // Manager-specific stats
  const teamPendingRequests = teamRequests?.filter(req => req.status === 'pending').length || 0
  const teamApprovedThisMonth = teamStats?.monthlyApprovedCount || 0
  const teamMembersCount = teamStats?.teamMembersCount || 0

  // Admin/HR stats (all requests)
  const allPendingRequests = allRequests?.filter(req => req.status === 'pending').length || 0
  const totalRequests = allRequests?.length || 0

  // Determine which data to show in requests table
  const getRequestsData = () => {
    if (selectedTab === 'requests') {
      if (user.role === 'admin' || user.role === 'hr') {
        return allRequests || []
      } else if (isManager) {
        return teamRequests || []
      }
    }
    return recentRequests || []
  }

  const requestsData = getRequestsData()


  const calculateTotalDays = (startDate: Date, endDate: Date) => {
    // Create new Date objects to avoid mutating the input parameters
    const start = startOfDay(new Date(startDate))
    const end = startOfDay(new Date(endDate))

    // Add 1 to include both start and end dates (inclusive range)
    return differenceInDays(end, start) + 1
  }

  
  console.log(calculateTotalDays(new Date('2025-08-14'), new Date('2025-08-15')), 'calculateTotalDays')


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.first_name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Here's what's happening with your timeoff requests
            </p>
          </div>
          <LeaveRequestForm
            onSubmit={async (data) => {
              const newRequest = {
                ...data,
                start_date: format(data.start_date, 'yyyy-MM-dd'),
                end_date: format(data.end_date, 'yyyy-MM-dd'),
                leave_type: data.leave_type as LeaveType,
                user_id: user.id,
                status: RequestStatus.PENDING,
                total_days: data.start_date && data.end_date ? calculateTotalDays(data.start_date, data.end_date) : 0,
              }
              console.log(newRequest, 'newRequest')
              await createLeaveRequest(newRequest)
            }}
            isLoading={isCreatingLeaveRequest}
          />
        </div>

        <Tabs defaultValue={selectedTab} className='mb-8'>
          <TabsList className="grid grid-cols-3 lg:w-[320px]">
            <TabsTrigger value="overview">
              <Link href="/dashboard">Overview</Link>
            </TabsTrigger>
            <TabsTrigger value="requests">
              <Link href="/dashboard/requests">Requests</Link>
            </TabsTrigger>
            <TabsTrigger value="calendar">
              <Link href="/dashboard/calendar">Calendar</Link>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className='w-full'>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* First card shows different metrics based on role */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {isManager ? 'Team Members' : 'Total Requests'}
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {isManager ? teamMembersCount : (recentRequests?.length || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isManager ? 'Active team members' : 'All time requests'}
                  </p>
                </CardContent>
              </Card>

              {/* Pending requests - context-aware */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {(user.role === 'admin' || user.role === 'hr') ? allPendingRequests :
                      isManager ? teamPendingRequests : pendingRequests}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isManager ? 'Team requests pending' : 'Awaiting approval'}
                  </p>
                </CardContent>
              </Card>

              {/* Approved this month - context-aware */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {isManager ? teamApprovedThisMonth : approvedRequests}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isManager ? 'Approved this month' : 'Successfully approved'}
                  </p>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{unreadNotifications}</div>
                  <p className="text-xs text-muted-foreground">
                    Unread messages
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-3 space-y-8">
                <LeaveBalanceCard
                  leaveBalance={leaveBalance as unknown as LeaveBalance[]}
                  isLoading={balanceLoading}
                />

                <RecentRequestsCard
                  requests={recentRequests as unknown as LeaveRequest[]}
                  isLoading={requestsLoading}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-1 w-full">
                {/* <QuickActionsCard user={user} /> */}

                <Card className='bg-white p-2 shadow-none'>
                  <CalendarLegend className='*:text-[12px]' legendType='horizontal' />

                  <UnifiedCalendarView
                    user={user}
                    isCalendarOnly={true}
                    filterOn={false}
                    eventVariant="circle"
                    calendarVariant="compact"
                    cardView={false}
                  />
                </Card>

                {user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr' ? (
                  <TeamAvailabilityCard user={user} />
                ) : null}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requests" className='w-full'>
            {
              (requestsLoading || teamRequestsLoading || allRequestsLoading) ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <LeaveRequestDataTable
                  data={requestsData as unknown as LeaveRequest[]}
                  showEmployeeColumn={isManager}
                  showBulkActions={isManager}
                  isManager={isManager}
                />
              )
            }
          </TabsContent>

          <TabsContent value="calendar" className='w-full'>
            <UnifiedCalendarView
              user={user}
            />
          </TabsContent>

        </Tabs>

      </div>
    </div>
  )
} 