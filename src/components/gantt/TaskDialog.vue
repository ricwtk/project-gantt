<script setup>
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
import { Textarea } from '@/components/ui/textarea'
import ColorPicker from '@/components/ColorPicker.vue'
import { format } from 'date-fns'

const props = defineProps({
  open: Boolean,
  task: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:open', 'save'])

const formData = ref({
  name: '',
  description: '',
  plannedStart: '',
  plannedEnd: '',
  actualStart: '',
  actualEnd: '',
  color: null,
})

const resetForm = () => {
  const today = format(new Date(), 'yyyy-MM-dd')
  formData.value = {
    name: '',
    description: '',
    plannedStart: today,
    plannedEnd: today,
    actualStart: '',
    actualEnd: '',
    color: null,
  }
}

watch(() => props.task, (newTask) => {
  if (newTask) {
    formData.value = {
      name: newTask.name || '',
      description: newTask.description || '',
      plannedStart: newTask.planned?.[0] || '',
      plannedEnd: newTask.planned?.[1] || '',
      actualStart: newTask.actual?.[0] || '',
      actualEnd: newTask.actual?.[1] || '',
      color: newTask.color || null,
    }
  } else {
    resetForm()
  }
}, { immediate: true })

const handleSave = () => {
  const taskData = {
    name: formData.value.name,
    description: formData.value.description,
    planned: [formData.value.plannedStart, formData.value.plannedEnd],
    actual: [formData.value.actualStart, formData.value.actualEnd],
    color: formData.value.color,
  }

  emit('save', taskData)
  emit('update:open', false)
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>{{ task ? 'Edit Task' : 'New Task' }}</DialogTitle>
        <DialogDescription>
          {{ task ? 'Update task details' : 'Create a new task for your project' }}
        </DialogDescription>
      </DialogHeader>

      <div class="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
        <div class="grid gap-2">
          <Label for="name">Task Name</Label>
          <Input
            id="name"
            v-model="formData.name"
            placeholder="Enter task name"
          />
        </div>

        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Textarea
            id="description"
            v-model="formData.description"
            placeholder="Enter task description"
            rows="3"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="planned-start">Planned Start</Label>
            <Input
              id="planned-start"
              v-model="formData.plannedStart"
              type="date"
            />
          </div>
          <div class="grid gap-2">
            <Label for="planned-end">Planned End</Label>
            <Input
              id="planned-end"
              v-model="formData.plannedEnd"
              type="date"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="actual-start">Actual Start</Label>
            <Input
              id="actual-start"
              v-model="formData.actualStart"
              type="date"
            />
          </div>
          <div class="grid gap-2">
            <Label for="actual-end">Actual End</Label>
            <Input
              id="actual-end"
              v-model="formData.actualEnd"
              type="date"
            />
          </div>
        </div>

        <ColorPicker
          v-model="formData.color"
          label="Task Color (Optional)"
        />
      </div>

      <DialogFooter>
        <Button variant="outline" @click="handleCancel">Cancel</Button>
        <Button @click="handleSave">Save</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
