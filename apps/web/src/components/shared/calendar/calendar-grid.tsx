'use client'

import { format, isSameDay, isSameMonth, isToday } from 'date-fns'
import { LeaveRequest, LeaveType, User as UserType } from '@timeoff/types'
import { cn } from '@/lib/utils'

interface CalendarGridProps {
  calendarWeeks: Array<Array<{
    date: Date
    personalRequests: LeaveRequest[]
    teamRequests: (LeaveRequest & { user: UserType })[]
  }>>
  currentMonth: Date
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  onRequestSelect: (request: LeaveRequest) => void
  calendarVariant?: 'default' | 'compact'
  eventVariant?: 'default' | 'compact' | 'compact-with-legend' | 'circle'
}

const getLeaveTypeColor = (leaveType: LeaveType) => {
  switch (leaveType) {
    case LeaveType.VACATION:
      return 'bg-blue-500'
    case LeaveType.SICK:
      return 'bg-red-500'
    case LeaveType.PERSONAL:
      return 'bg-purple-500'
    case LeaveType.MATERNITY:
      return 'bg-pink-500'
    case LeaveType.PATERNITY:
      return 'bg-indigo-500'
    case LeaveType.BEREAVEMENT:
      return 'bg-gray-500'
    case LeaveType.UNPAID:
      return 'bg-orange-500'
    default:
      return 'bg-gray-500'
  }
}

export const getLeaveTypeLabel = (leaveType: LeaveType) => {
  switch (leaveType) {
    case LeaveType.VACATION:
      return 'Vacation'
    case LeaveType.SICK:
      return 'Sick'
    case LeaveType.PERSONAL:
      return 'Personal'
    case LeaveType.MATERNITY:
      return 'Maternity'
    case LeaveType.PATERNITY:
      return 'Paternity'
    case LeaveType.BEREAVEMENT:
      return 'Bereavement'
    case LeaveType.UNPAID:
      return 'Unpaid'
    case LeaveType.OTHER:
      return 'Other'
    default:
      return 'Leave'
  }
}

export function CalendarGrid({
  calendarWeeks,
  currentMonth,
  selectedDate,
  onDateSelect,
  onRequestSelect,
  calendarVariant = 'default',
  eventVariant = 'default'
}: CalendarGridProps) {
  const renderEvent = (request: LeaveRequest, isPersonal: boolean = true, user?: UserType) => (
    <div
      key={request.id}
      className={cn(
        'text-xs p-1 rounded mb-1 cursor-pointer transition-colors hover:opacity-80',
        isPersonal ? 'text-white' : 'text-white',
        getLeaveTypeColor(request.leave_type as LeaveType),
        eventVariant === 'compact' ? 'text-xs p-1 rounded mb-1 cursor-pointer transition-colors hover:opacity-80' : '',
        eventVariant === 'compact-with-legend' ? 'text-xs p-1 rounded mb-1 cursor-pointer transition-colors hover:opacity-80' : '',
        eventVariant === 'circle' ? 'text-xs p-1 mb-1 cursor-pointer transition-colors hover:opacity-80 rounded-full h-4 w-4' : '',
        eventVariant === 'default' ? 'text-xs p-1 rounded mb-1 cursor-pointer transition-colors hover:opacity-80' : ''
      )}
      onClick={() => onRequestSelect(request)}
      title={`${isPersonal ? 'You' : user?.first_name} - ${getLeaveTypeLabel(request.leave_type as LeaveType)} - ${request.status}`}
    >
      <div className="flex items-center gap-1 justify-center">
        <div className={`w-2 h-2 rounded-full ${eventVariant === 'circle' ? '' : 'bg-white'}`} />
        {eventVariant === 'default' && <span className="truncate">
          <>
            {isPersonal ? 'You' : user?.first_name} - {getLeaveTypeLabel(request.leave_type as LeaveType)}
          </>
        </span>}
      </div>
    </div>
  )

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7">
        {calendarWeeks.flat().map((dayData, index) => {
          const isCurrentMonth = isSameMonth(dayData.date, currentMonth)
          const isSelected = selectedDate && isSameDay(dayData.date, selectedDate)
          const isTodayDate = isToday(dayData.date)
          const hasEvents = dayData.personalRequests.length > 0 || dayData.teamRequests.length > 0

          return (
            <div
              key={dayData.date.toISOString()}
              className={cn(
                `border-r border-b border-gray-200 dark:border-gray-700 p-2 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900 text-gray-400' : ''
                } ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''} ${isTodayDate ? 'ring-none bg-slate-200/50 dark:bg-slate-800/50' : ''
                }`,
                calendarVariant === 'compact' && 'p-2 ',
                calendarVariant === 'default' && 'min-h-[120px] p-3 text-sm font-medium text-gray-500 dark:text-gray-400'
              )}
              onClick={() => onDateSelect(dayData.date)}
            >
              {/* Date Number */}
              <div className={`text-sm font-medium mb-2 ${isTodayDate ? 'text-blue-600 dark:text-blue-400' : ''
                }`}>
                {format(dayData.date, 'd')}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {/* Personal Events */}
                {dayData.personalRequests.slice(0, 2).map(request =>
                  renderEvent(request, true)
                )}

                {/* Team Events */}
                {dayData.teamRequests.slice(0, 2).map(request =>
                  renderEvent(request, false, request.user)
                )}

                {/* More indicator */}
                {(dayData.personalRequests.length + dayData.teamRequests.length) > 4 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{(dayData.personalRequests.length + dayData.teamRequests.length) - 4} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 