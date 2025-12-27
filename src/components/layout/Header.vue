<script setup>
import GoogleAuthButton from '@/components/google-drive/GoogleAuthButton.vue'
</script>

<template>
  <header class="border-b">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h1 class="text-2xl font-bold">Project Gantt</h1>
      </div>

      <div class="flex items-center space-x-4">
        <GoogleAuthButton />
      </div>
    </div>
  </header>
</template>
