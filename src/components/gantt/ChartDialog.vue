<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { GanttChart, Settings, Task } from '@/types'
import { getMonthName } from '@/utils/dateHelpers'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateHeaderHeight } from '@/utils/sizeHelpers'
import { dateHeaderHeight } from '@/constants'
import GanttTimeline from '@/components/gantt/GanttTimeline.vue'

interface Props {
  open: boolean
  chartName: string | null
  chartSettings: Settings | null
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  chartName: null,
  chartSettings: {
    name: '',
    dateDisplay: ['year', 'month', 'day'],
    colorScheme: 'Set3',
    rowHeight: 40,
    columnWidth: 28
  }
})

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'save', chartName: string, chartSettings: Settings): void
}

const emit = defineEmits<Emits>()

const currentName = ref(props.chartName)
const currentSettings = ref(props.chartSettings)

const resetChartSettings = () => {
  currentName.value = ''
  currentSettings.value = {
    dateDisplay: ['year', 'month', 'day'],
    colorScheme: 'Set3',
    rowHeight: 40,
    columnWidth: 28
  }
}

watch(() => props.chartName, (newName) => {
  currentName.value = newName
})

watch(() => props.chartSettings, (newSettings) => {
  if (newSettings) {
    currentSettings.value = {
      dateDisplay: newSettings.dateDisplay || ['year', 'month', 'day'],
      colorScheme: newSettings.colorScheme || 'Set3',
      rowHeight: newSettings.rowHeight || 40,
      columnWidth: newSettings.columnWidth || 28
    }
  } else {
    resetChartSettings()
  }
}, { immediate: true })

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    resetChartSettings()
  }
})

const today = new Date()

const handleSave = (): void => {
  emit('save', currentName.value, currentSettings.value)
  emit('update:open', false)
}

const handleCancel = (): void => {
  emit('update:open', false)
}

const colorSchemeOptions = [
  { value: 'Set1', label: 'Set 1' },
  { value: 'Set2', label: 'Set 2' },
  { value: 'Set3', label: 'Set 3' },
  { value: 'Pastel1', label: 'Pastel 1' },
  { value: 'Pastel2', label: 'Pastel 2' },
]
const dateDisplayOptions = [
  { value: 'year', label: 'Year' },
  { value: 'month', label: 'Month' },
  { value: 'day', label: 'Day' },
]
const toggleDateDisplay = (value: string): void => {
  if (currentSettings.value.dateDisplay.includes(value)) {
    currentSettings.value.dateDisplay = currentSettings.value.dateDisplay.filter((v) => v !== value)
  } else {
    currentSettings.value.dateDisplay.push(value)
  }
}

const headerHeight = computed(() => calculateHeaderHeight(currentSettings.value.dateDisplay))

const sampleTasks: Task[] = [
  {
    id: 'task1',
    name: 'Task 1',
    planned: ['2023-01-01', '2023-01-05'],
    actual: ['2023-01-02', '2023-01-04'],
    color: '#ff0000',
  },
  {
    id: 'task2',
    name: 'Task 2',
    planned: ['2023-01-06', '2023-01-10'],
    actual: ['2023-01-07', '2023-01-09'],
    color: '#0000ff',
  },
]
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>
          {{ chartSettings ? 'Update Gantt Chart' : 'New Gantt Chart' }}
        </DialogTitle>
        <DialogDescription>
          {{ chartSettings ? 'Update the settings of your Gantt chart' : 'Create a new Gantt chart in this file' }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
        <div class="grid gap-2">
          <Label for="chart-name">Chart Name</Label>
          <Input
            id="chart-name"
            v-model="currentName"
            placeholder="e.g., Phase 1: Planning"
            autofocus
          />
          <p class="text-xs text-muted-foreground">
            Give your chart a descriptive name
          </p>
        </div>

        <div class="grid gap-2">
          <Label for="date-display">Date Display</Label>
          <ToggleGroup id="date-display" type="multiple" variant="outline" v-model="currentSettings.dateDisplay" class="w-full">
            <ToggleGroupItem
              v-for="option in dateDisplayOptions"
              :key="option.value"
              :value="option.value"
              class="flex-1"
            >
              <!-- :selected="currentSettings.dateDisplay.includes(option.value)"
              @click="toggleDateDisplay(option.value)" -->
              {{ option.label }}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="row-height">Row Height</Label>
            <Input id="row-height" type="number" v-model="currentSettings.rowHeight" min="10" max="100" />
          </div>
          <div class="grid gap-2">
            <Label for="column-width">Column Width</Label>
            <Input id="column-width" type="number" v-model="currentSettings.columnWidth" min="10" max="100" />
          </div>
        </div>

        <!-- <div class="space-y-2">
          <Label for="color-scheme">Color Scheme</Label>
          <Select v-model="chartSettings.colorScheme">
            <SelectTrigger id="color-scheme">
              <SelectValue placeholder="Select color scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in colorSchemeOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div> -->

        <div class="w-full overflow-x-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                Chart Sample
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GanttTimeline :tasks="sampleTasks" :settings="currentSettings" />
            </CardContent>
          </Card>
        </div>

      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">
          Cancel
        </Button>
        <Button @click="handleSave">
          {{ chartSettings ? 'Save' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
