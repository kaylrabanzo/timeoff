'use client'

import { LeaveRequestForm } from '../leave-request-form'
import { User } from '@timeoff/types'
import { LeaveType, RequestStatus } from '@timeoff/types'
import { format } from 'date-fns'
import { DatabaseLeaveRequest } from '@/lib/type-adapters'

interface DashboardHeaderProps {
  user: User
  onSubmit: (data: Omit<DatabaseLeaveRequest, 'id' | 'created_at' | 'updated_at'>) => Promise<DatabaseLeaveRequest>
  isLoading: boolean
  calculateTotalDays: (startDate: Date, endDate: Date) => number
}

export function DashboardHeader({ 
  user, 
  onSubmit, 
  isLoading, 
  calculateTotalDays 
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user.first_name || 'User'}!
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Here's what's happening with your timeoff requests
        </p>
      </div>
      <LeaveRequestForm
        onSubmit={async (data) => {

          let totalDays = data.start_date && data.end_date ? calculateTotalDays(data.start_date, data.end_date) : 0
          if (data.is_half_day) {
            totalDays = totalDays / 2
          }
          
          const newRequest = {
            ...data,
            start_date: format(data.start_date, 'yyyy-MM-dd'),
            end_date: format(data.end_date, 'yyyy-MM-dd'),
            leave_type: data.leave_type as LeaveType,
            user_id: user.id,
            status: RequestStatus.PENDING,
            total_days: totalDays,
          }
          console.log(newRequest, 'newRequest')
          await onSubmit(newRequest)
        }}
        isLoading={isLoading}
      />
    </div>
  )
}
