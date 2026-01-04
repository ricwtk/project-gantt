import { ref, computed } from 'vue';

export function useDrag(emit: (event: string, payload: any) => void) {
  const draggedItem = ref<string | null>(null);
  const draggedFromParent = ref<string | null>(null);
  const dragOverItem = ref<string | null>(null);
  const dropPosition = ref<'before' | 'after' | 'inside' | null>(null); // 'before', 'after', 'inside'
  const isDragging = ref<boolean>(false);

  const handleDragStart = (item: string, parent: string | null = null) => {
    isDragging.value = true;
    draggedItem.value = item;
    draggedFromParent.value = parent;

    emit('drag-start', {
      item,
      parent,
      timestamp: Date.now()
    });
  };

  const handleDragOver = (e: DragEvent, item: string) => {
    e.preventDefault();

    // Calculate drop position based on mouse Y position
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    const itemHeight = rect.height;
    const threshold = itemHeight / 3;

    if (mouseY < threshold) {
      dropPosition.value = 'before';
    } else if (mouseY > itemHeight - threshold) {
      dropPosition.value = 'after';
    } else {
      dropPosition.value = 'inside';
    }

    dragOverItem.value = item;
  };

  const handleDragEnter = (e: DragEvent, item: string) => {
    e.preventDefault();

    emit('drag-enter', {
      item,
      draggedItem: draggedItem.value,
      timestamp: Date.now()
    });
  };

  const handleDragLeave = (e: DragEvent, item: string) => {
    // Only clear if we're actually leaving the element
    const el = e.currentTarget as HTMLElement;
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (el.contains(relatedTarget)) {
      return;
    }

    dropPosition.value = null;

    emit('drag-leave', {
      item,
      draggedItem: draggedItem.value,
      timestamp: Date.now()
    });
  };

  const handleDrop = (e: DragEvent, targetItem: string, targetParent: string | null = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedItem.value || draggedItem.value === targetItem) {
      return;
    }

    emit('drop', {
      draggedItem: draggedItem.value,
      draggedFromParent: draggedFromParent.value,
      targetItem,
      targetParent,
      dropPosition: dropPosition.value,
      timestamp: Date.now()
    });

    resetDragState();
  };

  const handleDragEnd = () => {
    emit('drag-end', {
      item: draggedItem.value,
      parent: draggedFromParent.value,
      timestamp: Date.now()
    });

    resetDragState();
  };

  const resetDragState = () => {
    isDragging.value = false;
    draggedItem.value = null;
    draggedFromParent.value = null;
    dragOverItem.value = null;
    dropPosition.value = null;
  };

  const isDraggedOver = (item: string) => {
    return computed(() => dragOverItem.value === item);
  };

  const isBeingDragged = (item: string) => {
    return computed(() => draggedItem.value === item);
  };

  const getDropIndicatorClass = (item: string) => {
    return computed(() => {
      if (dragOverItem.value !== item) return '';
      return `drop-indicator-${dropPosition.value}`;
    });
  };

  return {
    // State
    isDragging,
    draggedItem,
    dragOverItem,
    dropPosition,

    // Handlers
    handleDragStart,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleDragEnd,

    // Utilities
    isDraggedOver,
    isBeingDragged,
    getDropIndicatorClass,
    resetDragState
  };
}
