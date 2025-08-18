'use client'

import { LeaveBalanceCard } from './leave-balance-card'
import { RecentRequestsCard } from './recent-requests-card'
import { TeamAvailabilityCard } from './team-availability-card'
import { UnifiedCalendarView } from './unified-calendar-view'
import { DashboardStats } from './dashboard-stats'
import { CalendarLegend } from '../shared/calendar/calendar-legend'
import { Card } from '@/components/ui/card'
import { User, LeaveBalance, LeaveRequest } from '@timeoff/types'

interface DashboardOverviewProps {
  user: User
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
  leaveBalance: LeaveBalance[]
  recentRequests: LeaveRequest[]
  balanceLoading: boolean
  requestsLoading: boolean
}

export function DashboardOverview({
  user,
  stats,
  leaveBalance,
  recentRequests,
  balanceLoading,
  requestsLoading
}: DashboardOverviewProps) {
  const isManager = user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr'

  return (
    <div className='w-full'>
      {/* Stats Overview */}
      <DashboardStats user={user} stats={stats} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-8">
          <LeaveBalanceCard
            leaveBalance={leaveBalance}
            isLoading={balanceLoading}
          />

          <RecentRequestsCard
            requests={recentRequests}
            isLoading={requestsLoading}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-1 w-full">
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

          {isManager ? (
            <TeamAvailabilityCard user={user} />
          ) : null}
        </div>
      </div>
    </div>
  )
}
