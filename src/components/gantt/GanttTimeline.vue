<script setup lang="ts">
import { computed } from 'vue'
import { parseISO, differenceInDays, addDays, format, startOfMonth, endOfMonth } from 'date-fns'
import type { Settings, Task } from '@/types'
import { calculateHeaderHeight } from '@/utils/sizeHelpers'
import GanttTimelineHeader from '@/components/gantt/GanttTimelineHeader.vue'
import GanttTimelineBar from '@/components/gantt/GanttTimelineBar.vue'
import GanttTimelineLabel from '@/components/gantt/GanttTimelineLabel.vue'
import GanttTimelineIndex from '@/components/gantt/GanttTimelineIndex.vue'

const props = defineProps<{
  tasks: Array<Task>,
  settings: Settings
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', taskId: string): void
  (e: 'edit', task: Task): void
  (e: 'delete', taskId: string): void
  (e: 'add-subtask', taskId: string): void
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

const handleToggleTaskCollapse = (taskId: string) => {
  emit('update:collapsed', taskId);
};

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
          class="font-semibold p-2 inline-flex justify-start items-end min-w-[3rem]"
          :style="{ height: headerHeight + 'px' }"
        >No.</div>
        <GanttTimelineIndex
          v-for="(task, index) in props.tasks"
          :key="task.id"
          :task="task"
          :settings="settings"
          :index="index"
        />
      </div>
      <!-- Tasks column -->
      <div
        class="w-48 flex-shrink-0 border-r flex flex-col"
      >
        <div
          class="font-semibold p-2 inline-flex justify-start items-end"
          :style="{ height: headerHeight + 'px' }"
        >Tasks</div>
        <GanttTimelineLabel
          v-for="task in props.tasks"
          :key="task.id"
          :task="task"
          :settings="settings"
          @update:collapsed="handleToggleTaskCollapse"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
          @add-subtask="$emit('add-subtask', $event)"
        />
      </div>
      <!-- Timeline column -->
      <div class="flex flex-col overflow-x-auto flex-1">
        <GanttTimelineHeader
          :settings="settings"
          :dateRange="dateRange"
        />
        <GanttTimelineBar
          v-for="task in props.tasks"
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
