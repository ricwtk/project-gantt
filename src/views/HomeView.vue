<script setup lang="ts">
import Toolbar from '@/components/layout/Toolbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import GanttChart from '@/components/gantt/GanttChart.vue'
</script>

<template>
  <Toolbar />
  <main class="container mx-auto px-4 py-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Main content area -->
      <div class="lg:col-span-9">
         <GanttChart />
      </div>

      <!-- Sidebar with ads on desktop -->
      <aside class="lg:col-span-3">
        <Sidebar />
      </aside>
    </div>
  </main>
</template>
