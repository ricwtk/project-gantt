import { createApp } from 'vue'
// import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const pgtheme = {
  dark: false,
  colors: {
    primary: '#009688',
    secondary: '#B2DFDB',
    accent: '#00BFA5'
  }
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'pgtheme',
    themes: {
      pgtheme
    }
  }
})

// Components
import App from './App.vue'

createApp(App).use(vuetify).mount('#app')
