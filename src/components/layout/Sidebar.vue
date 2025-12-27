<script setup>
import { ref } from 'vue'
import AdSpace from './AdSpace.vue'

const showAds = ref(true)
</script>

<template>
  <div v-if="showAds" class="sticky top-4 space-y-4">
    <!-- Carbon Ads -->
    <AdSpace provider="carbon" :dismissible="false" />

    <!-- Support Button -->
    <AdSpace provider="support" :dismissible="true" />
  </div>
</template>
