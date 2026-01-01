<script setup lang="ts">
import { computed } from 'vue'
import { format, addDays } from 'date-fns'
import type { Settings } from '@/types'
import { dateHeaderHeight } from '@/constants'

const props = defineProps<{
  dateRange: {
    start: Date;
    end: Date;
    days: number;
  },
  settings: Settings
}>()

interface TimelineHeader {
  year: TimelineHeaderColumn[];
  month: TimelineHeaderColumn[];
  day: TimelineHeaderColumn[];
}

interface TimelineHeaderColumn {
  date: Date;
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
  let currentDate = props.dateRange.start

  for (let i = 0; i < props.dateRange.days; i++) {
    for (const key in header) {
      let headerRow: TimelineHeaderColumn[] = header[key as keyof TimelineHeader];
      let currentLabel = format(currentDate, key === 'year' ? 'yyyy' : key === 'month' ? 'MMM' : 'dd')
      let last_column = headerRow.length > 0 ? headerRow[headerRow.length - 1] : null
      if (last_column && last_column.label == currentLabel) {
        last_column.columns += 1
      } else {
        headerRow.push({
          date: currentDate,
          label: currentLabel,
          columns: 1,
          isWeekend: currentDate.getDay() === 0 || currentDate.getDay() === 6
        })
      }
    }
    currentDate = addDays(currentDate, 1)
  }

  return header
})
</script>

<template>
  <div aria-label="Year-Row" v-if="settings.dateDisplay.includes('year')"
    class="flex flex-row w-fit p-0.5 items-center bg-muted/50 text-xs font-bold"
    :class="{ 'border-b': settings.dateDisplay.includes('month') || settings.dateDisplay.includes('day') }"
    :style="{ height: dateHeaderHeight + 'px' }"
  >
    <div
      class="flex-shrink-0 flex items-center justify-start px-2"
      v-for="year in timelineHeader['year']"
      :key="year.date.toISOString()"
      :style="{ width: settings.columnWidth * year.columns + 'px' }"
    >{{ year.label }}</div>
  </div>
  <div aria-label="Month-Row" v-if="settings.dateDisplay.includes('month')"
    class="flex flex-row w-fit p-0.5 items-center bg-muted/50 text-xs font-bold"
    :class="{ 'border-b': settings.dateDisplay.includes('day') }"
    :style="{ height: dateHeaderHeight + 'px' }"
  >
    <div
      class="flex-shrink-0 flex items-center justify-start px-2"
      v-for="month in timelineHeader['month']"
      :key="month.date.toISOString()"
      :style="{ width: settings.columnWidth * month.columns + 'px' }"
    >{{ month.label }}</div>
  </div>
  <div aria-label="Day-Row" v-if="settings.dateDisplay.includes('day')"
    class="flex flex-row w-fit p-0.5 items-stretch bg-muted/50 text-xs"
    :style="{ height: dateHeaderHeight + 'px' }"
  >
    <div
      class="flex-shrink-0 flex items-center justify-center"
      :class="{ 'bg-muted': day.isWeekend }"
      v-for="day in timelineHeader['day']"
      :key="day.date.toISOString()"
      :style="{ width: settings.columnWidth * day.columns + 'px' }"
    >{{ day.label }}</div>
  </div>
</template>
