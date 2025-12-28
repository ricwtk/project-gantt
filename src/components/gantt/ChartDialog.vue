<script setup lang="ts">
import { ref, watch } from 'vue'
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
import type { GanttChart } from '@/types'

interface Props {
  open: boolean
  chart: GanttChart | null
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  chart: null
})

interface Emits {
  (e: 'update:open', value: boolean): void
  (e: 'save', chartName: string): void
}

const emit = defineEmits<Emits>()

const chartSettings = ref({
  name: '',
  dateDisplay: ['year', 'month', 'day'],
  colorScheme: 'Set3',
  rowHeight: 40,
  columnWidth: 28
})

const chartName = ref<string>('')

const resetChartSettings = () => {
  chartSettings.value = {
    name: '',
    dateDisplay: ['year', 'month', 'day'],
    colorScheme: 'Set3',
    rowHeight: 40,
    columnWidth: 28
  }
}

watch(() => props.chart, (newChart) => {
  if (newChart) {
    chartSettings.value = {
      name: newChart.name || '',
      dateDisplay: newChart.settings.dateDisplay || ['year', 'month', 'day'],
      colorScheme: newChart.settings.colorScheme || 'Set3',
      rowHeight: newChart.settings.rowHeight || 40,
      columnWidth: newChart.settings.columnWidth || 28
    }
  } else {
    resetChartSettings()
  }
}, { immediate: true })

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    chartName.value = ''
  }
})

const handleSave = (): void => {
  const trimmedName = chartName.value.trim()

  if (!trimmedName) {
    alert('Please enter a chart name')
    return
  }

  emit('save', trimmedName)
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
  if (chartSettings.value.dateDisplay.includes(value)) {
    chartSettings.value.dateDisplay = chartSettings.value.dateDisplay.filter((v) => v !== value)
  } else {
    chartSettings.value.dateDisplay.push(value)
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>
          {{ chart ? 'Rename Gantt Chart' : 'New Gantt Chart' }}
        </DialogTitle>
        <DialogDescription>
          {{ chart ? 'Update the name of your Gantt chart' : 'Create a new Gantt chart in this file' }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="chart-name">Chart Name</Label>
          <Input
            id="chart-name"
            v-model="chartSettings.name"
            placeholder="e.g., Phase 1: Planning"
            @keyup.enter="handleSave"
            autofocus
          />
          <p class="text-xs text-muted-foreground">
            Give your chart a descriptive name
          </p>
        </div>

        <div class="grid gap-2">
          <Label for="date-display">Date Display</Label>
          <ToggleGroup type="multiple" variant="outline" v-model="chartSettings.dateDisplay">
            <ToggleGroupItem
              v-for="option in dateDisplayOptions"
              :key="option.value"
              :value="option.value"
            >
              <!-- :selected="chartSettings.dateDisplay.includes(option.value)"
              @click="toggleDateDisplay(option.value)" -->
              {{ option.label }}
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div class="space-y-2">
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
        </div>

        <div>{{ chartSettings }}</div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">
          Cancel
        </Button>
        <Button @click="handleSave">
          {{ chart ? 'Save' : 'Create' }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
