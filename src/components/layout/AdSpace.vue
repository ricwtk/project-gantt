<script setup>
import { ref, onMounted, watch } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Coffee, Heart } from 'lucide-vue-next'

const props = defineProps({
  provider: {
    type: String,
    default: 'carbon', // 'carbon' or 'support'
    validator: (value) => ['carbon', 'support'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  }
})

const isDismissed = ref(false)
const adLoaded = ref(false)
const carbonScriptLoaded = ref(false)

onMounted(() => {
  // Check if user previously dismissed this ad type
  const dismissKey = `ad-dismissed-${props.provider}`
  const dismissed = localStorage.getItem(dismissKey)

  if (dismissed) {
    const dismissedDate = new Date(dismissed)
    const now = new Date()
    const daysSince = (now - dismissedDate) / (1000 * 60 * 60 * 24)

    // Show again after 7 days
    if (daysSince < 7) {
      isDismissed.value = true
      return
    }
  }

  if (props.provider === 'carbon') {
    loadCarbonAds()
  }
})

const loadCarbonAds = () => {
  // Check if script already exists
  if (document.getElementById('_carbonads_js')) {
    carbonScriptLoaded.value = true
    return
  }

  // Create container if it doesn't exist
  const container = document.getElementById('carbon-container')
  if (!container) {
    setTimeout(loadCarbonAds, 100)
    return
  }

  // Load Carbon Ads script
  const script = document.createElement('script')
  script.async = true
  script.type = 'text/javascript'
  // Replace YOUR_CARBON_SERVE_ID with your actual Carbon Ads serve ID
  script.src = '//cdn.carbonads.com/carbon.js?serve=YOUR_CARBON_SERVE_ID&placement=yoursite'
  script.id = '_carbonads_js'

  script.onload = () => {
    adLoaded.value = true
    carbonScriptLoaded.value = true
  }

  script.onerror = () => {
    console.warn('Carbon Ads failed to load')
    adLoaded.value = false
  }

  container.appendChild(script)
}

const handleDismiss = () => {
  isDismissed.value = true
  const dismissKey = `ad-dismissed-${props.provider}`
  localStorage.setItem(dismissKey, new Date().toISOString())
}

// Watch for provider changes
watch(() => props.provider, (newProvider) => {
  if (newProvider === 'carbon' && !carbonScriptLoaded.value) {
    loadCarbonAds()
  }
})
</script>

<template>
  <div v-if="!isDismissed" class="ad-space">
    <!-- Carbon Ads -->
    <Card v-if="provider === 'carbon'" class="relative border-dashed overflow-hidden">
      <button
        v-if="dismissible"
        @click="handleDismiss"
        class="absolute top-2 right-2 z-10 p-1 hover:bg-muted rounded-sm transition-colors"
        aria-label="Dismiss ad"
      >
        <X class="w-3 h-3 text-muted-foreground" />
      </button>

      <CardContent class="p-4">
        <div class="text-xs text-muted-foreground mb-3 font-medium">SPONSORED</div>
        <div id="carbon-container" class="carbon-wrapper"></div>

        <!-- Fallback if ad doesn't load -->
        <div v-if="!adLoaded" class="text-center py-6 space-y-2">
          <Coffee class="w-8 h-8 mx-auto text-muted-foreground/50" />
          <p class="text-xs text-muted-foreground">
            Ad blocker detected?
          </p>
          <p class="text-xs text-muted-foreground">
            Consider supporting us instead
          </p>
        </div>
      </CardContent>
    </Card>

    <!-- Support/Ko-fi Banner -->
    <Card v-else-if="provider === 'support'" class="relative border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
      <button
        v-if="dismissible"
        @click="handleDismiss"
        class="absolute top-2 right-2 z-10 p-1 hover:bg-background/50 rounded-sm transition-colors"
        aria-label="Dismiss support banner"
      >
        <X class="w-3 h-3 text-muted-foreground" />
      </button>

      <CardContent class="p-4 space-y-3">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart class="w-5 h-5 text-primary" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold mb-1">Enjoying Project Gantt?</p>
            <p class="text-xs text-muted-foreground leading-relaxed">
              This tool is free and open source. Support development with a coffee!
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <Button
            as="a"
            href="https://ko-fi.com/YOUR_KOFI_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full bg-[#13C3FF] hover:bg-[#13C3FF]/90 text-white"
            size="sm"
          >
            <Coffee class="w-4 h-4 mr-2" />
            Support on Ko-fi
          </Button>

          <Button
            as="a"
            href="https://www.buymeacoffee.com/YOUR_BMC_USERNAME"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            class="w-full"
            size="sm"
          >
            <span class="mr-2">☕</span>
            Buy Me a Coffee
          </Button>
        </div>

        <p class="text-[10px] text-center text-muted-foreground">
          One-time or monthly support • No ads • Forever grateful
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<style>
/* Carbon Ads Custom Styling */
#carbonads {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  overflow: hidden;
  max-width: 330px;
  border-radius: 4px;
  text-align: left;
  font-size: 13px;
  line-height: 1.5;
}

#carbonads a {
  color: inherit;
  text-decoration: none;
}

#carbonads a:hover {
  color: hsl(var(--primary));
}

#carbonads span {
  position: relative;
  display: block;
  overflow: hidden;
}

#carbonads .carbon-wrap {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

#carbonads .carbon-img {
  display: block;
  line-height: 1;
  flex-shrink: 0;
}

#carbonads .carbon-img img {
  display: block;
  max-width: 130px;
  width: 130px;
  height: auto;
  border-radius: 4px;
}

#carbonads .carbon-text {
  display: block;
  font-size: 13px;
  line-height: 1.5;
  color: hsl(var(--foreground));
  flex: 1;
  min-width: 0;
}

#carbonads .carbon-poweredby {
  display: block;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  font-size: 9px;
  line-height: 1;
  color: hsl(var(--muted-foreground));
}

/* Dark mode adjustments */
.dark #carbonads {
  color: hsl(var(--foreground));
}

.dark #carbonads .carbon-text {
  color: hsl(var(--foreground));
}

/* Responsive */
@media (max-width: 1024px) {
  .ad-space {
    display: none;
  }
}

/* Animation */
.ad-space {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
