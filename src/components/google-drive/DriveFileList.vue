<script setup lang="ts">
import { computed } from 'vue'
import { Folder, File, FileText } from 'lucide-vue-next'
import type { GoogleDriveFile } from '@/types'

interface Props {
  files: GoogleDriveFile[]
  loading?: boolean
  selectedFileId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  selectedFileId: null
})

interface Emits {
  (e: 'file-click', file: GoogleDriveFile): void
  (e: 'folder-click', file: GoogleDriveFile): void
}

const emit = defineEmits<Emits>()

const isFolder = (file: GoogleDriveFile): boolean => {
  return file.mimeType === 'application/vnd.google-apps.folder'
}

const isProjectFile = (file: GoogleDriveFile): boolean => {
  return file.name.endsWith('.pgjson') || file.mimeType === 'application/vnd.project-gantt'
}

const getFileIcon = (file: GoogleDriveFile) => {
  if (isFolder(file)) return Folder
  if (isProjectFile(file)) return FileText
  return File
}

const getIconColor = (file: GoogleDriveFile): string => {
  if (isFolder(file)) return 'text-amber-500'
  if (isProjectFile(file)) return 'text-blue-500'
  return 'text-muted-foreground'
}

const handleFileClick = (file: GoogleDriveFile) => {
  if (isFolder(file)) {
    emit('folder-click', file)
  } else if (isProjectFile(file)) {
    emit('file-click', file)
  }
}

const isClickable = (file: GoogleDriveFile): boolean => {
  return isFolder(file) || isProjectFile(file)
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return ''
  const kb = bytes / 1024
  const mb = kb / 1024
  if (mb >= 1) return `${mb.toFixed(2)} MB`
  if (kb >= 1) return `${kb.toFixed(2)} KB`
  return `${bytes} bytes`
}
</script>

<template>
  <div class="space-y-1">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8 text-muted-foreground">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
      <p class="text-sm">Loading files...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="files.length === 0" class="text-center py-8 text-muted-foreground">
      <Folder class="w-12 h-12 mx-auto mb-2 opacity-50" />
      <p class="text-sm">No files found in this folder</p>
    </div>

    <!-- File List -->
    <div v-else class="space-y-1">
      <div
        v-for="file in files"
        :key="file.id"
        class="flex items-center space-x-3 p-2 rounded-md transition-colors"
        :class="{
          'hover:bg-muted cursor-pointer': isClickable(file),
          'bg-muted/50': selectedFileId === file.id,
          'opacity-50 cursor-not-allowed': !isClickable(file)
        }"
        @click="handleFileClick(file)"
      >
        <!-- Icon -->
        <component
          :is="getFileIcon(file)"
          class="w-5 h-5 flex-shrink-0"
          :class="getIconColor(file)"
        />

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ file.name }}</p>
          <div class="flex items-center space-x-2 text-xs text-muted-foreground">
            <span v-if="file.modifiedTime">{{ formatDate(file.modifiedTime) }}</span>
          </div>
        </div>

        <!-- Status Badge -->
        <div class="flex-shrink-0">
          <span
            v-if="isFolder(file)"
            class="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
          >
            Folder
          </span>
          <span
            v-else-if="isProjectFile(file)"
            class="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
          >
            Project
          </span>
          <span
            v-else
            class="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
          >
            Unsupported
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
