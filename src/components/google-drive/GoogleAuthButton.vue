<script setup lang="ts">
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogIn, LogOut, UserX, User } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

interface Props {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  showDropdown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  showDropdown: true
})

interface Emits {
  (e: 'sign-in'): void
  (e: 'sign-out'): void
  (e: 'disconnect'): void
}

const emit = defineEmits<Emits>()

const authStore = useAuthStore()
const { signIn, signOut, disconnect } = useGoogleAuth()

const userInitials = computed(() => {
  if (!authStore.user) return ''
  const names = authStore.user.name.split(' ')
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const handleSignIn = async () => {
  try {
    await signIn()
    emit('sign-in')
  } catch (error) {
    console.error('Sign in error:', error)
  }
}

const handleSignOut = async () => {
  try {
    await signOut()
    emit('sign-out')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}

const handleDisconnect = async () => {
  try {
    await disconnect()
    emit('disconnect')
  } catch (error) {
    console.error('Disconnect error:', error)
  }
}
</script>

<template>
  <!-- Not Authenticated - Show Sign In Button -->
  <Button
    v-if="!authStore.isAuthenticated"
    @click="handleSignIn"
    :variant="variant"
    :size="size"
  >
    <LogIn class="w-4 h-4 mr-2" />
    Sign In with Google
  </Button>

  <!-- Authenticated - Show User Menu -->
  <div v-else>
    <!-- With Dropdown Menu -->
    <DropdownMenu v-if="showDropdown">
      <DropdownMenuTrigger as-child>
        <Button variant="ghost" class="relative h-10 w-10 rounded-full">
          <!-- User Image -->
          <div
            v-if="authStore.user?.imageUrl"
            class="h-10 w-10 rounded-full overflow-hidden"
          >
            <img
              :src="authStore.user.imageUrl"
              :alt="authStore.user.name"
              class="h-full w-full object-cover"
            />
          </div>
          <!-- User Initials -->
          <div
            v-else
            class="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium"
          >
            {{ userInitials }}
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" class="w-56">
        <!-- User Info -->
        <div class="px-2 py-1.5">
          <p class="font-medium text-sm">{{ authStore.user?.name }}</p>
          <p class="text-xs text-muted-foreground">{{ authStore.user?.email }}</p>
        </div>

        <DropdownMenuSeparator />

        <!-- Sign Out -->
        <DropdownMenuItem @click="handleSignOut">
          <LogOut class="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>

        <!-- Disconnect -->
        <DropdownMenuItem @click="handleDisconnect">
          <UserX class="w-4 h-4 mr-2" />
          Disconnect App
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <!-- Without Dropdown - Just Avatar -->
    <div v-else class="flex items-center space-x-2">
      <!-- User Image -->
      <div
        v-if="authStore.user?.imageUrl"
        class="h-8 w-8 rounded-full overflow-hidden"
      >
        <img
          :src="authStore.user.imageUrl"
          :alt="authStore.user.name"
          class="h-full w-full object-cover"
        />
      </div>
      <!-- User Initials -->
      <div
        v-else
        class="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium"
      >
        {{ userInitials }}
      </div>
      <!-- User Name -->
      <span class="text-sm font-medium">{{ authStore.user?.name }}</span>
    </div>
  </div>
</template>
