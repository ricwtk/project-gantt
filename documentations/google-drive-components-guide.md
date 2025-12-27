# 📁 Google Drive Components - Complete Guide

## Overview

The `components/google-drive/` folder contains reusable components for Google Drive integration.

## 🔍 Original Status

**Mentioned in docs but NOT created:**
- ❌ `DriveFileList.vue` - Never implemented
- ❌ `GoogleAuthButton.vue` - Never implemented

**Already created:**
- ✅ `DriveFilePicker.vue` - Complete file picker dialog

## ✅ Current Status - All Components Created!

| Component | Status | Purpose |
|-----------|--------|---------|
| `DriveFilePicker.vue` | ✅ Existed | Full file picker dialog |
| `DriveFileList.vue` | ✅ **NOW CREATED** | Reusable file list |
| `GoogleAuthButton.vue` | ✅ **NOW CREATED** | Reusable auth button |

---

## 📦 Component Details

### 1. DriveFileList.vue

**Purpose:** Reusable file/folder list component

**Features:**
- ✅ Display files and folders
- ✅ Different icons for different file types
- ✅ Loading state
- ✅ Empty state
- ✅ Status badges (Folder/Project/Unsupported)
- ✅ Click handlers for files and folders
- ✅ Selected file highlighting
- ✅ Date formatting
- ✅ Responsive design

**Props:**
```typescript
interface Props {
  files: GoogleDriveFile[]
  loading?: boolean
  selectedFileId?: string | null
}
```

**Events:**
```typescript
interface Emits {
  (e: 'file-click', file: GoogleDriveFile): void
  (e: 'folder-click', file: GoogleDriveFile): void
}
```

**Usage:**
```vue
<script setup>
import DriveFileList from '@/components/google-drive/DriveFileList.vue'

const files = ref([])
const loading = ref(false)

const handleFileClick = (file) => {
  console.log('File clicked:', file)
}

const handleFolderClick = (folder) => {
  console.log('Folder clicked:', folder)
}
</script>

<template>
  <DriveFileList
    :files="files"
    :loading="loading"
    @file-click="handleFileClick"
    @folder-click="handleFolderClick"
  />
</template>
```

---

### 2. GoogleAuthButton.vue

**Purpose:** Reusable authentication button with user menu

**Features:**
- ✅ Sign in button (when not authenticated)
- ✅ User avatar/initials
- ✅ User dropdown menu
- ✅ Sign out option
- ✅ Disconnect app option
- ✅ Customizable variant and size
- ✅ Optional dropdown (can show just avatar)
- ✅ Events for tracking auth actions

**Props:**
```typescript
interface Props {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showDropdown?: boolean
}
```

**Events:**
```typescript
interface Emits {
  (e: 'sign-in'): void
  (e: 'sign-out'): void
  (e: 'disconnect'): void
}
```

**Usage Example 1: Full Button (Header)**
```vue
<script setup>
import GoogleAuthButton from '@/components/google-drive/GoogleAuthButton.vue'
</script>

<template>
  <GoogleAuthButton />
</template>
```

**Usage Example 2: Custom Variant**
```vue
<template>
  <GoogleAuthButton
    variant="outline"
    size="sm"
    @sign-in="handleSignIn"
    @sign-out="handleSignOut"
  />
</template>
```

**Usage Example 3: Just Avatar (No Dropdown)**
```vue
<template>
  <GoogleAuthButton :show-dropdown="false" />
</template>
```

---

### 3. DriveFilePicker.vue

**Purpose:** Complete file picker dialog for Google Drive

**Features:**
- ✅ Folder navigation with breadcrumbs
- ✅ Back button
- ✅ File filtering (.pgjson files)
- ✅ Loading states
- ✅ Error handling
- ✅ Now uses `DriveFileList` component

**Usage:**
```vue
<script setup>
import DriveFilePicker from '@/components/google-drive/DriveFilePicker.vue'

const showPicker = ref(false)

const handleFileSelected = (file) => {
  console.log('Selected:', file)
}
</script>

<template>
  <DriveFilePicker
    v-model:open="showPicker"
    @file-selected="handleFileSelected"
  />
</template>
```

---

## 🏗️ Component Architecture

### Hierarchy

```
Header.vue
└── GoogleAuthButton.vue
    ├── Sign In Button (not authenticated)
    └── User Menu (authenticated)
        ├── User Info
        ├── Sign Out
        └── Disconnect

DriveFilePicker.vue
├── Navigation (breadcrumb)
└── DriveFileList.vue
    ├── Loading State
    ├── Empty State
    └── File Items
        ├── Folders (navigate)
        └── Files (open)
```

### Data Flow

```
Component Layer
     │
     ├─> GoogleAuthButton
     │   └─> useGoogleAuth composable
     │       └─> auth.ts store
     │
     └─> DriveFilePicker
         └─> DriveFileList
             └─> useGoogleDrive composable
                 └─> Google Drive API
```

---

## 💡 Why Create Separate Components?

### Before (Monolithic)
```
DriveFilePicker.vue (300+ lines)
├── Auth logic
├── File list logic
├── Navigation logic
├── State management
└── UI rendering
```

### After (Modular)
```
GoogleAuthButton.vue (120 lines)
└── Auth UI only

DriveFileList.vue (150 lines)
└── File display only

DriveFilePicker.vue (100 lines)
└── Navigation + coordination
```

### Benefits:
1. **Reusability** - Use components anywhere
2. **Maintainability** - Smaller, focused files
3. **Testing** - Easy to test individually
4. **Readability** - Clear separation of concerns

---

## 🎯 Usage Scenarios

### Scenario 1: Simple File List

```vue
<script setup>
import DriveFileList from '@/components/google-drive/DriveFileList.vue'
import { useGoogleDrive } from '@/composables/useGoogleDrive'

const { listFiles } = useGoogleDrive()
const files = ref([])

onMounted(async () => {
  files.value = await listFiles('root')
})
</script>

<template>
  <DriveFileList
    :files="files"
    @file-click="handleFileClick"
  />
</template>
```

### Scenario 2: Auth Button in Settings

```vue
<template>
  <Card>
    <CardHeader>
      <CardTitle>Google Drive</CardTitle>
    </CardHeader>
    <CardContent>
      <GoogleAuthButton variant="outline" />
    </CardContent>
  </Card>
</template>
```

### Scenario 3: Custom File Browser

```vue
<script setup>
import DriveFileList from '@/components/google-drive/DriveFileList.vue'

const files = ref([])
const currentFolder = ref('root')

const handleFolderClick = async (folder) => {
  currentFolder.value = folder.id
  files.value = await listFiles(folder.id)
}
</script>

<template>
  <div>
    <h2>Browse: {{ currentFolder }}</h2>
    <DriveFileList
      :files="files"
      @folder-click="handleFolderClick"
    />
  </div>
</template>
```

---

## 🎨 Customization

### Styling DriveFileList

```vue
<template>
  <DriveFileList
    :files="files"
    class="custom-file-list"
  />
</template>

<style>
.custom-file-list {
  /* Your custom styles */
}
</style>
```

### Custom Icons

Edit `DriveFileList.vue`:
```typescript
const getFileIcon = (file: GoogleDriveFile) => {
  if (file.mimeType === 'application/pdf') return FilePdf
  if (file.mimeType.startsWith('image/')) return FileImage
  // Add more custom icons
  return File
}
```

### Custom Auth Button Text

Edit `GoogleAuthButton.vue`:
```vue
<Button @click="handleSignIn">
  <LogIn class="w-4 h-4 mr-2" />
  Connect to Drive  <!-- Custom text -->
</Button>
```

---

## 🔧 Integration Guide

### Step 1: Update Header

```vue
<!-- src/components/layout/Header.vue -->
<script setup>
import GoogleAuthButton from '@/components/google-drive/GoogleAuthButton.vue'
</script>

<template>
  <header>
    <h1>Project Gantt</h1>
    <GoogleAuthButton />
  </header>
</template>
```

### Step 2: Update DriveFilePicker

Already done! DriveFilePicker now uses DriveFileList internally.

### Step 3: Use in Other Components

```vue
<!-- Any component -->
<script setup>
import GoogleAuthButton from '@/components/google-drive/GoogleAuthButton.vue'
import DriveFileList from '@/components/google-drive/DriveFileList.vue'
</script>
```

---

## 📊 Component Comparison

| Feature | DriveFilePicker | DriveFileList | GoogleAuthButton |
|---------|----------------|---------------|------------------|
| **Navigation** | ✅ Yes | ❌ No | ❌ No |
| **File Display** | ✅ Via child | ✅ Yes | ❌ No |
| **Auth UI** | ❌ No | ❌ No | ✅ Yes |
| **Reusable** | ⚠️ Dialog only | ✅ Highly | ✅ Highly |
| **Standalone** | ❌ No | ✅ Yes | ✅ Yes |

---

## 🚀 Best Practices

### 1. Component Composition

```vue
<!-- Good: Compose smaller components -->
<DriveFilePicker>
  <DriveFileList />
</DriveFilePicker>

<!-- Avoid: One giant component -->
<GiantFilePickerWithEverything />
```

### 2. Event Naming

```vue
<!-- Consistent event names -->
@file-click="handleFileClick"
@folder-click="handleFolderClick"
@sign-in="handleSignIn"
```

### 3. Props Validation

```typescript
// Always define prop types
interface Props {
  files: GoogleDriveFile[]  // Clear type
  loading?: boolean         // Optional with ?
}
```

### 4. Error Handling

```vue
<script setup>
const handleFileClick = async (file) => {
  try {
    await openFile(file)
  } catch (error) {
    console.error('Error:', error)
    // Show user feedback
  }
}
</script>
```

---

## ✅ Summary

### What Was Created:

1. **DriveFileList.vue** ✅
   - Reusable file list component
   - Loading/empty states
   - File/folder icons
   - Status badges

2. **GoogleAuthButton.vue** ✅
   - Reusable auth button
   - User dropdown menu
   - Sign in/out/disconnect
   - Customizable

3. **Updated DriveFilePicker.vue** ✅
   - Now uses DriveFileList
   - Cleaner, more modular

### Benefits:

- ✅ **Modular** - Smaller, focused components
- ✅ **Reusable** - Use anywhere in app
- ✅ **Maintainable** - Easier to update
- ✅ **Testable** - Test individually
- ✅ **Professional** - Better architecture

Your Google Drive integration is now fully modular and production-ready! 🎉
