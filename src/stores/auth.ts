// src/stores/auth.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)

  function setUser(userData: User): void {
    user.value = userData
  }

  function setAccessToken(token: string): void {
    accessToken.value = token
  }

  function clearUser(): void {
    user.value = null
    accessToken.value = null
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    setUser,
    setAccessToken,
    clearUser,
  }
})
