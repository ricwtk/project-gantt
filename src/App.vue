<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import { ref } from 'vue'
const drawer = ref(false)
</script>

<template>
  <v-app>
    <v-navigation-drawer 
      v-model="drawer" 
      app 
      clipped 
      mobile-break-point="1000"
    ></v-navigation-drawer>

    <v-app-bar app dark dense clipped-left color="primary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-avatar tile height="75%" aspect-ratio="1"><v-img src="/icons/icon.png" contain></v-img></v-avatar>
      <v-toolbar-title class="pr-1">Project Gantt</v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- <v-icon :color="contentChanged ? 'red lighten-4' : 'primary'" :title="contentChanged ? 'click to save' : ''" @click="() => contentChanged ? justSave() : null">mdi-record</v-icon> -->
    </v-app-bar>


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
