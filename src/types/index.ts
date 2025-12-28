// src/types/index.ts

export interface User {
  id: string
  name: string
  email: string
  imageUrl: string
}

export interface Task {
  id: string
  name: string
  description: string
  planned: [string, string]
  actual: [string, string]
  subtasks: Task[]
  collapsed: boolean
  color: string | null
}

export interface GanttChart {
  id: string
  name: string
  tasks: Task[]
  settings: Settings
}

export interface ChartData {
  charts: GanttChart[]
  activeChartId: string | null
}

export interface Settings {
  dateFormat: string
  colorScheme: string
  expandAll: boolean
  rowHeight: number
  columnWidth: number
}

export interface CurrentFile {
  id: string | null
  name: string
  modified: boolean
}

export interface GoogleDriveFile {
  id: string
  name: string
  mimeType: string
  modifiedTime?: string
  iconLink?: string
}

export interface TaskUpdateData {
  name?: string
  description?: string
  planned?: [string, string]
  actual?: [string, string]
  color?: string | null
}

export type DateRange = {
  start: Date
  end: Date
  days: number
}

export type TimelineColumn = {
  date: string
  label: string
  isWeekend: boolean
}

export type TaskPosition = {
  left: string
  width: string
}

export interface LegacyChartData {
  name?: string
  tasks: Task[]
}

export type AdProvider = 'carbon' | 'support'
