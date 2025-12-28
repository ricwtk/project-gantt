<script setup>
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGanttStore } from '@/stores/gantt'

const props = defineProps({
  open: Boolean,
  chartIndex: Number,
})

const emit = defineEmits(['update:open'])

const ganttStore = useGanttStore()

const localSettings = ref({
  dateFormat: ganttStore.settings.dateFormat,
  colorScheme: ganttStore.settings.colorScheme,
})

watch(() => props.open, (isOpen) => {
  if (isOpen) {
    localSettings.value = {
      dateFormat: ganttStore.settings.dateFormat,
      colorScheme: ganttStore.settings.colorScheme,
    }
  }
})

const handleSave = () => {
  ganttStore.updateSettings({
    dateFormat: localSettings.value.dateFormat,
    colorScheme: localSettings.value.colorScheme,
  })
  ganttStore.markModified()
  emit('update:open', false)
}

const dateFormatOptions = [
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'MMM dd, yyyy', label: 'MMM DD, YYYY' },
]

const colorSchemeOptions = [
  { value: 'Set1', label: 'Set 1' },
  { value: 'Set2', label: 'Set 2' },
  { value: 'Set3', label: 'Set 3' },
  { value: 'Pastel1', label: 'Pastel 1' },
  { value: 'Pastel2', label: 'Pastel 2' },
]
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription>
          Customize your Gantt chart settings
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-6 py-4">
        <div class="space-y-2">
          <Label for="date-format">Date Display Format</Label>
          <Select v-model="localSettings.dateFormat">
            <SelectTrigger id="date-format">
              <SelectValue placeholder="Select date format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="option in dateFormatOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-2">
          <Label for="color-scheme">Color Scheme</Label>
          <Select v-model="localSettings.colorScheme">
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

        <div class="pt-4 border-t">
          <p class="text-sm text-muted-foreground">
            Note: Settings apply to all Gantt charts in this file
          </p>
        </div>
      </div>

      <div class="flex justify-end space-x-2">
        <Button variant="outline" @click="$emit('update:open', false)">
          Cancel
        </Button>
        <Button @click="handleSave">
          Save Changes
        </Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
