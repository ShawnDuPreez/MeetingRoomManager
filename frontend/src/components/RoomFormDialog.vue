<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="bg-primary text-white pa-4">
        <v-icon class="mr-2" color="white">
          {{ editingRoom?.id ? 'mdi-pencil' : 'mdi-plus-circle' }}
        </v-icon>
        {{ editingRoom?.id ? 'Edit Meeting Room' : 'Add New Meeting Room' }}
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            :model-value="roomForm.name"
            @update:model-value="updateForm('name', $event)"
            label="Room Name"
            placeholder="e.g., Conference Room A"
            variant="outlined"
            prepend-inner-icon="mdi-door"
            :rules="[v => !!v || 'Name is required']"
            class="mb-3"
          />
          
          <v-text-field
            :model-value="roomForm.location"
            @update:model-value="updateForm('location', $event)"
            label="Location"
            placeholder="e.g., 2nd Floor, East Wing"
            variant="outlined"
            prepend-inner-icon="mdi-map-marker"
            :rules="[v => !!v || 'Location is required']"
            class="mb-3"
          />
          
          <v-text-field
            :model-value="roomForm.capacity"
            @update:model-value="updateForm('capacity', $event)"
            label="Capacity (Optional)"
            placeholder="e.g., 10"
            type="number"
            variant="outlined"
            prepend-inner-icon="mdi-account-group"
            :rules="[v => !v || v > 0 || 'Capacity must be > 0']"
            class="mb-3"
            persistent-placeholder
            min="1"
          />
          
          <v-textarea
            :model-value="roomForm.equipment"
            @update:model-value="updateForm('equipment', $event)"
            label="Equipment (Optional)"
            placeholder="e.g., Projector, Whiteboard, Video Conferencing"
            variant="outlined"
            prepend-inner-icon="mdi-devices"
            rows="2"
            class="mb-3"
            persistent-placeholder
          />
          
          <v-textarea
            :model-value="roomForm.notes"
            @update:model-value="updateForm('notes', $event)"
            label="Notes (Optional)"
            placeholder="Additional information about this room"
            variant="outlined"
            prepend-inner-icon="mdi-note-text"
            rows="2"
            persistent-placeholder
          />
          
          <v-alert
            v-if="roomServerErrors.length"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            <div v-for="e in roomServerErrors" :key="e">• {{ e }}</div>
          </v-alert>
        </v-form>
      </v-card-text>
      
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4 d-flex justify-center">
        <v-btn 
          variant="text" 
          @click="$emit('update:modelValue', false)"
          class="text-none"
        >
          Cancel
        </v-btn>
        <v-btn 
          color="primary" 
          variant="elevated"
          @click="handleSave"
          class="text-none px-6"
        >
          Save Room
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  editingRoom: Object,
  roomForm: Object,
  roomFormValid: Boolean,
  roomServerErrors: Array
});

const emit = defineEmits(['update:modelValue', 'save', 'update:form']);

const formRef = ref(null);
const formValid = ref(false);

function updateForm(field, value) {
  emit('update:form', { ...props.roomForm, [field]: value });
}

async function handleSave() {
  if (formRef.value) {
    const valid = await formRef.value.validate();
    if (!valid.valid) return;
  }
  emit('save');
}
</script>

