// src/composables/useGanttChart.ts
import { computed, ref } from 'vue'
import { parseISO, differenceInDays, addDays, format, startOfMonth, endOfMonth, isWeekend } from 'date-fns'
import type { Task, DateRange, TimelineColumn, TaskPosition } from '@/types'

/**
 * Composable for Gantt chart calculations and utilities
 * Separates chart-specific logic from components and stores
 */
export function useGanttChart() {

  /**
   * Flatten nested task hierarchy into a single array
   */
  const flattenTasks = (tasks: Task[], result: Task[] = []): Task[] => {
    tasks.forEach(task => {
      result.push(task)
      if (task.subtasks && task.subtasks.length > 0) {
        flattenTasks(task.subtasks, result)
      }
    })
    return result
  }

  /**
   * Calculate the date range covered by all tasks
   */
  const calculateDateRange = (tasks: Task[]): DateRange => {
    const flatTasks = flattenTasks(tasks)
    const dates: Date[] = []

    flatTasks.forEach(task => {
      if (task.planned[0]) dates.push(parseISO(task.planned[0]))
      if (task.planned[1]) dates.push(parseISO(task.planned[1]))
      if (task.actual[0]) dates.push(parseISO(task.actual[0]))
      if (task.actual[1]) dates.push(parseISO(task.actual[1]))
    })

    if (dates.length === 0) {
      const today = new Date()
      return {
        start: startOfMonth(today),
        end: endOfMonth(today),
        days: 30,
      }
    }

    const minDate = new Date(Math.min(...dates.map(d => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())))

    const start = startOfMonth(minDate)
    const end = endOfMonth(maxDate)
    const days = differenceInDays(end, start) + 1

    return { start, end, days }
  }

  /**
   * Generate timeline columns for the date range
   */
  const generateTimelineColumns = (dateRange: DateRange): TimelineColumn[] => {
    const columns: TimelineColumn[] = []
    let currentDate = dateRange.start

    for (let i = 0; i < dateRange.days; i++) {
      columns.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        label: format(currentDate, 'MMM dd'),
        isWeekend: isWeekend(currentDate),
      })
      currentDate = addDays(currentDate, 1)
    }

    return columns
  }

  /**
   * Calculate task position on timeline (planned dates)
   */
  const getTaskPosition = (task: Task, dateRange: DateRange): TaskPosition | null => {
    if (!task.planned[0] || !task.planned[1]) return null

    const startDate = parseISO(task.planned[0])
    const endDate = parseISO(task.planned[1])

    const startDay = differenceInDays(startDate, dateRange.start)
    const duration = differenceInDays(endDate, startDate) + 1

    const left = (startDay / dateRange.days) * 100
    const width = (duration / dateRange.days) * 100

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - left, width)}%`
    }
  }

  /**
   * Calculate actual progress position on timeline
   */
  const getActualPosition = (task: Task, dateRange: DateRange): TaskPosition | null => {
    if (!task.actual[0]) return null

    const startDate = parseISO(task.actual[0])
    const endDate = task.actual[1] ? parseISO(task.actual[1]) : new Date()

    const startDay = differenceInDays(startDate, dateRange.start)
    const duration = differenceInDays(endDate, startDate) + 1

    const left = (startDay / dateRange.days) * 100
    const width = (duration / dateRange.days) * 100

    return {
      left: `${Math.max(0, left)}%`,
      width: `${Math.min(100 - left, width)}%`
    }
  }

  /**
   * Calculate task completion percentage
   */
  const getTaskProgress = (task: Task): number => {
    if (!task.actual[0]) return 0
    if (!task.actual[1]) return 50 // In progress

    const plannedStart = task.planned[0] ? parseISO(task.planned[0]) : null
    const plannedEnd = task.planned[1] ? parseISO(task.planned[1]) : null
    const actualEnd = parseISO(task.actual[1])

    if (!plannedEnd) return 100

    // Check if completed on time
    if (actualEnd <= plannedEnd) return 100

    // Calculate delay percentage
    const totalDays = plannedEnd && plannedStart ? differenceInDays(plannedEnd, plannedStart) : 0
    const delayDays = differenceInDays(actualEnd, plannedEnd)

    return Math.max(0, 100 - (delayDays / totalDays) * 100)
  }

  /**
   * Check if task is overdue
   */
  const isTaskOverdue = (task: Task): boolean => {
    if (!task.planned[1]) return false
    if (task.actual[1]) return false // Already completed

    const plannedEnd = parseISO(task.planned[1])
    const today = new Date()

    return today > plannedEnd
  }

  /**
   * Check if task is in progress
   */
  const isTaskInProgress = (task: Task): boolean => {
    return !!task.actual[0] && !task.actual[1]
  }

  /**
   * Check if task is completed
   */
  const isTaskCompleted = (task: Task): boolean => {
    return !!task.actual[0] && !!task.actual[1]
  }

  /**
   * Get task status
   */
  const getTaskStatus = (task: Task): 'planned' | 'in-progress' | 'completed' | 'overdue' => {
    if (isTaskCompleted(task)) return 'completed'
    if (isTaskOverdue(task)) return 'overdue'
    if (isTaskInProgress(task)) return 'in-progress'
    return 'planned'
  }

  /**
   * Calculate total duration of task including subtasks
   */
  const getTotalDuration = (task: Task): number => {
    if (!task.planned[0] || !task.planned[1]) return 0

    const start = parseISO(task.planned[0])
    const end = parseISO(task.planned[1])

    return differenceInDays(end, start) + 1
  }

  /**
   * Get task depth in hierarchy
   */
  const getTaskDepth = (tasks: Task[], taskId: string, depth: number = 0): number => {
    for (const task of tasks) {
      if (task.id === taskId) return depth
      if (task.subtasks) {
        const found = getTaskDepth(task.subtasks, taskId, depth + 1)
        if (found > -1) return found
      }
    }
    return -1
  }

  /**
   * Count total tasks including subtasks
   */
  const countTotalTasks = (tasks: Task[]): number => {
    return flattenTasks(tasks).length
  }

  /**
   * Count completed tasks
   */
  const countCompletedTasks = (tasks: Task[]): number => {
    return flattenTasks(tasks).filter(isTaskCompleted).length
  }

  /**
   * Calculate overall project progress
   */
  const calculateProjectProgress = (tasks: Task[]): number => {
    const total = countTotalTasks(tasks)
    if (total === 0) return 0

    const completed = countCompletedTasks(tasks)
    return Math.round((completed / total) * 100)
  }

  /**
   * Get all tasks with a specific status
   */
  const getTasksByStatus = (
    tasks: Task[],
    status: 'planned' | 'in-progress' | 'completed' | 'overdue'
  ): Task[] => {
    return flattenTasks(tasks).filter(task => getTaskStatus(task) === status)
  }

  /**
   * Validate task dates
   */
  const validateTaskDates = (planned: [string, string], actual: [string, string]): {
    valid: boolean
    errors: string[]
  } => {
    const errors: string[] = []

    // Check planned dates
    if (planned[0] && planned[1]) {
      const start = parseISO(planned[0])
      const end = parseISO(planned[1])
      if (start > end) {
        errors.push('Planned end date must be after start date')
      }
    }

    // Check actual dates
    if (actual[0] && actual[1]) {
      const start = parseISO(actual[0])
      const end = parseISO(actual[1])
      if (start > end) {
        errors.push('Actual end date must be after start date')
      }
    }

    // Check actual vs planned
    if (actual[0] && planned[0]) {
      const actualStart = parseISO(actual[0])
      const plannedStart = parseISO(planned[0])
      if (actualStart < plannedStart) {
        errors.push('Actual start date is before planned start date')
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  /**
   * Export timeline data as CSV
   */
  const exportToCSV = (tasks: Task[]): string => {
    const flatTasks = flattenTasks(tasks)
    const headers = ['Task Name', 'Description', 'Planned Start', 'Planned End', 'Actual Start', 'Actual End', 'Status']

    const rows = flatTasks.map(task => [
      task.name,
      task.description,
      task.planned[0] || '',
      task.planned[1] || '',
      task.actual[0] || '',
      task.actual[1] || '',
      getTaskStatus(task)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    return csvContent
  }

  return {
    // Task utilities
    flattenTasks,
    getTaskDepth,
    countTotalTasks,
    countCompletedTasks,

    // Date calculations
    calculateDateRange,
    generateTimelineColumns,
    getTotalDuration,

    // Position calculations
    getTaskPosition,
    getActualPosition,

    // Status utilities
    getTaskStatus,
    getTaskProgress,
    isTaskOverdue,
    isTaskInProgress,
    isTaskCompleted,
    getTasksByStatus,

    // Project analytics
    calculateProjectProgress,

    // Validation
    validateTaskDates,

    // Export
    exportToCSV,
  }
}
