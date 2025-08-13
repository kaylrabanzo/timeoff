'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { TeamCalendarView } from '@/components/dashboard/team-calendar-view'
import { AuthLoading } from '@/components/auth-loading'
import type { User } from '@timeoff/types'

export default function TeamCalendarPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <AuthLoading />
  }

  if (!session?.user) {
    redirect('/auth/signin')
  }

  // Check if user has permission to view team calendar
  const canViewTeamCalendar = session.user.role === 'supervisor' || 
                            session.user.role === 'admin' || 
                            session.user.role === 'hr'

  if (!canViewTeamCalendar) {
    redirect('/dashboard')
  }

  // Map NextAuth session user to User type
  const user: User = {
    id: session.user.id,
    email: session.user.email || '',
    first_name: session.user.first_name,
    last_name: session.user.last_name,
    avatar: session.user.image || undefined,
    department: session.user.department,
    team: session.user.team,
    role: session.user.role,
    manager_id: session.user.managerId,
    hire_date: session.user.hireDate,
    is_active: session.user.isActive,
    created_at: new Date(), // Mock value for now
    updated_at: new Date(), // Mock value for now
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Team Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage your team's leave requests on a calendar
          </p>
        </div>
        
        <TeamCalendarView user={user} />
      </div>
    </div>
  )
} 