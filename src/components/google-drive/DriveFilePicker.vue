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
import { Folder, ChevronLeft } from 'lucide-vue-next'
import DriveFileList from './DriveFileList.vue'
import { useGoogleDrive } from '@/composables/useGoogleDrive'
import { useGanttStore } from '@/stores/gantt'

const props = defineProps({
  open: Boolean,
})

const emit = defineEmits(['update:open', 'file-selected'])

const { listFiles, readFile, isLoading } = useGoogleDrive()
const ganttStore = useGanttStore()

const currentFolder = ref({ id: 'root', name: 'My Drive' })
const folderHistory = ref([])
const files = ref([])

watch(() => props.open, async (isOpen) => {
  if (isOpen) {
    await loadFiles(currentFolder.value.id)
  }
})

const loadFiles = async (folderId) => {
  try {
    files.value = await listFiles(folderId)
  } catch (error) {
    console.error('Error loading files:', error)
  }
}

const handleFolderClick = async (folder) => {
  folderHistory.value.push(currentFolder.value)
  currentFolder.value = { id: folder.id, name: folder.name }
  await loadFiles(folder.id)
}

const handleGoBack = async () => {
  if (folderHistory.value.length > 0) {
    currentFolder.value = folderHistory.value.pop()
    await loadFiles(currentFolder.value.id)
  }
}

const handleFileClick = async (file) => {
  try {
    const content = await readFile(file.id)
    ganttStore.loadChartData(content)
    ganttStore.setCurrentFile({
      id: file.id,
      name: file.name.replace('.pgjson', ''),
      modified: false,
    })
    emit('file-selected', file)
    emit('update:open', false)
  } catch (error) {
    console.error('Error reading file:', error)
    alert('Failed to open file')
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="$emit('update:open', $event)">
    <DialogContent class="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Open from Google Drive</DialogTitle>
        <DialogDescription>
          Select a .pgjson file to open
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4">
        <!-- Breadcrumb Navigation -->
        <div class="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            :disabled="folderHistory.length === 0"
            @click="handleGoBack"
          >
            <ChevronLeft class="w-4 h-4" />
          </Button>
          <div class="flex items-center space-x-2">
            <Folder class="w-4 h-4 text-amber-500" />
            <span class="font-medium">{{ currentFolder.name }}</span>
          </div>
        </div>

        <!-- File List Component -->
        <div class="max-h-[400px] overflow-y-auto">
          <DriveFileList
            :files="files"
            :loading="isLoading"
            @file-click="handleFileClick"
            @folder-click="handleFolderClick"
          />
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
