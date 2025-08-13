'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Calendar, FileText, Settings, Users } from 'lucide-react'
import type { User } from '@timeoff/types'

interface QuickActionsCardProps {
  user: User
}

export function QuickActionsCard({ user }: QuickActionsCardProps) {
  const actions = [
    {
      title: 'New Leave Request',
      description: 'Submit a new leave request',
      icon: Plus,
      href: '/requests/new',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'View Calendar',
      description: 'Check your leave calendar',
      icon: Calendar,
      href: '/calendar',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'My Requests',
      description: 'View all your requests',
      icon: FileText,
      href: '/requests',
      color: 'bg-purple-500 hover:bg-purple-600'
    }
  ]

  // Add management actions for supervisors and admins
  if (user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr') {
    actions.push(
      {
        title: 'Team Management',
        description: 'Manage team requests',
        icon: Users,
        href: '/team',
        color: 'bg-orange-500 hover:bg-orange-600'
      },
      {
        title: 'Settings',
        description: 'Configure system settings',
        icon: Settings,
        href: '/settings',
        color: 'bg-gray-500 hover:bg-gray-600'
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.title}
                className={`w-full justify-start ${action.color} text-white`}
                onClick={() => window.location.href = action.href}
              >
                <Icon className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-xs opacity-90">{action.description}</div>
                </div>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
} 