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
import { databaseService } from '@timeoff/database'
import { LeaveBalance, LeaveRequest, LeaveType, RequestStatus, User } from '@timeoff/types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarLegend } from '../shared/calendar/calendar-legend'
import { DataTable } from '../leave-request/data-table'
import { differenceInDays, endOfDay, startOfDay } from 'date-fns'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface DashboardViewProps {
  user: User
}

export function DashboardView({ user }: DashboardViewProps) {
  const { slug } = useParams()

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

  // Fetch notifications
  const { data: notifications, isLoading: notificationsLoading } = useQuery({
    queryKey: ['notifications', user.id],
    queryFn: () => databaseService.getNotificationsByUser(user.id, 5),
  })

  // create leave request
  const { mutateAsync: createLeaveRequest, isPending: isCreatingLeaveRequest } = useMutation({
    mutationFn: (data: Omit<LeaveRequest, 'id' | 'created_at' | 'updated_at'>) => databaseService.createLeaveRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaveBalance', user.id] })
      queryClient.invalidateQueries({ queryKey: ['recentRequests', user.id] })
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] })
    }
  })

  const pendingRequests = recentRequests?.filter(req => req.status === 'pending').length || 0
  const approvedRequests = recentRequests?.filter(req => req.status === 'approved').length || 0
  const unreadNotifications = notifications?.filter(n => !n.is_read).length || 0

  const calculateTotalDays = (startDate: Date, endDate: Date) => {
    const start = startOfDay(startDate)
    const end = endOfDay(endDate)
    return differenceInDays(end, start)
  }

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
              await createLeaveRequest({
                ...data,
                leave_type: data.leave_type as LeaveType,
                user_id: user.id,
                status: RequestStatus.PENDING,
                total_days: data.start_date && data.end_date ? calculateTotalDays(data.start_date, data.end_date) : 0,
              })
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
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{recentRequests?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All time requests
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Approved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
                  <p className="text-xs text-muted-foreground">
                    Successfully approved
                  </p>
                </CardContent>
              </Card>

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
              requestsLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              ) : (
                <DataTable data={recentRequests as unknown as LeaveRequest[]} />
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