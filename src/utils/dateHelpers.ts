// src/utils/dateHelpers.ts
import { format as dateFnsFormat, parseISO, isValid, differenceInDays, addDays } from 'date-fns'

/**
 * Format a date string according to the specified format
 */
export function formatDate(dateString: string, formatStr: string = 'yyyy-MM-dd'): string {
  if (!dateString) return ''

  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString
    return dateFnsFormat(date, formatStr)
  } catch (error) {
    console.error('Error formatting date:', error)
    return dateString
  }
}

/**
 * Format a date range as a string
 */
export function formatDateRange(
  startDate: string,
  endDate: string,
  formatStr: string = 'yyyy-MM-dd'
): string {
  if (!startDate && !endDate) return 'Not set'
  if (!endDate) return formatDate(startDate, formatStr)

  return `${formatDate(startDate, formatStr)} - ${formatDate(endDate, formatStr)}`
}

/**
 * Get today's date as a string
 */
export function getToday(formatStr: string = 'yyyy-MM-dd'): string {
  return dateFnsFormat(new Date(), formatStr)
}

/**
 * Calculate number of days between two dates
 */
export function getDaysBetween(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0

  try {
    const start = parseISO(startDate)
    const end = parseISO(endDate)

    if (!isValid(start) || !isValid(end)) return 0

    return differenceInDays(end, start)
  } catch (error) {
    console.error('Error calculating days between:', error)
    return 0
  }
}

/**
 * Add days to a date string
 */
export function addDaysToDate(dateString: string, days: number): string {
  if (!dateString) return ''

  try {
    const date = parseISO(dateString)
    if (!isValid(date)) return dateString

    const newDate = addDays(date, days)
    return dateFnsFormat(newDate, 'yyyy-MM-dd')
  } catch (error) {
    console.error('Error adding days:', error)
    return dateString
  }
}

/**
 * Check if a date string is valid
 */
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false

  try {
    const date = parseISO(dateString)
    return isValid(date)
  } catch (error) {
    return false
  }
}

/**
 * Compare two dates
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export function compareDates(date1: string, date2: string): number {
  if (!date1 || !date2) return 0

  try {
    const d1 = parseISO(date1)
    const d2 = parseISO(date2)

    if (!isValid(d1) || !isValid(d2)) return 0

    if (d1 < d2) return -1
    if (d1 > d2) return 1
    return 0
  } catch (error) {
    return 0
  }
}

/**
 * Check if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  if (!dateString) return false

  try {
    const date = parseISO(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date < today
  } catch (error) {
    return false
  }
}

/**
 * Check if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  if (!dateString) return false

  try {
    const date = parseISO(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date > today
  } catch (error) {
    return false
  }
}

/**
 * Get relative date string (e.g., "2 days ago", "in 3 days")
 */
export function getRelativeDate(dateString: string): string {
  if (!dateString) return ''

  try {
    const date = parseISO(dateString)
    const today = new Date()
    const days = differenceInDays(date, today)

    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    if (days === -1) return 'Yesterday'
    if (days > 1) return `In ${days} days`
    if (days < -1) return `${Math.abs(days)} days ago`

    return formatDate(dateString)
  } catch (error) {
    return dateString
  }
}
