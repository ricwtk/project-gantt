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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

const chartName = ref<string>('')

watch(() => props.chart, (newChart) => {
  if (newChart) {
    chartName.value = newChart.name || ''
  } else {
    chartName.value = ''
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
            v-model="chartName"
            placeholder="e.g., Phase 1: Planning"
            @keyup.enter="handleSave"
            autofocus
          />
          <p class="text-xs text-muted-foreground">
            Give your chart a descriptive name
          </p>
        </div>
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
