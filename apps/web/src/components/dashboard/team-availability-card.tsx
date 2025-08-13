'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Users, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import type { User } from '@timeoff/types'
import Link from 'next/link'
import { Button } from '../ui/button'

interface TeamAvailabilityCardProps {
  user: User
}

export function TeamAvailabilityCard({ user }: TeamAvailabilityCardProps) {
  // Fetch team members (this would need to be implemented based on your user hierarchy)
  const { data: teamMembers, isLoading } = useQuery({
    queryKey: ['teamMembers', user.id],
    queryFn: async () => {
      // This is a placeholder - you would implement actual team member fetching
      return []
    },
    enabled: user.role === 'supervisor' || user.role === 'admin' || user.role === 'hr'
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!teamMembers || teamMembers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No team members found
          </p>
        </CardContent>
      </Card>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'on_leave':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'partial':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available'
      case 'on_leave':
        return 'On Leave'
      case 'partial':
        return 'Partial'
      default:
        return 'Unknown'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Team Availability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teamMembers.map((member: any) => (
            <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
              <Avatar className="h-8 w-8">
                <AvatarImage src={member.avatar} />
                <AvatarFallback>
                  {member.first_name?.charAt(0)}{member.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {member.first_name} {member.last_name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.role}
                </p>
              </div>

              <div className="flex items-center gap-1">
                {getStatusIcon(member.currentStatus)}
                <span className="text-xs text-muted-foreground">
                  {getStatusText(member.currentStatus)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t">
          <Link href="/calendar">
            <Button variant="outline" className="w-full">
              View full team calendar
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 