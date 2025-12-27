<script setup>
import { onMounted } from 'vue'
import Header from './components/layout/Header.vue'
// import Toolbar from './components/layout/Toolbar.vue'
// import Sidebar from './components/layout/Sidebar.vue'
// import GanttChart from './components/gantt/GanttChart.vue'
import { useGoogleAuth } from './composables/useGoogleAuth'
import { useAuthStore } from './stores/auth'

const { initializeGoogleAPI } = useGoogleAuth()
const authStore = useAuthStore()

onMounted(async () => {
  // Initialize Google API but don't require authentication
  try {
    await initializeGoogleAPI()
  } catch (error) {
    console.warn('Google API initialization failed, continuing in offline mode:', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <Header />
    <RouterView />
  </div>
</template>
