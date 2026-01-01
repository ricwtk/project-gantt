<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Task, Settings } from '@/types';
import { parseISO, differenceInDays } from 'date-fns';
import { defaultTaskColor, plannedBarHeight, actualBarHeight, defaultActualBarColor } from '@/constants';
import { TinyColor } from '@ctrl/tinycolor';

const props = defineProps<{
  task: Task;
  settings: Settings;
  dateRange: {
    start: Date;
    end: Date;
    days: number;
  }
}>();

const barWidth = computed(() => {
  try {
    let start = parseISO(props.task.planned[0]);
    let end = parseISO(props.task.planned[1]);
    let duration = differenceInDays(end, start) + 1;
    return props.settings.columnWidth * duration;
  } catch (error) {
    console.error(error);
    return 0;
  }
});
const barColor = computed(() => {
  return props.task.color || defaultTaskColor;
})
const barStart = computed(() => {
  try {
    let start = parseISO(props.task.planned[0]);
    let duration = differenceInDays(start, props.dateRange.start);
    return props.settings.columnWidth * duration;
  } catch (error) {
    console.error(error);
    return 0;
  }
});

const actualBarWidth = computed(() => {
  try {
    let start = parseISO(props.task.actual[0]);
    let end = parseISO(props.task.actual[1]);
    let duration = differenceInDays(end, start) + 1;
    return props.settings.columnWidth * duration;
  } catch (error) {
    console.error(error);
    return 0;
  }
});
const actualBarColor = computed(() => {
  return new TinyColor(barColor.value).darken(30).toHexString();
})
const actualBarStart = computed(() => {
  try {
    let start = parseISO(props.task.actual[0]);
    let duration = differenceInDays(start, props.dateRange.start);
    return props.settings.columnWidth * duration;
  } catch (error) {
    console.error(error);
    return 0;
  }
});

</script>

<template>
  <div
    class="p-0.5 border-t w-fit overflow-y-auto flex"
    :style="{ height: settings.rowHeight + 'px' }"
  >
    <div
      class="relative"
      :style="{ width: settings.columnWidth * dateRange.days + 'px' }"
    >
      <!-- {{ task }} -->
      <div class="absolute"
        :style="{
          top: (1-plannedBarHeight) / 2 * 100 + '%',
          backgroundColor: barColor,
          height: plannedBarHeight * 100 + '%',
          width: barWidth + 'px',
          left: barStart + 'px'
        }"
      ></div>
       <div class="absolute"
        :style="{
            top: (1-actualBarHeight) / 2 * 100 + '%',
            backgroundColor: actualBarColor,
            height: actualBarHeight * 100 + '%',
            width: actualBarWidth + 'px',
            left: actualBarStart + 'px'
          }"
       ></div>
    </div>
  </div>
  <template v-if="task.subtasks && task.subtasks.length > 0 && !task.collapsed.timeline">
    <GanttTimelineBar
      v-for="subtask in props.task.subtasks"
      :key="subtask.id"
      :task="subtask"
      :settings="settings"
      :dateRange="dateRange"
    />
  </template>
</template>
