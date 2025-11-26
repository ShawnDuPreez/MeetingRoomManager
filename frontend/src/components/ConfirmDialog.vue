<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="500px" persistent>
    <v-card class="rounded-xl glass-dialog">
      <v-card-title class="d-flex align-center pa-4 bg-error text-white">
        <v-icon class="mr-2" color="white" size="28">mdi-alert-circle</v-icon>
        <span class="text-h6">Confirm Deletion</span>
      </v-card-title>
      <v-card-text class="pa-6">
        <div class="text-body-1">
          {{ message }}
        </div>
        <v-alert 
          v-if="warning"
          type="warning" 
          variant="tonal"
          class="mt-4"
          density="compact"
        >
          {{ warning }}
        </v-alert>
      </v-card-text>
      <v-divider />
      <v-card-actions class="pa-4 justify-end">
        <v-btn
          variant="text"
          @click="$emit('update:modelValue', false)"
          size="large"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="elevated"
          @click="$emit('confirm')"
          size="large"
        >
          <v-icon class="mr-1">mdi-delete</v-icon>
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  message: String,
  warning: String
});

defineEmits(['update:modelValue', 'confirm']);
</script>

<style scoped>
.glass-dialog {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.v-theme--dark .glass-dialog {
  background: rgba(30, 30, 30, 0.95) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

