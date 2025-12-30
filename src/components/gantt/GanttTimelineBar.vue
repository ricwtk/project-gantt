<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Task, Settings } from '@/types';
import { parseISO, differenceInDays } from 'date-fns';
import { defaultTaskColor } from '@/constants';

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
      <div
        class="absolute top-3/20 left-0"
        :style="{
          backgroundColor: barColor,
          height: settings.rowHeight * 0.7 + 'px',
          width: barWidth + 'px',
          marginLeft: barStart + 'px'
        }"
      ></div>
    </div>
</div>
</template>
