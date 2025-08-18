'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable as LeaveRequestDataTable } from '../leave-request/data-table'
import { UnifiedCalendarView } from './unified-calendar-view'
import { DashboardOverview } from './dashboard-overview'
import { LeaveBalance, LeaveRequest, User } from '@timeoff/types'
import Link from 'next/link'
import { Skeleton } from '../ui/skeleton'

interface DashboardTabsProps {
  selectedTab: string
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
  requestsData: LeaveRequest[]
  balanceLoading: boolean
  requestsLoading: boolean
  teamRequestsLoading: boolean
  allRequestsLoading: boolean
}

export function DashboardTabs({
  selectedTab,
  user,
  stats,
  leaveBalance,
  recentRequests,
  requestsData,
  balanceLoading,
  requestsLoading,
  teamRequestsLoading,
  allRequestsLoading
}: DashboardTabsProps) {
  const isManager = user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr'

  return (
    <Tabs defaultValue={selectedTab} className='mb-8'>
      <TabsList className="grid grid-cols-3 lg:w-[320px]">
        <TabsTrigger value="overview" className='p-0 w-full'>
          <Link href="/dashboard" className='w-full p-2'>Overview</Link>
        </TabsTrigger>
        <TabsTrigger value="requests" className='p-0 w-full'>
          <Link href="/dashboard/requests" className='w-full p-2'>Requests</Link>
        </TabsTrigger>
        <TabsTrigger value="calendar" className='p-0 w-full'>
          <Link href="/dashboard/calendar" className='w-full p-2'>Calendar</Link>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className='w-full'>
        <DashboardOverview
          user={user}
          stats={stats}
          leaveBalance={leaveBalance}
          recentRequests={recentRequests}
          balanceLoading={balanceLoading}
          requestsLoading={requestsLoading}
        />
      </TabsContent>

      <TabsContent value="requests" className='w-full'>
        {
          (requestsLoading || teamRequestsLoading || allRequestsLoading) ? (
            <div className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <Skeleton className="h-10 w-1/2" />

                <Skeleton className="h-10 w-[100px]" />
              </div>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center flex-col gap-2 w-full">
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <LeaveRequestDataTable
              data={requestsData}
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
  )
}
