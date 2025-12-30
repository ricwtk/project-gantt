<script setup lang="ts">
import { computed } from 'vue'
import { parseISO, differenceInDays, addDays, format, startOfMonth, endOfMonth } from 'date-fns'
import type { Settings, Task } from '@/types'
import { calculateHeaderHeight } from '@/utils/sizeHelpers'
import GanttTimelineHeader from '@/components/gantt/GanttTimelineHeader.vue'
import GanttTimelineBar from '@/components/gantt/GanttTimelineBar.vue'

const props = defineProps<{
  tasks: Array<Task>,
  settings: Settings
}>()

const flattenTasks = (tasks: Array<Task>, result: Array<Task> = []) => {
  tasks.forEach(task => {
    result.push(task)
    if (task.subtasks && task.subtasks.length > 0) {
      flattenTasks(task.subtasks, result)
    }
  })
  return result
}

const headerHeight = computed(() => {
  return calculateHeaderHeight(props.settings.dateDisplay)
})

const allTasks = computed(() => flattenTasks(props.tasks))

const dateRange = computed(() => {
  const dates:Array<any> = []

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

  const start = minDate //startOfMonth(minDate)
  const end = maxDate //endOfMonth(maxDate)
  const days = differenceInDays(end, start) + 1

  return { start, end, days }
})

interface TimelineHeader {
  year: TimelineHeaderColumn[];
  month: TimelineHeaderColumn[];
  day: TimelineHeaderColumn[];
}

interface TimelineHeaderColumn {
  date: string;
  label: string;
  columns: number;
  isWeekend: boolean;
}

const timelineHeader = computed(() => {
  const header: TimelineHeader = {
    year: [],
    month: [],
    day: []
  }
  let currentDate = dateRange.value.start

  for (let i = 0; i < dateRange.value.days; i++) {
    for (const key in header) {
      let currentLabel = format(currentDate, key === 'year' ? 'yyyy' : key === 'month' ? 'MMM' : 'dd')
      let last_column = header[key].length > 0 ? header[key][header[key].length - 1] : null
      if (last_column && last_column.label == currentLabel) {
        last_column.columns += 1
      } else {
        header[key].push({
          date: currentDate,
          label: currentLabel,
          columns: 1,
          isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
        })
      }
    }
    // header.push({
    //   date: format(currentDate, 'yyyy-MM-dd'),
    //   label: format(currentDate, 'MMM dd'),
    //   isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6,
    // })
    currentDate = addDays(currentDate, 1)
  }

  return header
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

const getTaskPosition = (task: Task) => {
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

const getActualPosition = (task: Task) => {
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
  <div class="overflow-y-auto overflow-x-auto border rounded-lg">
    <!-- <div class="min-w-[800px] flex flex-row"> -->
    <div class="flex flex-row">
      <!-- No. column -->
      <div
        class="flex-shrink-0 border-r flex flex-col"
      >
        <div
          class="font-semibold p-2 inline-flex justify-center items-end"
          :style="{ height: headerHeight + 'px' }"
        >No.</div>
        <div v-for="(task,tIdx) in allTasks" :key="task.id" class="flex items-center justify-center p-2 border-t" :style="{ height: settings.rowHeight + 'px' }">
          <span class="truncate">{{ tIdx + 1 }}</span>
        </div>
      </div>
      <!-- Tasks column -->
      <div
        class="w-48 flex-shrink-0 border-r flex flex-col"
      >
        <div
          class="font-semibold p-2 inline-flex justify-start items-end"
          :style="{ height: headerHeight + 'px' }"
        >Tasks</div>
        <div v-for="task in allTasks"
          :key="task.id"
          class="flex items-center p-2 border-t"
          :style="{ height: settings.rowHeight + 'px' }"
        >
          <span class="truncate">{{ task.name }}</span>
        </div>
      </div>
      <!-- Timeline column -->
      <div class="flex flex-col overflow-x-auto flex-1">
        <GanttTimelineHeader
          :settings="settings"
          :dateRange="dateRange"
        />
        <GanttTimelineBar
          v-for="task in allTasks"
          :key="task.id"
          :task="task"
          :settings="settings"
          :dateRange="dateRange"
        />
      </div>

      <!-- Task rows -->
      <!-- <div
        v-for="task in allTasks"
        :key="task.id"
        class="flex border-b hover:bg-muted/30"
      > -->
        <!-- <div class="w-48 flex-shrink-0 p-2 border-r flex items-center">
          <span class="text-sm truncate">{{ task.name }}</span>
        </div> -->
        <!-- <div class="flex-1 relative h-12"> -->
          <!-- Planned bar -->
          <!-- <div
            v-if="getTaskPosition(task)"
            :style="{
              left: getTaskPosition(task)!.left,
              width: getTaskPosition(task)!.width,
              backgroundColor: getTaskPosition(task)!.color,
              opacity: '0.3'
            }"
            class="absolute top-2 h-3 rounded-sm"
          /> -->
          <!-- Actual bar -->
          <!-- <div
            v-if="getActualPosition(task)"
            :style="{
              left: getActualPosition(task)!.left,
              width: getActualPosition(task)!.width,
              backgroundColor: getActualPosition(task)!.color
            }"
            class="absolute top-6 h-3 rounded-sm"
          /> -->
        <!-- </div> -->
      <!-- </div> -->
    </div>
  </div>
</template>
