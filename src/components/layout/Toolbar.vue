<script setup>
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FilePlus, FolderOpen, Save, Settings, Download, Upload } from 'lucide-vue-next'
import { useGanttStore } from '@/stores/gantt'
import { useGoogleDrive } from '@/composables/useGoogleDrive'
import { useAuthStore } from '@/stores/auth'
import DriveFilePicker from '@/components/google-drive/DriveFilePicker.vue'
// import SettingsDialog from '@/components/layout/SettingsDialog.vue'
import LocalFilePicker from '@/components/local/LocalFilePicker.vue'

const ganttStore = useGanttStore()
const authStore = useAuthStore()
const { createFile, updateFile } = useGoogleDrive()

const showFilePicker = ref(false)
const showSettings = ref(false)
const showLocalFilePicker = ref(false)
const isSaving = ref(false)
const fileInputRef = ref(null)

const handleNew = () => {
  if (ganttStore.currentFile.modified) {
    if (!confirm('You have unsaved changes. Create a new file?')) {
      return
    }
  }
  ganttStore.resetChart()
}

const handleOpen = () => {
  if (authStore.isAuthenticated) {
    showFilePicker.value = true
  } else {
    showLocalFilePicker.value = true
  }
}

const handleSave = async () => {
  if (!authStore.isAuthenticated) {
    handleDownload()
    return
  }

  if (isSaving.value) return

  isSaving.value = true
  try {
    if (ganttStore.currentFile.id) {
      // Update existing file
      await updateFile(ganttStore.currentFile.id, ganttStore.chartData)
    } else {
      // Create new file
      const fileName = ganttStore.currentFile.name || 'Untitled Project'
      const file = await createFile(`${fileName}.pgjson`, ganttStore.chartData)
      ganttStore.setCurrentFile({
        id: file.id,
        name: fileName,
        modified: false,
      })
    }
  } catch (error) {
    console.error('Save error:', error)
    alert('Failed to save file')
  } finally {
    isSaving.value = false
  }
}

const handleSaveAs = async () => {
  if (!authStore.isAuthenticated) {
    handleDownload()
    return
  }

  const fileName = prompt('Enter file name:', ganttStore.currentFile.name)
  if (!fileName) return

  isSaving.value = true
  try {
    const file = await createFile(`${fileName}.pgjson`, ganttStore.chartData)
    ganttStore.setCurrentFile({
      id: file.id,
      name: fileName,
      modified: false,
    })
  } catch (error) {
    console.error('Save as error:', error)
    alert('Failed to save file')
  } finally {
    isSaving.value = false
  }
}

const handleDownload = () => {
  const fileName = ganttStore.currentFile.name || 'Untitled Project'
  const dataStr = JSON.stringify(ganttStore.chartData, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.pgjson`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)

  // Mark as saved if not authenticated
  if (!authStore.isAuthenticated) {
    ganttStore.currentFile.modified = false
  }
}

const handleUpload = () => {
  fileInputRef.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

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
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Invalid file format')
    }
  }
  reader.readAsText(file)

  // Reset input
  event.target.value = ''
}

const handleFileSelected = async (file) => {
  showFilePicker.value = false
  // File loading logic will be in DriveFilePicker component
}
</script>

<template>
  <div class="border-b bg-background">
    <div class="container mx-auto px-4 py-2">
      <div class="flex items-center space-x-2">
        <Button variant="ghost" size="sm" @click="handleNew">
          <FilePlus class="w-4 h-4 mr-2" />
          New
        </Button>

        <Button variant="ghost" size="sm" @click="handleOpen">
          <FolderOpen class="w-4 h-4 mr-2" />
          Open
        </Button>

        <Button variant="ghost" size="sm" @click="handleUpload">
          <Upload class="w-4 h-4 mr-2" />
          Upload
        </Button>

        <Button
          variant="ghost"
          size="sm"
          @click="handleSave"
          :disabled="isSaving"
        >
          <Save class="w-4 h-4 mr-2" />
          {{ isSaving ? 'Saving...' : authStore.isAuthenticated ? 'Save' : 'Save' }}
        </Button>

        <Button
          v-if="authStore.isAuthenticated"
          variant="ghost"
          size="sm"
          @click="handleSaveAs"
        >
          Save As
        </Button>

        <Button variant="ghost" size="sm" @click="handleDownload">
          <Download class="w-4 h-4 mr-2" />
          Download
        </Button>

        <Separator orientation="vertical" class="h-6" />

        <!-- <Button variant="ghost" size="sm" @click="showSettings = true">
          <Settings class="w-4 h-4 mr-2" />
          Settings
        </Button> -->

        <div class="flex-1" />

        <div class="text-sm text-muted-foreground">
          {{ ganttStore.currentFile.name }}
          <span v-if="ganttStore.currentFile.modified" class="text-destructive">*</span>
          <span v-if="!authStore.isAuthenticated" class="ml-2 text-amber-600">
            (Offline Mode)
          </span>
        </div>
      </div>
    </div>

    <!-- Hidden file input for upload -->
    <input
      ref="fileInputRef"
      type="file"
      accept=".pgjson,application/json"
      class="hidden"
      @change="handleFileUpload"
    />

    <DriveFilePicker
      v-if="authStore.isAuthenticated"
      v-model:open="showFilePicker"
      @file-selected="handleFileSelected"
    />

    <LocalFilePicker
      v-else
      v-model:open="showLocalFilePicker"
    />
  </div>
</template>
