// src/stores/gantt.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { format } from 'date-fns'
import type {
  CurrentFile,
  ChartData,
  Settings,
  GanttChart,
  Task,
  TaskUpdateData,
  LegacyChartData
} from '@/types'

export const useGanttStore = defineStore('gantt', () => {
  const currentFile = ref<CurrentFile>({
    id: null,
    name: 'Untitled Project',
    modified: false,
  })

  const chartData = ref<ChartData>({
    charts: [
      {
        id: generateId(),
        name: 'Project Gantt Chart',
        tasks: [],
      }
    ],
    activeChartId: null,
  })

  const settings = ref<Settings>({
    dateFormat: 'yyyy-MM-dd',
    colorScheme: 'Set3',
    expandAll: false,
  })

  // Initialize active chart
  if (chartData.value.charts.length > 0 && !chartData.value.activeChartId) {
    chartData.value.activeChartId = chartData.value.charts[0]!.id
  }

  const activeChart = computed<GanttChart>(() => {
    return chartData.value.charts.find(c => c.id === chartData.value.activeChartId)
      || chartData.value.charts[0]
  })

  const tasks = computed<Task[]>(() => activeChart.value?.tasks || [])

  const allCharts = computed<GanttChart[]>(() => chartData.value.charts)

  function setActiveChart(chartId: string): void {
    chartData.value.activeChartId = chartId
  }

  function addChart(name: string = 'New Gantt Chart'): GanttChart {
    const newChart: GanttChart = {
      id: generateId(),
      name: name || 'New Gantt Chart',
      tasks: [],
    }
    chartData.value.charts.push(newChart)
    chartData.value.activeChartId = newChart.id
    markModified()
    return newChart
  }

  function updateChartName(chartId: string, name: string): void {
    const chart = chartData.value.charts.find(c => c.id === chartId)
    if (chart) {
      chart.name = name
      markModified()
    }
  }

  function deleteChart(chartId: string): void {
    const index = chartData.value.charts.findIndex(c => c.id === chartId)
    if (index !== -1) {
      chartData.value.charts.splice(index, 1)

      // Set active chart to first available if deleted chart was active
      if (chartData.value.activeChartId === chartId && chartData.value.charts.length > 0) {
        chartData.value.activeChartId = chartData.value.charts[0]!.id
      }

      markModified()
    }
  }

  function duplicateChart(chartId: string): GanttChart | undefined {
    const chart = chartData.value.charts.find(c => c.id === chartId)
    if (chart) {
      const duplicated: GanttChart = {
        ...JSON.parse(JSON.stringify(chart)), // Deep clone
        id: generateId(),
        name: `${chart.name} (Copy)`,
      }

      // Generate new IDs for all tasks
      const reassignIds = (tasks: Task[]): Task[] => {
        return tasks.map(task => ({
          ...task,
          id: generateId(),
          subtasks: task.subtasks ? reassignIds(task.subtasks) : []
        }))
      }

      duplicated.tasks = reassignIds(duplicated.tasks)
      chartData.value.charts.push(duplicated)
      chartData.value.activeChartId = duplicated.id
      markModified()
      return duplicated
    }
  }

  function addTask(parentId: string | null = null): void {
    const newTask: Task = {
      id: generateId(),
      name: 'New Task',
      description: '',
      planned: [format(new Date(), 'yyyy-MM-dd'), format(new Date(), 'yyyy-MM-dd')],
      actual: ['', ''],
      subtasks: [],
      collapsed: false,
      color: null,
    }

    if (parentId) {
      const parent = findTask(parentId)
      if (parent) {
        parent.subtasks.push(newTask)
      }
    } else {
      activeChart.value.tasks.push(newTask)
    }

    markModified()
  }

  function updateTask(taskId: string, updates: TaskUpdateData): void {
    const task = findTask(taskId)
    if (task) {
      Object.assign(task, updates)
      markModified()
    }
  }

  function deleteTask(taskId: string): void {
    const deleteRecursive = (tasks: Task[], id: string): boolean => {
      const index = tasks.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.splice(index, 1)
        return true
      }

      for (const task of tasks) {
        if (task.subtasks && deleteRecursive(task.subtasks, id)) {
          return true
        }
      }
      return false
    }

    deleteRecursive(activeChart.value.tasks, taskId)
    markModified()
  }

  function findTask(taskId: string, tasks: Task[] = activeChart.value.tasks): Task | null {
    for (const task of tasks) {
      if (task.id === taskId) return task
      if (task.subtasks) {
        const found = findTask(taskId, task.subtasks)
        if (found) return found
      }
    }
    return null
  }

  function generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function setCurrentFile(file: Partial<CurrentFile>): void {
    currentFile.value = { ...currentFile.value, ...file }
  }

  function loadChartData(data: ChartData | LegacyChartData): void {
    // Handle legacy format (single chart)
    if ('tasks' in data && !('charts' in data)) {
      chartData.value = {
        charts: [
          {
            id: generateId(),
            name: data.name || 'Project Gantt Chart',
            tasks: data.tasks || [],
          }
        ],
        activeChartId: null,
      }
      chartData.value.activeChartId = chartData.value.charts[0].id
    } else {
      // New format (multiple charts)
      chartData.value = data as ChartData

      // Ensure all charts have IDs
      chartData.value.charts = chartData.value.charts.map(chart => ({
        ...chart,
        id: chart.id || generateId(),
      }))

      // Set active chart
      if (!chartData.value.activeChartId && chartData.value.charts.length > 0) {
        chartData.value.activeChartId = chartData.value.charts[0].id
      }
    }

    currentFile.value.modified = false
  }

  function markModified(): void {
    currentFile.value.modified = true
  }

  function resetChart(): void {
    chartData.value = {
      charts: [
        {
          id: generateId(),
          name: 'Project Gantt Chart',
          tasks: [],
        }
      ],
      activeChartId: null,
    }
    chartData.value.activeChartId = chartData.value.charts[0].id

    currentFile.value = {
      id: null,
      name: 'Untitled Project',
      modified: false,
    }
  }

  function updateSettings(newSettings: Partial<Settings>): void {
    settings.value = { ...settings.value, ...newSettings }
  }

  return {
    currentFile,
    chartData,
    settings,
    tasks,
    activeChart,
    allCharts,
    setActiveChart,
    addChart,
    updateChartName,
    deleteChart,
    duplicateChart,
    addTask,
    updateTask,
    deleteTask,
    findTask,
    setCurrentFile,
    loadChartData,
    markModified,
    resetChart,
    updateSettings,
  }
})
