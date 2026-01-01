<script setup lang="ts">
import type { Task, Settings } from '@/types';
import { ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronDown } from 'lucide-vue-next';

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
}

const emit = defineEmits<Emits>();

const handleToggleCollapse = () => {
  emit('update:collapsed', props.task.id);
};
const handleSubtaskToggleCollapse = (taskId: string) => {
  emit('update:collapsed', taskId);
};
</script>

<template>
  <div
    class="flex flex-col justify-center p-2 border-t"
    :style="{ height: settings.rowHeight + 'px' }"
  >
    <span
      class="flex flex-row"
      :style="{ paddingLeft: level * 24 + 'px' }"
    >
      <span class="flex-1 truncate">{{ task.name }}</span>
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

    </span>
  </div>
  <template v-if="task.subtasks && task.subtasks.length > 0 && !task.collapsed.timeline">
    <GanttTimelineLabel
      v-for="subtask in props.task.subtasks"
      :key="subtask.id"
      :task="subtask"
      :settings="settings"
      :level="level + 1"
      @update:collapsed="handleSubtaskToggleCollapse"
    />
  </template>
</template>
