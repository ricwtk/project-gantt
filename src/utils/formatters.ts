// src/utils/formatters.ts

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength - 3) + '...'
}

/**
 * Format number with thousands separator
 */
export function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Format duration in days
 */
export function formatDuration(days: number): string {
  if (days === 0) return '0 days'
  if (days === 1) return '1 day'
  if (days < 7) return `${days} days`

  const weeks = Math.floor(days / 7)
  const remainingDays = days % 7

  if (weeks === 1 && remainingDays === 0) return '1 week'
  if (weeks > 1 && remainingDays === 0) return `${weeks} weeks`
  if (weeks === 1) return `1 week ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`

  return `${weeks} weeks ${remainingDays} ${remainingDays === 1 ? 'day' : 'days'}`
}

/**
 * Pluralize a word based on count
 */
export function pluralize(word: string, count: number): string {
  if (count === 1) return word

  // Handle common irregular plurals
  const irregulars: Record<string, string> = {
    'child': 'children',
    'person': 'people',
    'man': 'men',
    'woman': 'women',
    'tooth': 'teeth',
    'foot': 'feet',
    'mouse': 'mice',
    'goose': 'geese',
  }

  if (irregulars[word.toLowerCase()]) {
    return irregulars[word.toLowerCase()] as string
  }

  // Regular pluralization rules
  if (word.endsWith('y') && !['a', 'e', 'i', 'o', 'u'].includes(word[word.length - 2] as string)) {
    return word.slice(0, -1) + 'ies'
  }

  if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z') ||
      word.endsWith('ch') || word.endsWith('sh')) {
    return word + 'es'
  }

  return word + 's'
}

/**
 * Format count with word
 */
export function formatCount(count: number, word: string): string {
  return `${count} ${pluralize(word, count)}`
}

/**
 * Convert camelCase to Title Case
 */
export function camelToTitle(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim()
}

/**
 * Convert snake_case to Title Case
 */
export function snakeToTitle(str: string): string {
  return str
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

/**
 * Format initials from name
 */
export function getInitials(name: string, maxLength: number = 2): string {
  if (!name) return ''

  const words = name.trim().split(/\s+/)
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, maxLength)

  return initials
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  return phone
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Format currency
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Slugify string (URL-friendly)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Generate random ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 9)
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`
}

/**
 * Format list with commas and "and"
 */
export function formatList(items: string[]): string {
  if (items.length === 0) return ''
  if (items.length === 1) return items[0] as string
  if (items.length === 2) return `${items[0]} and ${items[1]}`

  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}
