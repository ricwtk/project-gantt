import { createApp } from 'vue'
// import './style.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import colors from 'vuetify/util/colors'

const pgtheme = {
  dark: false,
  colors: {
    primary: colors.teal.base,
    secondary: colors.teal.lighten5,
    accent: colors.teal.accent4
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
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})

// Components
import App from './App.vue'

createApp(App).use(vuetify).mount('#app')
