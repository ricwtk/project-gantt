<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Check, X } from 'lucide-vue-next'

interface Props {
  modelValue: string | null
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Task Color'
})

interface Emits {
  (e: 'update:modelValue', value: string | null): void
}

const emit = defineEmits<Emits>()

const isOpen = ref(false)
const customColor = ref('')

// Predefined color palette
const colorPresets = [
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Lime', value: '#84cc16' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Gray', value: '#6b7280' },
]

const selectedColor = computed(() => props.modelValue)

const displayColor = computed(() => {
  return props.modelValue || '#e5e7eb'
})

const handleColorSelect = (color: string) => {
  emit('update:modelValue', color)
  isOpen.value = false
}

const handleClearColor = () => {
  emit('update:modelValue', null)
  customColor.value = ''
  isOpen.value = false
}

const handleCustomColor = () => {
  if (customColor.value && /^#[0-9A-F]{6}$/i.test(customColor.value)) {
    emit('update:modelValue', customColor.value)
    customColor.value = ''
    isOpen.value = false
  }
}

const isValidHex = computed(() => {
  return /^#[0-9A-F]{6}$/i.test(customColor.value)
})
</script>

<template>
  <div class="space-y-2">
    <Label v-if="label">{{ label }}</Label>

    <Popover v-model:open="isOpen">
      <PopoverTrigger as-child>
        <Button
          variant="outline"
          class="w-full justify-start text-left font-normal"
        >
          <div class="flex items-center space-x-2 w-full">
            <div
              class="w-6 h-6 rounded border-2 flex-shrink-0"
              :style="{ backgroundColor: displayColor }"
              :class="{
                'border-border': selectedColor,
                'border-dashed border-muted-foreground': !selectedColor
              }"
            />
            <span class="flex-1">
              {{ selectedColor || 'No color selected' }}
            </span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent class="w-80">
        <div class="space-y-4">
          <div>
            <h4 class="font-medium text-sm mb-3">Preset Colors</h4>
            <div class="grid grid-cols-6 gap-2">
              <button
                v-for="color in colorPresets"
                :key="color.value"
                type="button"
                class="w-10 h-10 rounded border-2 transition-all hover:scale-110 relative group"
                :style="{ backgroundColor: color.value }"
                :class="{
                  'border-primary ring-2 ring-primary ring-offset-2': selectedColor === color.value,
                  'border-border': selectedColor !== color.value
                }"
                @click="handleColorSelect(color.value)"
                :title="color.name"
              >
                <Check
                  v-if="selectedColor === color.value"
                  class="w-5 h-5 text-white absolute inset-0 m-auto drop-shadow"
                />

                <!-- Tooltip on hover -->
                <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-md">
                  {{ color.name }}
                </span>
              </button>
            </div>
          </div>

          <div class="border-t pt-4">
            <h4 class="font-medium text-sm mb-3">Custom Color</h4>
            <div class="flex space-x-2">
              <div class="flex-1">
                <Input
                  v-model="customColor"
                  placeholder="#000000"
                  class="font-mono"
                  @keyup.enter="handleCustomColor"
                />
                <p class="text-xs text-muted-foreground mt-1">
                  Enter hex color (e.g., #FF5733)
                </p>
              </div>
              <Button
                @click="handleCustomColor"
                :disabled="!isValidHex"
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>

          <div class="border-t pt-4">
            <Button
              variant="outline"
              class="w-full"
              @click="handleClearColor"
            >
              <X class="w-4 h-4 mr-2" />
              Clear Color
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  </div>
</template>

<style scoped>
/* Smooth transitions */
button {
  transition: all 0.2s ease;
}
</style>
