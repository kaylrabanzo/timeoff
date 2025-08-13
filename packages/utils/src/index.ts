import { z } from 'zod'
import { 
  addDays, 
  differenceInDays, 
  isWeekend, 
  startOfDay, 
  endOfDay,
  format,
  parseISO,
  isValid
} from 'date-fns'
// Temporary types until workspace dependencies are properly configured
interface LeaveRequestForm {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  attachments?: File[];
}

interface ApprovalForm {
  requestId: string;
  approved: boolean;
  comment?: string;
}

interface LeaveRequestFilter {
  status?: string[];
  leaveType?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  userId?: string;
  departmentId?: string;
}

interface UserFilter {
  departmentId?: string;
  teamId?: string;
  role?: string[];
  isActive?: boolean;
}

// Validation Schemas
export const leaveRequestSchema = z.object({
  leaveType: z.enum(['vacation', 'sick', 'personal', 'maternity', 'paternity', 'bereavement', 'unpaid', 'other']),
  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "End date must be a valid date",
  }),
  reason: z.string().optional(),
  attachments: z.array(z.instanceof(File)).optional(),
}).refine((data) => {
  return data.startDate <= data.endDate
}, {
  message: "End date must be after start date",
  path: ["endDate"],
})

export const approvalSchema = z.object({
  requestId: z.string().min(1, "Request ID is required"),
  approved: z.boolean(),
  comment: z.string().optional(),
})

export const userProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  team: z.string().min(1, "Team is required"),
  role: z.enum(['employee', 'supervisor', 'admin', 'hr']),
  managerId: z.string().optional(),
})

// Date Utilities
export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let workingDays = 0
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    if (!isWeekend(currentDate)) {
      workingDays++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return workingDays
}

export function calculateTotalDays(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate) + 1
}

export function isDateInRange(date: Date, startDate: Date, endDate: Date): boolean {
  return date >= startDate && date <= endDate
}

export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  return dates
}

export function formatDateForDisplay(date: Date): string {
  return format(date, 'MMM dd, yyyy')
}

export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseDateFromInput(dateString: string): Date {
  const parsed = parseISO(dateString)
  if (!isValid(parsed)) {
    throw new Error('Invalid date format')
  }
  return parsed
}

// Leave Request Utilities
export function validateLeaveRequest(form: LeaveRequestForm): string[] {
  const errors: string[] = []
  
  if (!form.startDate || !form.endDate) {
    errors.push('Start and end dates are required')
  }
  
  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    errors.push('End date must be after start date')
  }
  
  if (form.startDate && form.startDate < new Date()) {
    errors.push('Start date cannot be in the past')
  }
  
  return errors
}

export function calculateLeaveDuration(startDate: Date, endDate: Date): {
  totalDays: number
  workingDays: number
  weekends: number
} {
  const totalDays = calculateTotalDays(startDate, endDate)
  const workingDays = calculateWorkingDays(startDate, endDate)
  const weekends = totalDays - workingDays
  
  return {
    totalDays,
    workingDays,
    weekends
  }
}

// Filter Utilities
export function buildLeaveRequestFilter(filter: LeaveRequestFilter): Record<string, any> {
  const query: Record<string, any> = {}
  
  if (filter.status && filter.status.length > 0) {
    query.status = { $in: filter.status }
  }
  
  if (filter.leaveType && filter.leaveType.length > 0) {
    query.leaveType = { $in: filter.leaveType }
  }
  
  if (filter.dateRange) {
    query.startDate = { $gte: filter.dateRange.start }
    query.endDate = { $lte: filter.dateRange.end }
  }
  
  if (filter.userId) {
    query.userId = filter.userId
  }
  
  if (filter.departmentId) {
    query.departmentId = filter.departmentId
  }
  
  return query
}

export function buildUserFilter(filter: UserFilter): Record<string, any> {
  const query: Record<string, any> = {}
  
  if (filter.departmentId) {
    query.departmentId = filter.departmentId
  }
  
  if (filter.teamId) {
    query.teamId = filter.teamId
  }
  
  if (filter.role && filter.role.length > 0) {
    query.role = { $in: filter.role }
  }
  
  if (filter.isActive !== undefined) {
    query.isActive = filter.isActive
  }
  
  return query
}

// Permission Utilities
export function canApproveRequest(userRole: string, requestUserId: string, currentUserId: string): boolean {
  if (userRole === 'admin' || userRole === 'hr') {
    return true
  }
  
  if (userRole === 'supervisor') {
    // Check if the current user is the manager of the request user
    // This would need to be implemented based on your user hierarchy
    return true // Placeholder
  }
  
  return false
}

export function canViewRequest(userRole: string, requestUserId: string, currentUserId: string): boolean {
  if (userRole === 'admin' || userRole === 'hr') {
    return true
  }
  
  if (userRole === 'supervisor') {
    return true // Placeholder - would check if user is in supervisor's team
  }
  
  return requestUserId === currentUserId
}

// Notification Utilities
export function generateNotificationMessage(
  type: string,
  requestId: string,
  userName: string,
  leaveType: string,
  startDate: Date,
  endDate: Date
): string {
  const dateRange = `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`
  
  switch (type) {
    case 'request_approved':
      return `Your ${leaveType} leave request for ${dateRange} has been approved.`
    case 'request_rejected':
      return `Your ${leaveType} leave request for ${dateRange} has been rejected.`
    case 'request_pending':
      return `${userName} has submitted a ${leaveType} leave request for ${dateRange}.`
    default:
      return `Notification regarding leave request ${requestId}.`
  }
}

// Export all schemas and utilities 