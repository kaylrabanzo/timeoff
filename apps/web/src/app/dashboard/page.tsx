'use client'
import { DashboardView } from '@/components/dashboard/dashboard-view'
import type { User } from '@timeoff/types'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  if (!session?.user) {
    return null
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

  return <DashboardView slug={"overview"} />
} 