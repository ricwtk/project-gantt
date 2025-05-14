<script setup>
import { mdiSecurity, mdiHelpCircle, mdiFilePlus, mdiFolderOpen, mdiContentSave, mdiContentSaveSettings, mdiLogin, mdiLogout, mdiExitRun } from '@mdi/js'
import { ref } from 'vue';
const drawer = true
const user_open = ref([])
const isSignedIn = ref(true)
</script>

<template>
  <v-navigation-drawer 
    v-model="drawer"
    >
    <!-- rail
    expand-on-hover -->
    <v-list v-model:opened="user_open" nav density="compact">
      <v-list-group value="account">
        
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
            subtitle="ricwtk@gmail.com"
            title="Richard Wong"
          >
          </v-list-item>
        </template>

        <v-list-item link @click="signInClick" title="Log in" :title.attr="'Log in'" v-if="!isSignedIn" :append-icon="mdiLogin"></v-list-item>
        <v-list-item link @click="signOutClick" title="Log out" :title.attr="'Log out'" v-if="isSignedIn" :append-icon="mdiLogout"></v-list-item>
        <v-list-item link @click="disconnectClick" title="Disconnect app" :title.attr="'Disconnect app'" v-if="isSignedIn" :append-icon="mdiExitRun"></v-list-item>
      </v-list-group>
    </v-list>
    <v-divider></v-divider>
    <v-list nav density="compact">
      <v-list-item link :prepend-icon="mdiSecurity" title="Privacy policy"></v-list-item>
      <v-list-item link :prepend-icon="mdiHelpCircle" title="Help"></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav density="compact">
      <v-list-item link :prepend-icon="mdiFilePlus" title="New"></v-list-item>
      <v-list-item link :prepend-icon="mdiFolderOpen" title="Open"></v-list-item>
      <v-list-item link :prepend-icon="mdiContentSave" title="Save"></v-list-item>
      <v-list-item link :prepend-icon="mdiContentSaveSettings" title="Save as"></v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list nav density="compact">
    </v-list>
    <v-spacer></v-spacer>
    <v-list nav density="compact">
      <v-footer>
      <v-col class="text-center" cols=12>
        Powered by <span style="cursor:pointer" @click="openSite('//vuejs.org/')">Vue</span> and <span style="cursor:pointer" @click="openSite('//vuetifyjs.com/')">Vuetify</span>, created by <span style="cursor:pointer" @click="openSite('//ricwtk.github.io')">R.ich.ard</span>
      </v-col>
    </v-footer>
    </v-list>
  </v-navigation-drawer>
</template>