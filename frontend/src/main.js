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
    defaultTheme: localStorage.getItem('theme') || 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#FAFAFA',
          surface: '#FFFFFF',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#42A5F5',
          secondary: '#B0BEC5',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#66BB6A',
          warning: '#FFA726',
          background: '#121212',
          surface: '#1E1E1E',
        }
      }
    }
  },
  defaults: {
    global: {
      font: {
        family: 'Poppins, sans-serif',
      }
    },
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
