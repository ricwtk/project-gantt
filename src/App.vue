<script setup>
import { onMounted } from 'vue'
// import Header from './components/layout/Header.vue'
// import Toolbar from './components/layout/Toolbar.vue'
// import Sidebar from './components/layout/Sidebar.vue'
// import GanttChart from './components/gantt/GanttChart.vue'
// import { useGoogleAuth } from './composables/useGoogleAuth'
// import { useAuthStore } from './stores/auth'

// const { initializeGoogleAPI } = useGoogleAuth()
// const authStore = useAuthStore()

onMounted(async () => {
  // Initialize Google API but don't require authentication
  try {
    // await initializeGoogleAPI()
  } catch (error) {
    console.warn('Google API initialization failed, continuing in offline mode:', error)
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- <Header /> -->
    <!-- <Toolbar /> -->
    <main class="container mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main content area -->
        <div class="lg:col-span-9">
          <!-- <GanttChart /> -->
        </div>

        <!-- Sidebar with ads on desktop -->
        <aside class="lg:col-span-3">
          <!-- <Sidebar /> -->
        </aside>
      </div>
    </main>
  </div>
</template>
