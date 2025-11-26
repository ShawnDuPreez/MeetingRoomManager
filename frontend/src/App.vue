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
          
          <v-tabs 
            v-model="currentTab" 
            color="white" 
            class="ml-auto"
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
      </v-container>
    </v-app-bar>

    <v-main class="bg-grey-lighten-4">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const currentTab = ref('rooms');
</script>

<style>
.v-card-title {
  letter-spacing: 0.5px;
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

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.rounded-lg {
  border-radius: 12px !important;
}
</style>
