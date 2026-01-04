// Example usage in a component:
/*
<script setup>
import { ref } from 'vue';
import { useDrag } from './useDrag';

const emit = defineEmits([
  'drag-start',
  'drag-enter',
  'drag-leave',
  'drop',
  'drag-end'
]);

const items = ref([
  { id: 1, name: 'Item 1', children: [
    { id: 2, name: 'Item 1.1' },
    { id: 3, name: 'Item 1.2' }
  ]},
  { id: 4, name: 'Item 2', children: [] }
]);

const {
  isDragging,
  handleDragStart,
  handleDragOver,
  handleDragEnter,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
  isBeingDragged,
  getDropIndicatorClass
} = useDrag(emit);

const onDrop = (payload) => {
  console.log('Drop event:', payload);
};
</script>

<template>
  <div class="nested-list">
    <div
      v-for="item in items"
      :key="item.id"
      :draggable="true"
      :class="[
        'list-item',
        { 'dragging': isBeingDragged(item).value },
        getDropIndicatorClass(item).value
      ]"
      @dragstart="handleDragStart(item)"
      @dragover="handleDragOver($event, item)"
      @dragenter="handleDragEnter($event, item)"
      @dragleave="handleDragLeave($event, item)"
      @drop="handleDrop($event, item)"
      @dragend="handleDragEnd"
    >
      {{ item.name }}

      <div v-if="item.children?.length" class="children">
        <div
          v-for="child in item.children"
          :key="child.id"
          :draggable="true"
          :class="[
            'list-item',
            { 'dragging': isBeingDragged(child).value },
            getDropIndicatorClass(child).value
          ]"
          @dragstart="handleDragStart(child, item)"
          @dragover="handleDragOver($event, child)"
          @dragenter="handleDragEnter($event, child)"
          @dragleave="handleDragLeave($event, child)"
          @drop.stop="handleDrop($event, child, item)"
          @dragend="handleDragEnd"
        >
          {{ child.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-item {
  padding: 12px;
  margin: 4px 0;
  background: white;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: move;
  transition: all 0.2s;
  position: relative;
}

.list-item.dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.list-item:hover {
  background: #f5f5f5;
}

/* Drop indicator styles */
.drop-indicator-before::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
}

.drop-indicator-after::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 3px;
  background: #3b82f6;
  border-radius: 2px;
}

.drop-indicator-inside {
  background: #dbeafe !important;
  border-color: #3b82f6;
}

.children {
  margin-left: 24px;
  margin-top: 8px;
}
</style>
*/
