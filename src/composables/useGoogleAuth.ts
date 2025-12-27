// src/composables/useGoogleAuth.ts
import { ref } from 'vue'
import { gapi } from 'gapi-script'
import { useAuthStore } from '../stores/auth'
import type { User } from '@/types'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY as string
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const SCOPES = 'https://www.googleapis.com/auth/drive.file'

interface GoogleAuthInstance {
  isSignedIn: {
    get(): boolean
    listen(callback: (isSignedIn: boolean) => void): void
  }
  currentUser: {
    get(): GoogleUser
  }
  signIn(): Promise<GoogleUser>
  signOut(): Promise<void>
  disconnect(): Promise<void>
}

interface GoogleUser {
  getBasicProfile(): GoogleProfile
  getAuthResponse(): { access_token: string }
}

interface GoogleProfile {
  getId(): string
  getName(): string
  getEmail(): string
  getImageUrl(): string
}

export function useGoogleAuth() {
  const authStore = useAuthStore()
  const isInitialized = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const initError = ref<string | null>(null)

  const initializeGoogleAPI = async (): Promise<void> => {
    if (isInitialized.value) return

    // If no credentials configured, skip initialization (offline mode)
    if (!CLIENT_ID || !API_KEY) {
      console.info('Google API credentials not configured. Running in offline mode.')
      initError.value = 'No credentials configured'
      return
    }

    isLoading.value = true

    try {
      await new Promise<void>((resolve, reject) => {
        gapi.load('client:auth2', {
          callback: resolve,
          onerror: reject,
        })
      })

      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })

      const authInstance = gapi.auth2.getAuthInstance() as GoogleAuthInstance

      // Listen for sign-in state changes
      authInstance.isSignedIn.listen(updateSigninStatus)

      // Handle the initial sign-in state
      updateSigninStatus(authInstance.isSignedIn.get())

      isInitialized.value = true
      initError.value = null
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('Error initializing Google API:', error)
      initError.value = errorMessage
      // Don't throw - allow app to continue in offline mode
    } finally {
      isLoading.value = false
    }
  }

  const updateSigninStatus = (isSignedIn: boolean): void => {
    if (isSignedIn) {
      const authInstance = gapi.auth2.getAuthInstance() as GoogleAuthInstance
      const user = authInstance.currentUser.get()
      const profile = user.getBasicProfile()

      const userData: User = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
      }

      authStore.setUser(userData)
      authStore.setAccessToken(user.getAuthResponse().access_token)
    } else {
      authStore.clearUser()
    }
  }

  const signIn = async (): Promise<void> => {
    if (!isInitialized.value) {
      throw new Error('Google API not initialized. Please configure credentials.')
    }

    try {
      const authInstance = gapi.auth2.getAuthInstance() as GoogleAuthInstance
      await authInstance.signIn()
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
    }
  }

  const signOut = async (): Promise<void> => {
    if (!isInitialized.value) return

    try {
      const authInstance = gapi.auth2.getAuthInstance() as GoogleAuthInstance
      await authInstance.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const disconnect = async (): Promise<void> => {
    if (!isInitialized.value) return

    try {
      const authInstance = gapi.auth2.getAuthInstance() as GoogleAuthInstance
      await authInstance.disconnect()
      authStore.clearUser()
    } catch (error) {
      console.error('Error disconnecting:', error)
      throw error
    }
  }

  return {
    isInitialized,
    isLoading,
    initError,
    initializeGoogleAPI,
    signIn,
    signOut,
    disconnect,
  }
}
