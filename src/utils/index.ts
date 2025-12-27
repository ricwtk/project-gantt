// src/utils/index.ts
// Central export point for all utility functions

export * from './dateHelpers'
export * from './colorSchemes'
export * from './fileHelpers'
export * from './validation'
export * from './formatters'

// Re-export common functions for convenience
export {
  formatDate,
  formatDateRange,
  getToday,
  getDaysBetween,
} from './dateHelpers'

export {
  getColorFromScheme,
  getColorScheme,
  lightenColor,
  darkenColor,
  isLightColor,
  getContrastColor,
} from './colorSchemes'

export {
  downloadJSON,
  readJSONFile,
  formatFileSize,
  exportToCSV,
  downloadCSV,
} from './fileHelpers'

export {
  validateTaskName,
  validateTaskDates,
  validateChartName,
  validateEmail,
  validateHexColor,
} from './validation'

export {
  capitalize,
  truncate,
  formatNumber,
  formatPercentage,
  formatDuration,
  pluralize,
  formatCount,
  getInitials,
  slugify,
  generateId,
} from './formatters'
