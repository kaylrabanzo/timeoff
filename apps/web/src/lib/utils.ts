import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, differenceInDays } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date formatting utilities
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.toDateString() === endDate.toDateString()) {
    return format(startDate, 'MMM dd, yyyy')
  }
  return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`
}

export function calculateDays(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate) + 1
}

// Color utilities for leave types
export function getLeaveTypeColor(type: string): string {
  const colors: Record<string, string> = {
    vacation: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    sick: 'bg-red-100 text-red-800 hover:bg-red-200',
    personal: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    maternity: 'bg-pink-100 text-pink-800 hover:bg-pink-200',
    paternity: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
    bereavement: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    unpaid: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    other: 'bg-green-100 text-green-800 hover:bg-green-200'
  }
  return colors[type] || 'bg-gray-100 text-gray-800 hover:bg-gray-200'
}

// Color utilities for request status
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    pending: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    approved: 'bg-green-100 text-green-800 hover:bg-green-200',
    rejected: 'bg-red-100 text-red-800 hover:bg-red-200',
    cancelled: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  }
  return colors[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200'
}
