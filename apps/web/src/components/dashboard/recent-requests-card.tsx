'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, Calendar, Clock } from 'lucide-react'
import { formatDateRange, calculateDays, getLeaveTypeColor, getStatusColor } from '@/lib/utils'
import type { LeaveRequest } from '@timeoff/types'

interface RecentRequestsCardProps {
  requests?: LeaveRequest[]
  isLoading: boolean
}

export function RecentRequestsCard({ requests, isLoading }: RecentRequestsCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent requests found
          </p>
        </CardContent>
      </Card>
    )
  }

  const recentRequests = requests.slice(0, 5) // Show only last 5 requests

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Recent Requests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentRequests.map((request) => {
            const days = calculateDays(new Date(request.start_date), new Date(request.end_date))
            
            return (
              <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getLeaveTypeColor(request.leave_type)}>
                      {request.leave_type}
                    </Badge>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDateRange(new Date(request.start_date), new Date(request.end_date))}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{days} day{days !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  
                  {request.reason && (
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {request.reason}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {requests.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-sm text-blue-600 hover:text-blue-800">
              View all requests
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 