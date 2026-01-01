<script setup lang="ts">
import type { Settings, Task } from '@/types';

interface Props {
  prefix?: string|null;
  task: Task;
  settings: Settings;
  index: number;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: null,
});
</script>
<template>
  <div
    class="flex items-center justify-start p-2 border-t"
    :style="{ height: settings.rowHeight + 'px' }"
  >
    <span class="truncate">{{ `${props.prefix ? props.prefix + '.' : ''}${index + 1}` }}</span>
  </div>
  <template v-if="task.subtasks && task.subtasks.length > 0 && !task.collapsed.timeline">
    <GanttTimelineIndex
      v-for="(subtask, subIndex) in task.subtasks"
      :key="subtask.id"
      :prefix="`${props.prefix ? props.prefix + '.' : ''}${index + 1}`"
      :task="subtask"
      :settings="settings"
      :index="subIndex"
    />
  </template>
</template>
