'use client'

import { useParams } from 'next/navigation'
import { DashboardHeader } from './dashboard-header'
import { DashboardTabs } from './dashboard-tabs'
import { useDashboardData } from '@/hooks/use-dashboard-data'
import { LeaveRequest, User, UserRole } from '@timeoff/types'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'


export function DashboardView({ slug }: { slug: string }) {
  const [selectedTab, setSelectedTab] = useState<string>(slug || 'overview')

  useEffect(() => {
    setSelectedTab(slug)
  }, [slug])


  const { data: session } = useSession()

  // Map NextAuth session user to User type
  const user: User = {
      id: session?.user.id || '',
      email: session?.user.email || '',
      first_name: session?.user.first_name || '',
      last_name: session?.user.last_name || '',
      avatar: session?.user.image || undefined,
      department: session?.user.department || '',
      team: session?.user.team || '',
      role: session?.user.role as UserRole || '',
      manager_id: session?.user.managerId || '',
      hire_date: session?.user.hireDate || new Date(),
      is_active: session?.user.isActive || true,
      created_at: new Date(), // Mock value for now
      updated_at: new Date(), // Mock value for now
  }
  
  const {
    leaveBalance,
    recentRequests,
    stats,
    getRequestsData,
    balanceLoading,
    requestsLoading,
    teamRequestsLoading,
    allRequestsLoading,
    isCreatingLeaveRequest,
    createLeaveRequest,
    calculateTotalDays
  } = useDashboardData(user)

  const requestsData = getRequestsData(selectedTab)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <DashboardHeader
          user={user}
          onSubmit={createLeaveRequest}
          isLoading={isCreatingLeaveRequest}
          calculateTotalDays={calculateTotalDays}
        />

        {/* Tabs */}
        <DashboardTabs
          selectedTab={selectedTab}
          user={user}
          stats={stats}
          leaveBalance={leaveBalance}
          recentRequests={recentRequests}
          requestsData={requestsData as LeaveRequest[]}
          balanceLoading={balanceLoading}
          requestsLoading={requestsLoading}
          teamRequestsLoading={teamRequestsLoading}
          allRequestsLoading={allRequestsLoading}
        />
      </div>
    </div>
  )
} 