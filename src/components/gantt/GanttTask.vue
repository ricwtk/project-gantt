<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from 'lucide-vue-next'
import type { Task } from '@/types'

interface Props {
  task: Task;
  level?: number;
}
const props = withDefaults(defineProps<Props>(), {
  level: 0,
})

interface Emits {
  (event: 'edit', task: Task): void;
  (event: 'delete', taskId: string): void;
  (event: 'add-subtask', taskId: string): void;
  (event: 'update:collapsed', taskId: string): void;
}
const emit = defineEmits<Emits>()

const handleToggleCollapse = () => {
  emit('update:collapsed', props.task.id)
}

const handleEdit = () => {
  emit('edit', props.task)
}

const handleDelete = () => {
  emit('delete', props.task.id)
}

const handleAddSubtask = () => {
  emit('add-subtask', props.task.id)
}
</script>

<template>
  <div class="space-y-1">
    <div class="grid grid-cols-12 gap-4 items-center py-2 hover:bg-muted/50 rounded-md px-2">
      <div class="col-span-4 flex items-center" :style="{ paddingLeft: `${level * 24}px` }">
        <Button
          v-if="task.subtasks && task.subtasks.length > 0"
          variant="ghost"
          size="icon"
          class="h-6 w-6 mr-1"
          @click="handleToggleCollapse"
        >
          <ChevronRight v-if="task.collapsed.tasklist" class="w-4 h-4" />
          <ChevronDown v-else class="w-4 h-4" />
        </Button>

        <!-- Color indicator -->
        <div
          v-if="task.color"
          class="w-3 h-3 rounded-full mr-2 flex-shrink-0 border border-border"
          :style="{ backgroundColor: task.color }"
          :title="`Task color: ${task.color}`"
        />

        <span class="font-medium">{{ task.name }}</span>
      </div>

      <div class="col-span-3 text-sm">
        <span v-if="task.planned[0]">
          {{ task.planned[0] }}
          <span v-if="task.planned[1]"> ~ {{ task.planned[1] }}</span>
        </span>
        <span v-else class="text-muted-foreground">Not set</span>
      </div>

      <div class="col-span-3 text-sm">
        <span v-if="task.actual[0]">
          {{ task.actual[0] }}
          <span v-if="task.actual[1]"> ~ {{ task.actual[1] }}</span>
        </span>
        <span v-else class="text-muted-foreground">Not started</span>
      </div>

      <div class="col-span-2 flex items-center space-x-1">
        <Button variant="ghost" size="icon" class="h-8 w-8" @click="handleEdit">
          <Edit class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" class="h-8 w-8" @click="handleAddSubtask">
          <Plus class="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" class="h-8 w-8" @click="handleDelete">
          <Trash2 class="w-4 h-4 text-destructive" />
        </Button>
      </div>
    </div>

    <div v-if="task.subtasks && task.subtasks.length > 0 && !task.collapsed.tasklist">
      <GanttTask
        v-for="subtask in task.subtasks"
        :key="subtask.id"
        :task="subtask"
        :level="level + 1"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @add-subtask="$emit('add-subtask', $event)"
        @update:collapsed="$emit('update:collapsed', $event)"
      />
    </div>
  </div>
</template>
