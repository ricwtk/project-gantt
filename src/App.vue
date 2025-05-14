<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { reactive, ref } from 'vue'
import Drawer from "./components/Drawer.vue"
import { mdiPlus } from '@mdi/js'
const drawer = ref(false)
const currentFile = reactive({
  id: "",
  name: "",
  parents: [],
  isAppAuthorized: true
})
</script>

<template>
  <v-app>
    <v-app-bar dark dense clipped-left color="secondary" class="px-5">
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-avatar tile height="75%" aspect-ratio="1"><v-img src="/icon.png" contain></v-img></v-avatar>
      <v-toolbar-title class="pr-1">Project Gantt</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-icon :color="contentChanged ? 'red lighten-4' : 'primary'" :title="contentChanged ? 'click to save' : ''" @click="() => contentChanged ? justSave() : null">mdi-record</v-icon> -->
    </v-app-bar>

    <Drawer></Drawer>

    <v-main>
      <v-container>
        <v-row no-gutters class="title" align="end">
          <v-col>{{ currentFile.name ? fileNameForDisplay : "Unsaved file" }}</v-col>
          <v-col cols="auto" class="subtitle-2" v-if="currentFile.name.endsWith('.pgjson')">.pgjson</v-col>
          <v-col cols="auto" v-if="!currentFile.isAppAuthorized">
            <v-btn icon depressed color="red" title="This file cannot be edited. Click for more information." @click="cannotEditDialog = true"><v-icon>mdi-exclamation-thick</v-icon></v-btn>
          </v-col>
        </v-row>

        <!-- <gantt-chart v-for="gc,i in gantts" ref="gc" :key="i" :id="'gc' + i"
          :is-app-authorized="currentFile.isAppAuthorized"
          v-model="gantts[i]"
          @reorder-task="reorderTask($event,i)"
          @remove="removeGantt(i)"
        ></gantt-chart> -->

        <v-row no-gutters v-if="currentFile.isAppAuthorized">
          <v-col><v-btn tile block depressed style="background-color: white; border: 1px solid #ddd" title="new Gantt chart" @click="addNewGantt"><v-icon :icon="mdiPlus"></v-icon></v-btn></v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar v-model="showNotice" top>
      <v-row no-gutters justify="center">
        <v-col cols="auto">{{ notice }}</v-col>
      </v-row>
    </v-snackbar>
    
    
  </v-app>
  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>
