# 🏗️ Composables vs Stores - Architecture Guide

## Overview

Understanding when to use **composables** vs **stores** is key to maintaining clean architecture.

## 📦 Pinia Store (`useGanttStore`)

**Purpose:** Global state management and business logic

### What Belongs in the Store:
- ✅ Application state (charts, tasks, current file)
- ✅ Data mutations (add, update, delete)
- ✅ State persistence logic
- ✅ Cross-component shared state
- ✅ Business rules and validation

### Example:
```typescript
// src/stores/gantt.ts
export const useGanttStore = defineStore('gantt', () => {
  // STATE
  const chartData = ref<ChartData>({ ... })
  const currentFile = ref<CurrentFile>({ ... })
  
  // MUTATIONS
  function addChart(name: string): void { ... }
  function updateTask(taskId: string, updates: TaskUpdateData): void { ... }
  
  // BUSINESS LOGIC
  function loadChartData(data: ChartData): void { ... }
  
  return { chartData, currentFile, addChart, updateTask, loadChartData }
})
```

## 🔧 Composable (`useGanttChart`)

**Purpose:** Reusable utilities and calculations (stateless helpers)

### What Belongs in Composables:
- ✅ Pure functions (no side effects)
- ✅ Calculations and transformations
- ✅ UI-specific logic
- ✅ Reusable utilities
- ✅ No global state

### Example:
```typescript
// src/composables/useGanttChart.ts
export function useGanttChart() {
  // PURE CALCULATIONS
  const calculateDateRange = (tasks: Task[]): DateRange => { ... }
  const getTaskPosition = (task: Task, range: DateRange): TaskPosition => { ... }
  
  // UTILITIES
  const flattenTasks = (tasks: Task[]): Task[] => { ... }
  const exportToCSV = (tasks: Task[]): string => { ... }
  
  return { calculateDateRange, getTaskPosition, flattenTasks, exportToCSV }
}
```

## 🎯 Quick Decision Tree

```
Need to store data? 
├─ YES → Use Store
└─ NO → Need to transform/calculate data?
    ├─ YES → Use Composable
    └─ NO → Just use regular functions
```

## 📊 Comparison Table

| Feature | Store (Pinia) | Composable |
|---------|---------------|------------|
| **Purpose** | State management | Utilities/helpers |
| **State** | ✅ Has reactive state | ❌ Stateless |
| **Shared** | ✅ Globally shared | ❌ Per-component |
| **Side Effects** | ✅ Can mutate state | ❌ Pure functions |
| **Persistence** | ✅ Can persist | ❌ No persistence |
| **Reusability** | ✅ Across app | ✅ Across app |

## 🎨 Usage Examples

### Scenario 1: Creating a Task

**Store (handles state mutation):**
```typescript
// Component
import { useGanttStore } from '@/stores/gantt'

const ganttStore = useGanttStore()

const handleAddTask = () => {
  ganttStore.addTask() // Modifies state
}
```

### Scenario 2: Calculating Timeline

**Composable (pure calculation):**
```typescript
// Component
import { useGanttChart } from '@/composables/useGanttChart'
import { useGanttStore } from '@/stores/gantt'

const { calculateDateRange, generateTimelineColumns } = useGanttChart()
const ganttStore = useGanttStore()

// Read state from store, calculate with composable
const dateRange = calculateDateRange(ganttStore.tasks)
const columns = generateTimelineColumns(dateRange)
```

### Scenario 3: Task Status Badge

**Composable (UI utility):**
```vue
<script setup lang="ts">
import { useGanttChart } from '@/composables/useGanttChart'
import type { Task } from '@/types'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const { getTaskStatus, isTaskOverdue } = useGanttChart()

const status = computed(() => getTaskStatus(props.task))
const overdue = computed(() => isTaskOverdue(props.task))
</script>

<template>
  <span 
    :class="{
      'bg-green-500': status === 'completed',
      'bg-blue-500': status === 'in-progress',
      'bg-red-500': status === 'overdue',
      'bg-gray-500': status === 'planned'
    }"
  >
    {{ status }}
  </span>
</template>
```

## 🏛️ Architecture Principles

### Store Responsibilities:
1. **CRUD operations** - Create, Read, Update, Delete
2. **State management** - Maintain global state
3. **Business logic** - Enforce rules and validation
4. **Integration** - Coordinate with APIs (Google Drive)

### Composable Responsibilities:
1. **Calculations** - Pure mathematical operations
2. **Transformations** - Data format conversions
3. **Utilities** - Reusable helper functions
4. **UI helpers** - View-specific calculations

## 🔄 Data Flow

```
┌─────────────┐
│  Component  │
└──────┬──────┘
       │
       ├──> Store (for state changes)
       │     └── chartData, tasks, settings
       │
       └──> Composable (for calculations)
             └── calculate, transform, validate
```

## 💡 Real-World Examples

### Example 1: Timeline Component

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useGanttStore } from '@/stores/gantt'
import { useGanttChart } from '@/composables/useGanttChart'

// Get data from store
const ganttStore = useGanttStore()

// Use composable for calculations
const { 
  calculateDateRange, 
  generateTimelineColumns,
  getTaskPosition 
} = useGanttChart()

// Computed values using both
const dateRange = computed(() => calculateDateRange(ganttStore.tasks))
const columns = computed(() => generateTimelineColumns(dateRange.value))
</script>
```

### Example 2: Progress Dashboard

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useGanttStore } from '@/stores/gantt'
import { useGanttChart } from '@/composables/useGanttChart'

const ganttStore = useGanttStore()
const { 
  calculateProjectProgress,
  countCompletedTasks,
  countTotalTasks,
  getTasksByStatus 
} = useGanttChart()

// Analytics using composable
const progress = computed(() => 
  calculateProjectProgress(ganttStore.tasks)
)

const stats = computed(() => ({
  total: countTotalTasks(ganttStore.tasks),
  completed: countCompletedTasks(ganttStore.tasks),
  inProgress: getTasksByStatus(ganttStore.tasks, 'in-progress').length,
  overdue: getTasksByStatus(ganttStore.tasks, 'overdue').length
}))
</script>

<template>
  <div class="dashboard">
    <h2>Project Progress: {{ progress }}%</h2>
    <p>Total Tasks: {{ stats.total }}</p>
    <p>Completed: {{ stats.completed }}</p>
    <p>In Progress: {{ stats.inProgress }}</p>
    <p>Overdue: {{ stats.overdue }}</p>
  </div>
</template>
```

## 🚫 Anti-Patterns to Avoid

### ❌ Don't: Put calculations in store
```typescript
// BAD - Store doing calculations
export const useGanttStore = defineStore('gantt', () => {
  const tasks = ref<Task[]>([])
  
  // ❌ This should be in a composable
  const calculateTimeline = () => {
    const dates = []
    tasks.value.forEach(task => { ... })
    return someCalculation(dates)
  }
})
```

### ✅ Do: Use composable for calculations
```typescript
// GOOD - Composable for calculations
export function useGanttChart() {
  const calculateTimeline = (tasks: Task[]) => {
    const dates = []
    tasks.forEach(task => { ... })
    return someCalculation(dates)
  }
  
  return { calculateTimeline }
}

// Store only manages state
export const useGanttStore = defineStore('gantt', () => {
  const tasks = ref<Task[]>([])
  return { tasks }
})
```

### ❌ Don't: Put state in composable
```typescript
// BAD - Composable with state
export function useGanttChart() {
  const tasks = ref<Task[]>([]) // ❌ State doesn't belong here
  
  return { tasks }
}
```

### ✅ Do: Keep composables stateless
```typescript
// GOOD - Composable is stateless
export function useGanttChart() {
  const flattenTasks = (tasks: Task[]): Task[] => { ... }
  
  return { flattenTasks }
}
```

## 📝 Best Practices

### 1. Single Responsibility
- Store: "What is the data?"
- Composable: "How do I process the data?"

### 2. Naming Convention
- Stores: `useXxxStore` (e.g., `useGanttStore`)
- Composables: `useXxx` (e.g., `useGanttChart`)

### 3. Import Order
```typescript
// Stores first
import { useGanttStore } from '@/stores/gantt'
import { useAuthStore } from '@/stores/auth'

// Then composables
import { useGanttChart } from '@/composables/useGanttChart'
import { useGoogleDrive } from '@/composables/useGoogleDrive'

// Then types
import type { Task } from '@/types'
```

### 4. Composable Return Pattern
```typescript
// Always return an object
export function useGanttChart() {
  const fn1 = () => { ... }
  const fn2 = () => { ... }
  
  return {
    fn1,
    fn2,
    // Makes it easy to destructure
  }
}
```

## 🎓 When in Doubt

Ask yourself:
1. **Does it need to persist?** → Store
2. **Is it shared across components?** → Store
3. **Is it a pure calculation?** → Composable
4. **Is it a UI utility?** → Composable
5. **Does it transform data?** → Composable

## 📦 Summary

### Use `useGanttStore` for:
- Managing chart data
- Adding/updating/deleting tasks
- Persisting state
- Business rules

### Use `useGanttChart` for:
- Date calculations
- Timeline positioning
- Status checks
- Export utilities
- Progress calculations

Both work together to create clean, maintainable code! 🎉

---

**Pro Tip:** If you find yourself copying the same calculation code across multiple components, it probably belongs in a composable!
