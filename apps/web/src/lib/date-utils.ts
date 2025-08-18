import { differenceInDays, startOfDay } from 'date-fns'

/**
 * Calculate the total number of days between two dates (inclusive)
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The total number of days including both start and end dates
 */
export function calculateTotalDays(startDate: Date, endDate: Date): number {
  // Create new Date objects to avoid mutating the input parameters
  const start = startOfDay(new Date(startDate))
  const end = startOfDay(new Date(endDate))

  // Add 1 to include both start and end dates (inclusive range)
  return differenceInDays(end, start) + 1
}
