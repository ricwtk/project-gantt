// src/utils/fileHelpers.ts
import type { ChartData } from '@/types'

/**
 * Download data as a JSON file
 */
export function downloadJSON(
  data: ChartData,
  filename: string
): void {
  const dataStr = JSON.stringify(data, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.pgjson') ? filename : `${filename}.pgjson`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Read a JSON file from input
 */
export function readJSONFile(file: File): Promise<ChartData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string)
        resolve(content)
      } catch (error) {
        reject(new Error('Invalid JSON format'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Error reading file'))
    }

    reader.readAsText(file)
  })
}

/**
 * Validate file type
 */
export function isValidProjectFile(file: File): boolean {
  return (
    file.name.endsWith('.pgjson') ||
    file.type === 'application/json' ||
    file.type === 'application/vnd.project-gantt'
  )
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2)
}

/**
 * Remove file extension
 */
export function removeFileExtension(filename: string): string {
  return filename.replace(/\.[^/.]+$/, '')
}

/**
 * Sanitize filename (remove invalid characters)
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/^\.+/, '') // Remove leading dots
    .trim()
}

/**
 * Generate unique filename if file exists
 */
export function generateUniqueFilename(
  baseName: string,
  existingNames: string[]
): string {
  let filename = baseName
  let counter = 1

  while (existingNames.includes(filename)) {
    const ext = getFileExtension(baseName)
    const name = removeFileExtension(baseName)
    filename = ext ? `${name} (${counter}).${ext}` : `${name} (${counter})`
    counter++
  }

  return filename
}

/**
 * Export chart data as CSV
 */
export function exportToCSV(data: ChartData): string {
  const headers = [
    'Chart Name',
    'Task Name',
    'Description',
    'Planned Start',
    'Planned End',
    'Actual Start',
    'Actual End',
    'Color',
  ]

  const rows: string[][] = []

  // Flatten all tasks from all charts
  data.charts.forEach(chart => {
    const flattenTasks = (tasks: any[], chartName: string) => {
      tasks.forEach(task => {
        rows.push([
          chartName,
          task.name,
          task.description || '',
          task.planned[0] || '',
          task.planned[1] || '',
          task.actual[0] || '',
          task.actual[1] || '',
          task.color || '',
        ])

        if (task.subtasks && task.subtasks.length > 0) {
          flattenTasks(task.subtasks, chartName)
        }
      })
    }

    flattenTasks(chart.tasks, chart.name)
  })

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  return csvContent
}

/**
 * Download CSV file
 */
export function downloadCSV(data: ChartData, filename: string): void {
  const csvContent = exportToCSV(data)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Share file using Web Share API (if available)
 */
export async function shareFile(
  data: ChartData,
  filename: string
): Promise<boolean> {
  if (!navigator.share) {
    console.warn('Web Share API not supported')
    return false
  }

  try {
    const dataStr = JSON.stringify(data, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const file = new File([blob], filename, { type: 'application/json' })

    await navigator.share({
      files: [file],
      title: 'Project Gantt Chart',
      text: 'Sharing Gantt chart project file',
    })

    return true
  } catch (error) {
    console.error('Error sharing file:', error)
    return false
  }
}

/**
 * Validate JSON structure for project file
 */
export function isValidProjectData(data: any): boolean {
  // Check if it has the new format (charts array)
  if (data.charts && Array.isArray(data.charts)) {
    return data.charts.every((chart: any) =>
      chart.id &&
      chart.name &&
      Array.isArray(chart.tasks)
    )
  }

  // Check if it has the legacy format (tasks array)
  if (data.tasks && Array.isArray(data.tasks)) {
    return true
  }

  return false
}
