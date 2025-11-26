import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

const vuetify = createVuetify({ 
  components, 
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      }
    }
  },
  defaults: {
    VBtn: {
      color: 'primary',
      variant: 'elevated',
    },
    VCard: {
      elevation: 2,
    }
  }
});

createApp(App).use(vuetify).use(router).use(VCalendar, {}).mount('#app');
