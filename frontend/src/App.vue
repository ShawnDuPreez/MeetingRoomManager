<template>
  <v-app>
    <!-- App Bar with Navigation -->
    <v-app-bar color="primary" elevation="0" prominent>
      <v-container fluid>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-office-building</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">Meeting Room Manager</div>
              <div class="text-caption">Manage your workspace efficiently</div>
            </div>
          </div>
          
          <div class="d-flex align-center ml-auto">
            <theme-toggle class="mr-4" />
            
            <v-tabs 
              v-model="currentTab" 
              color="white"
              align-tabs="end"
            >
              <v-tab :to="{ name: 'Rooms' }" value="rooms">
                <v-icon class="mr-2">mdi-door</v-icon>
                Rooms
              </v-tab>
              <v-tab :to="{ name: 'Calendar' }" value="calendar">
                <v-icon class="mr-2">mdi-calendar-month</v-icon>
                Calendar
              </v-tab>
            </v-tabs>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import ThemeToggle from './components/ThemeToggle.vue';

const route = useRoute();
const currentTab = ref('rooms');
</script>

<style>
/* Global font */
* {
  font-family: 'Poppins', sans-serif;
}

.v-card-title {
  letter-spacing: 0.5px;
}

/* Enhanced shadows on hover */
.v-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  transition: box-shadow 0.3s ease;
}

.v-theme--dark .v-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
}

/* Border radius variations */
.rounded-lg {
  border-radius: 16px !important;
}

.rounded-xl {
  border-radius: 20px !important;
}

.rounded-2xl {
  border-radius: 24px !important;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.v-theme--dark ::-webkit-scrollbar-track {
  background: #2a2a2a;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.v-theme--dark ::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}
</style>
