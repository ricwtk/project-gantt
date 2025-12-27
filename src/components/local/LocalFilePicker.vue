<script setup>
import { ref, watch } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Upload, File } from 'lucide-vue-next'
import { useGanttStore } from '@/stores/gantt'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open'])

const ganttStore = useGanttStore()
const fileInputRef = ref(null)
const selectedFile = ref(null)
const isDragging = ref(false)

const handleFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    selectedFile.value = file
    loadFile(file)
  }
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false

  const file = event.dataTransfer.files?.[0]
  if (file && (file.name.endsWith('.pgjson') || file.type === 'application/json')) {
    selectedFile.value = file
    loadFile(file)
  } else {
    alert('Please drop a valid .pgjson file')
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = () => {
  isDragging.value = false
}

const loadFile = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = JSON.parse(e.target.result)
      ganttStore.loadChartData(content)
      ganttStore.setCurrentFile({
        id: null,
        name: file.name.replace('.pgjson', ''),
        modified: false,
      })
      emit('update:open', false)
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Invalid file format. Please select a valid .pgjson file.')
    }
  }
  reader.onerror = () => {
    alert('Error reading file')
  }
  reader.readAsText(file)
}

watch(() => props.open, (isOpen) => {
  if (!isOpen) {
    selectedFile.value = null
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  }
})
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Open Local File</DialogTitle>
        <DialogDescription>
          Select a .pgjson file from your computer
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div
          class="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
          :class="{
            'border-primary bg-primary/5': isDragging,
            'border-border hover:border-primary/50': !isDragging,
          }"
          @drop="handleDrop"
          @dragover="handleDragOver"
          @dragleave="handleDragLeave"
        >
          <Upload class="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p class="text-sm font-medium mb-2">
            Drag and drop your .pgjson file here
          </p>
          <p class="text-xs text-muted-foreground mb-4">
            or
          </p>
          <Button @click="handleFileSelect" variant="outline">
            <File class="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </div>

        <input
          ref="fileInputRef"
          type="file"
          accept=".pgjson,application/json"
          class="hidden"
          @change="handleFileChange"
        />

        <div v-if="selectedFile" class="p-3 bg-muted rounded-md">
          <div class="flex items-center space-x-2">
            <File class="w-4 h-4 text-primary" />
            <span class="text-sm font-medium">{{ selectedFile.name }}</span>
            <span class="text-xs text-muted-foreground">
              ({{ (selectedFile.size / 1024).toFixed(2) }} KB)
            </span>
          </div>
        </div>

        <div class="text-sm text-muted-foreground space-y-1">
          <p class="font-medium">Note:</p>
          <ul class="list-disc list-inside space-y-1 text-xs">
            <li>Only .pgjson files are supported</li>
            <li>In offline mode, changes won't sync to Google Drive</li>
            <li>Use "Download" to save your work locally</li>
          </ul>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
