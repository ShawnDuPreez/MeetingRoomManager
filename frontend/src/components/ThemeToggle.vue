<template>
  <v-btn
    :icon="theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"
    variant="text"
    @click="toggleTheme"
    class="theme-toggle-btn"
  >
    <v-icon :class="{ 'rotate': isAnimating }"></v-icon>
  </v-btn>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';

const theme = useTheme();
const isAnimating = ref(false);

function toggleTheme() {
  isAnimating.value = true;
  
  const newTheme = theme.global.current.value.dark ? 'light' : 'dark';
  theme.global.name.value = newTheme;
  localStorage.setItem('theme', newTheme);
  
  setTimeout(() => {
    isAnimating.value = false;
  }, 300);
}
</script>

<style scoped>
.theme-toggle-btn {
  transition: transform 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

.rotate {
  animation: rotate 0.3s ease;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(180deg);
  }
}
</style>

