'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, TrendingUp, FileText, Bell } from 'lucide-react'
import { User } from '@timeoff/types'

interface DashboardStatsProps {
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
}

export function DashboardStats({ user, stats }: DashboardStatsProps) {
  const isManager = user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr'
  const isAdminOrHR = user.role === 'admin' || user.role === 'hr'

  return (
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
            {isManager ? stats.teamMembersCount : stats.totalRequests}
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
            {isAdminOrHR ? stats.allPendingRequests :
              isManager ? stats.teamPendingRequests : stats.pendingRequests}
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
            {isManager ? stats.teamApprovedThisMonth : stats.approvedRequests}
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
          <div className="text-2xl font-bold text-blue-600">{stats.unreadNotifications}</div>
          <p className="text-xs text-muted-foreground">
            Unread messages
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
