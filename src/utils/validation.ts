// src/utils/validation.ts
import { parseISO, isValid } from 'date-fns'

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate task name
 */
export function validateTaskName(name: string): ValidationResult {
  const errors: string[] = []

  if (!name || name.trim().length === 0) {
    errors.push('Task name is required')
  }

  if (name.length > 100) {
    errors.push('Task name must be less than 100 characters')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate task dates
 */
export function validateTaskDates(
  plannedStart: string,
  plannedEnd: string,
  actualStart: string,
  actualEnd: string
): ValidationResult {
  const errors: string[] = []

  // Validate planned dates
  if (plannedStart && plannedEnd) {
    const start = parseISO(plannedStart)
    const end = parseISO(plannedEnd)

    if (!isValid(start)) {
      errors.push('Planned start date is invalid')
    }

    if (!isValid(end)) {
      errors.push('Planned end date is invalid')
    }

    if (isValid(start) && isValid(end) && start > end) {
      errors.push('Planned end date must be after start date')
    }
  }

  // Validate actual dates
  if (actualStart && actualEnd) {
    const start = parseISO(actualStart)
    const end = parseISO(actualEnd)

    if (!isValid(start)) {
      errors.push('Actual start date is invalid')
    }

    if (!isValid(end)) {
      errors.push('Actual end date is invalid')
    }

    if (isValid(start) && isValid(end) && start > end) {
      errors.push('Actual end date must be after start date')
    }
  }

  // Check if actual dates align with planned
  if (actualStart && plannedStart) {
    const actual = parseISO(actualStart)
    const planned = parseISO(plannedStart)

    if (isValid(actual) && isValid(planned) && actual < planned) {
      errors.push('Actual start date is before planned start date')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate chart name
 */
export function validateChartName(name: string): ValidationResult {
  const errors: string[] = []

  if (!name || name.trim().length === 0) {
    errors.push('Chart name is required')
  }

  if (name.length > 50) {
    errors.push('Chart name must be less than 50 characters')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate hex color
 */
export function validateHexColor(color: string): boolean {
  return /^#[0-9A-F]{6}$/i.test(color)
}

/**
 * Validate URL
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Validate file size (in bytes)
 */
export function validateFileSize(size: number, maxSize: number = 5 * 1024 * 1024): ValidationResult {
  const errors: string[] = []

  if (size > maxSize) {
    errors.push(`File size exceeds maximum of ${maxSize / 1024 / 1024}MB`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Sanitize string input
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
}

/**
 * Validate required field
 */
export function isRequired(value: any): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return value !== null && value !== undefined
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number
): ValidationResult {
  const errors: string[] = []
  const length = value.trim().length

  if (length < min) {
    errors.push(`Must be at least ${min} characters`)
  }

  if (length > max) {
    errors.push(`Must be less than ${max} characters`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Validate number range
 */
export function validateRange(
  value: number,
  min: number,
  max: number
): ValidationResult {
  const errors: string[] = []

  if (value < min) {
    errors.push(`Must be at least ${min}`)
  }

  if (value > max) {
    errors.push(`Must be at most ${max}`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
