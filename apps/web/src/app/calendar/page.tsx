'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { UnifiedCalendarView } from '@/components/dashboard/unified-calendar-view'
import { AuthLoading } from '@/components/auth-loading'
import { User } from '@timeoff/types'

export default function CalendarPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <AuthLoading />
  }

  if (!session?.user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leave Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            View and manage your leave requests on a calendar
          </p>
        </div>
        
        <UnifiedCalendarView user={session.user as unknown as User} />
      </div>
    </div>
  )
} 