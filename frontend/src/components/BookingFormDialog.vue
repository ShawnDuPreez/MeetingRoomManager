<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" max-width="600px" persistent>
    <v-card class="rounded-lg">
      <v-card-title class="bg-primary text-white pa-4">
        <v-icon class="mr-2" color="white">
          {{ editingBooking?.id ? 'mdi-pencil' : 'mdi-calendar-plus' }}
        </v-icon>
        {{ editingBooking?.id ? 'Edit Booking' : 'New Booking' }}
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            :model-value="bookingForm.title"
            @update:model-value="updateForm('title', $event)"
            label="Meeting Title"
            placeholder="e.g., Team Standup, Client Meeting"
            variant="outlined"
            prepend-inner-icon="mdi-text"
            :rules="[v => !!v || 'Title is required']"
            class="mb-3"
          />
          
          <v-text-field
            :model-value="bookingForm.bookedBy"
            @update:model-value="updateForm('bookedBy', $event)"
            label="Booked By (Optional)"
            placeholder="Your name"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            class="mb-3"
            persistent-placeholder
          />
          
          <v-text-field
            ref="startDateInput"
            :model-value="bookingForm.start"
            @update:model-value="updateForm('start', $event)"
            label="Start Date & Time"
            type="datetime-local"
            variant="outlined"
            prepend-inner-icon="mdi-calendar-clock"
            class="mb-3 datetime-picker-field"
            @click="openDateTimePicker('start')"
            @click:prepend-inner="openDateTimePicker('start')"
          />
          
          <v-text-field
            ref="endDateInput"
            :model-value="bookingForm.end"
            @update:model-value="updateForm('end', $event)"
            label="End Date & Time"
            type="datetime-local"
            variant="outlined"
            prepend-inner-icon="mdi-calendar-clock"
            class="mb-3 datetime-picker-field"
            @click="openDateTimePicker('end')"
            @click:prepend-inner="openDateTimePicker('end')"
          />
          
          <v-text-field
            :model-value="bookingForm.attendees"
            @update:model-value="updateForm('attendees', $event)"
            label="Number of Attendees (Optional)"
            placeholder="e.g., 5"
            type="number"
            variant="outlined"
            prepend-inner-icon="mdi-account-group"
            class="mb-3"
            persistent-placeholder
            min="1"
          />
          
          <v-textarea
            :model-value="bookingForm.description"
            @update:model-value="updateForm('description', $event)"
            label="Description (Optional)"
            placeholder="Meeting agenda or additional details"
            variant="outlined"
            prepend-inner-icon="mdi-text-box"
            rows="3"
            persistent-placeholder
          />
          
          <v-alert
            v-if="bookingServerErrors.length"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            <div v-for="e in bookingServerErrors" :key="e">• {{ e }}</div>
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
          Save Booking
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  editingBooking: Object,
  bookingForm: Object,
  bookingFormValid: Boolean,
  bookingServerErrors: Array
});

const emit = defineEmits(['update:modelValue', 'save', 'update:form']);

const formRef = ref(null);
const formValid = ref(false);
const startDateInput = ref(null);
const endDateInput = ref(null);

function updateForm(field, value) {
  emit('update:form', { ...props.bookingForm, [field]: value });
}

function openDateTimePicker(type) {
  const inputRef = type === 'start' ? startDateInput.value : endDateInput.value;
  if (inputRef) {
    const input = inputRef.$el.querySelector('input[type="datetime-local"]');
    if (input) {
      try {
        if (input.showPicker) {
          input.showPicker();
        } else {
          input.focus();
          input.click();
        }
      } catch (e) {
        input.focus();
        input.click();
      }
    }
  }
}

async function handleSave() {
  if (formRef.value) {
    const valid = await formRef.value.validate();
    if (!valid.valid) return;
  }
  emit('save');
}
</script>

<style scoped>
.datetime-picker-field :deep(input[type="datetime-local"]) {
  cursor: pointer !important;
  font-size: 16px !important;
  user-select: none;
}

.datetime-picker-field :deep(input[type="datetime-local"]:hover) {
  background-color: rgba(25, 118, 210, 0.04) !important;
}

.datetime-picker-field :deep(.v-field:hover) {
  background-color: rgba(25, 118, 210, 0.02);
  cursor: pointer;
}

.datetime-picker-field :deep(.v-field) {
  transition: background-color 0.2s ease;
}

.datetime-picker-field :deep(input[type="datetime-local"]::-webkit-calendar-picker-indicator) {
  cursor: pointer;
  padding: 8px;
  margin-left: 8px;
  border-radius: 4px;
  opacity: 0.7;
  transition: all 0.2s ease;
}

.datetime-picker-field :deep(input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover) {
  background-color: rgba(25, 118, 210, 0.15);
  opacity: 1;
  transform: scale(1.1);
}

.datetime-picker-field :deep(.v-field__input) {
  cursor: pointer !important;
}

.datetime-picker-field :deep(.v-field__prepend-inner) {
  cursor: pointer;
}
</style>

