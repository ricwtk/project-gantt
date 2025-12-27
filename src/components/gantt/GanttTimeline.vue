<script setup>
import { computed } from 'vue'
import { parseISO, differenceInDays, addDays, format, startOfMonth, endOfMonth } from 'date-fns'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const flattenTasks = (tasks, result = []) => {
  tasks.forEach(task => {
    result.push(task)
    if (task.subtasks && task.subtasks.length > 0) {
      flattenTasks(task.subtasks, result)
    }
  })
  return result
}

const allTasks = computed(() => flattenTasks(props.tasks))

const dateRange = computed(() => {
  const dates = []

  allTasks.value.forEach(task => {
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

  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(...dates))

  const start = startOfMonth(minDate)
  const end = endOfMonth(maxDate)
  const days = differenceInDays(end, start) + 1

  return { start, end, days }
})

const timelineColumns = computed(() => {
  const columns = []
  let currentDate = dateRange.value.start

  for (let i = 0; i < dateRange.value.days; i++) {
    columns.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      label: format(currentDate, 'MMM dd'),
      isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    })
    currentDate = addDays(currentDate, 1)
  }

  return columns
})

const getTaskPosition = (task) => {
  if (!task.planned[0] || !task.planned[1]) return null

  const startDate = parseISO(task.planned[0])
  const endDate = parseISO(task.planned[1])

  const startDay = differenceInDays(startDate, dateRange.value.start)
  const duration = differenceInDays(endDate, startDate) + 1

  const left = (startDay / dateRange.value.days) * 100
  const width = (duration / dateRange.value.days) * 100

  return {
    left: `${left}%`,
    width: `${width}%`,
    color: task.color || 'hsl(var(--primary))'
  }
}

const getActualPosition = (task) => {
  if (!task.actual[0]) return null

  const startDate = parseISO(task.actual[0])
  const endDate = task.actual[1] ? parseISO(task.actual[1]) : new Date()

  const startDay = differenceInDays(startDate, dateRange.value.start)
  const duration = differenceInDays(endDate, startDate) + 1

  const left = (startDay / dateRange.value.days) * 100
  const width = (duration / dateRange.value.days) * 100

  return {
    left: `${left}%`,
    width: `${width}%`,
    color: task.color ? `${task.color}E6` : 'hsl(var(--primary))' // Slightly more opaque for actual
  }
}
</script>

<template>
  <div class="gantt-container overflow-x-auto border rounded-lg">
    <div class="min-w-[800px]">
      <!-- Timeline header -->
      <div class="flex border-b bg-muted/50">
        <div class="w-48 flex-shrink-0 p-2 font-medium border-r">Tasks</div>
        <div class="flex-1 flex">
          <div
            v-for="col in timelineColumns"
            :key="col.date"
            class="flex-1 p-2 text-xs text-center border-r"
            :class="{ 'bg-muted': col.isWeekend }"
          >
            {{ col.label }}
          </div>
        </div>
      </div>

      <!-- Task rows -->
      <div
        v-for="task in allTasks"
        :key="task.id"
        class="flex border-b hover:bg-muted/30"
      >
        <div class="w-48 flex-shrink-0 p-2 border-r flex items-center">
          <span class="text-sm truncate">{{ task.name }}</span>
        </div>
        <div class="flex-1 relative h-12">
          <!-- Planned bar -->
          <div
            v-if="getTaskPosition(task)"
            :style="{
              left: getTaskPosition(task).left,
              width: getTaskPosition(task).width,
              backgroundColor: getTaskPosition(task).color,
              opacity: '0.3'
            }"
            class="absolute top-2 h-3 rounded-sm"
          />
          <!-- Actual bar -->
          <div
            v-if="getActualPosition(task)"
            :style="{
              left: getActualPosition(task).left,
              width: getActualPosition(task).width,
              backgroundColor: getActualPosition(task).color
            }"
            class="absolute top-6 h-3 rounded-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gantt-container {
  max-height: 600px;
  overflow-y: auto;
}
</style>
