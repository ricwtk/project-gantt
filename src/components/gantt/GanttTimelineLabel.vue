<script setup lang="ts">
import type { Task, Settings } from '@/types';
import { onMounted, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown, MoreVertical, Edit, Plus, Trash2 } from 'lucide-vue-next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Props {
  task: Task;
  settings: Settings;
  level?: number;
}
const props = withDefaults(defineProps<Props>(), {
  level: 0,
});

interface Emits {
  (e: 'update:collapsed', taskId: string): void;
  (e: 'edit', task: Task): void;
  (e: 'delete', taskId: string): void;
  (e: 'add-subtask', taskId: string): void;
  (e: 'dragstart', data: { event: DragEvent; taskId: string }): void;
  (e: 'dragend', data: { event: DragEvent; taskId: string }): void;
  (e: 'dragover', data: { event: DragEvent; taskId: string }): void;
  (e: 'dragenter', data: { event: DragEvent; taskId: string }): void;
  (e: 'dragleave', data: { event: DragEvent; taskId: string }): void;
  (e: 'dragdrop', data: { event: DragEvent; taskId: string }): void;
}

const emit = defineEmits<Emits>();

const handleToggleCollapse = () => {
  emit('update:collapsed', props.task.id);
};
const handleEdit = () => {
  emit('edit', props.task)
}
const handleDelete = () => {
  emit('delete', props.task.id)
}
const handleAddSubtask = () => {
  emit('add-subtask', props.task.id)
}

const handleDragStart = (event: DragEvent) => {
  emit('dragstart', { event, taskId: props.task.id })
  console.log('Drag start');
}
const handleDragEnd = (event: DragEvent) => {
  emit('dragend', { event, taskId: props.task.id })
  console.log('Drag end');
}
const handleDragOver = (event: DragEvent) => {
  emit('dragover', { event, taskId: props.task.id })
  console.log('Drag over');
}
const handleDragEnter = (event: DragEvent) => {
  emit('dragenter', { event, taskId: props.task.id })
  console.log('Drag enter');
}
const handleDragLeave = (event: DragEvent) => {
  emit('dragleave', { event, taskId: props.task.id })
  console.log('Drag leave');
}
const handleDragDrop = (event: DragEvent) => {
  emit('dragdrop', { event, taskId: props.task.id })
  console.log('Drag drop');
}
</script>

<template>
  <div
    class="flex flex-col justify-center p-2 border-t cursor-pointer"
    :style="{ height: settings.rowHeight + 'px' }"
  >
    <span
      class="flex flex-row"
      :style="{ paddingLeft: level * 24 + 'px' }"
    >
      <span
        :draggable="true"
        class="flex-1 truncate select-none"
        @dragstart="handleDragStart"
        @dragend="handleDragEnd"
        @dragover="handleDragOver"
        @dragenter="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDragDrop"
      >{{ task.name }}</span>
      <Button
        v-if="task.subtasks && task.subtasks.length > 0"
        variant="ghost"
        size="icon"
        class="h-6 w-6 mr-1"
        @click="handleToggleCollapse"
      >
        <ChevronLeft v-if="task.collapsed.timeline" class="w-4 h-4" />
        <ChevronDown v-else class="w-4 h-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="h-6 w-6"
            @click.stop
          >
            <MoreVertical class="w-3 h-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem @click="handleEdit">
            <Edit class="w-4 h-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem @click="handleAddSubtask">
            <Plus class="w-4 h-4 mr-2" />
            Add Subtask
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            @click="handleDelete"
            class="text-destructive"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  </div>
  <template v-if="task.subtasks && task.subtasks.length > 0 && !task.collapsed.timeline">
    <GanttTimelineLabel
      v-for="subtask in props.task.subtasks"
      :key="subtask.id"
      :task="subtask"
      :settings="settings"
      :level="level + 1"
      @update:collapsed="$emit('update:collapsed', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
      @add-subtask="$emit('add-subtask', $event)"
      @dragend="$emit('dragend', $event)"
      @dragover="$emit('dragover', $event)"
      @dragenter="$emit('dragenter', $event)"
      @dragleave="$emit('dragleave', $event)"
      @dragdrop="$emit('dragdrop', $event)"
    />
  </template>
</template>
