<template>
  <v-container class="py-8" fluid>
    <v-row>
      <!-- Left Panel: Rooms -->
      <v-col cols="12" md="4">
        <v-card elevation="2" class="rounded-xl">
          <v-card-title class="d-flex align-center justify-space-between bg-primary pa-4">
            <div class="d-flex align-center">
              <v-icon class="mr-2" color="white">mdi-door</v-icon>
              <span class="text-h6 text-white">Meeting Rooms</span>
            </div>
            <v-chip size="small" color="white" text-color="primary">
              {{ rooms.length }}
            </v-chip>
          </v-card-title>
          
          <v-card-text class="pa-4">
            <v-btn 
              color="primary" 
              variant="elevated"
              size="large"
              class="mb-4 text-none"
              @click="openRoomDialog()"
              block
            >
              Add New Room
            </v-btn>

            <v-alert 
              v-if="roomsError" 
              type="error" 
              variant="tonal"
              class="mb-4"
              closable
            >
              {{ roomsError }}
            </v-alert>

            <div v-if="roomsLoading" class="text-center py-8">
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
              />
            </div>

            <v-list v-else class="bg-transparent">
              <v-list-item
                v-for="(room, index) in rooms"
                :key="room.id"
                @click="selectRoom(room)"
                :active="room.id === selectedRoomId"
                class="mb-2 rounded-xl stagger-item"
                color="primary"
                :class="{ 'elevation-2': room.id === selectedRoomId }"
                :style="{ animationDelay: `${index * 50}ms` }"
              >
                <template #prepend>
                  <v-avatar color="primary" size="40">
                    <v-icon color="white">mdi-door-open</v-icon>
                  </v-avatar>
                </template>
                
                <v-list-item-title class="font-weight-medium">
                  {{ room.name }}
                </v-list-item-title>
                <v-list-item-subtitle class="mt-1">
                  <v-icon size="x-small" class="mr-1">mdi-map-marker</v-icon>
                  {{ room.location }}
                  <span v-if="room.capacity" class="ml-2">
                    <v-icon size="x-small" class="mr-1">mdi-account-group</v-icon>
                    {{ room.capacity }}
                  </span>
                </v-list-item-subtitle>
                
                <template #append>
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    color="primary"
                    @click.stop="openRoomDialog(room)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click.stop="deleteRoom(room)"
                  />
                </template>
              </v-list-item>
              
              <v-list-item v-if="!rooms.length" class="text-center">
                <v-list-item-title class="text-grey">
                  <v-icon size="48" class="mb-2 d-block mx-auto">mdi-office-building-outline</v-icon>
                  <div>No rooms yet</div>
                  <div class="text-caption mt-1">Click "Add New Room" to get started</div>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Right Panel: Bookings -->
      <v-col cols="12" md="8">
        <v-card elevation="2" class="rounded-xl">
          <v-card-title class="bg-primary pa-4">
            <div class="d-flex align-center text-white mb-3">
              <v-icon class="mr-2" color="white">mdi-calendar-clock</v-icon>
              <div>
                <div class="text-h6">Bookings</div>
                <div class="text-caption" v-if="selectedRoom">{{ selectedRoom.name }}</div>
              </div>
            </div>
            <v-btn
              color="surface"
              variant="elevated"
              :disabled="!selectedRoom"
              class="text-none"
              @click="openBookingDialog()"
              block
            >
              New Booking
            </v-btn>
          </v-card-title>

          <v-card-text class="pa-4">
            <v-alert 
              v-if="bookingsError" 
              type="error" 
              variant="tonal"
              class="mb-4"
              closable
            >
              {{ bookingsError }}
            </v-alert>

            <div v-if="bookingsLoading" class="text-center py-12">
              <v-progress-circular
                indeterminate
                color="primary"
                size="48"
              />
            </div>

            <div v-else-if="!selectedRoom" class="text-center py-12">
              <v-icon size="80" color="grey-lighten-1">mdi-calendar-blank-outline</v-icon>
              <div class="text-h6 text-grey mt-4">Select a room to view bookings</div>
              <div class="text-caption text-grey mt-2">Choose a meeting room from the list to see its schedule</div>
            </div>

            <div v-else>
              <v-row v-if="bookings.length">
                <v-col 
                  v-for="(b, index) in bookings" 
                  :key="b.id" 
                  cols="12"
                >
                  <v-card 
                    class="booking-card rounded-xl stagger-item" 
                    elevation="1"
                    hover
                    :style="{ animationDelay: `${index * 50}ms` }"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-start">
                        <div class="flex-grow-1">
                          <div class="d-flex align-center mb-2">
                            <v-icon color="primary" class="mr-2">mdi-calendar-check</v-icon>
                            <span class="text-h6 font-weight-medium">{{ b.title }}</span>
                            <v-chip 
                              :color="getBookingStatus(b).color"
                              size="small"
                              class="ml-2"
                              variant="flat"
                            >
                              {{ getBookingStatus(b).label }}
                            </v-chip>
                          </div>
                          
                          <div class="d-flex align-center text-body-2 mb-1">
                            <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                            <span>{{ formatDate(b.start) }} – {{ formatDate(b.end) }}</span>
                          </div>
                          
                          <div class="d-flex align-center text-body-2">
                            <v-icon size="small" class="mr-2">mdi-account</v-icon>
                            <span>{{ b.bookedBy }}</span>
                            <span v-if="b.attendees" class="ml-4">
                              <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                              {{ b.attendees }} attendees
                            </span>
                          </div>
                          
                          <div v-if="b.description" class="text-body-2 text-grey mt-2">
                            {{ b.description }}
                          </div>
                        </div>
                        
                        <div class="ml-4">
                          <v-btn
                            icon="mdi-pencil"
                            variant="text"
                            size="small"
                            color="primary"
                            @click="openBookingDialog(b)"
                          />
                          <v-btn
                            icon="mdi-delete"
                            variant="text"
                            size="small"
                            color="error"
                            @click="deleteBooking(b)"
                          />
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              
              <div v-else class="text-center py-12">
                <v-icon size="64" color="grey-lighten-1">mdi-calendar-blank</v-icon>
                <div class="text-h6 text-grey mt-4">No bookings yet</div>
                <div class="text-caption text-grey mt-2">Click "New Booking" to schedule a meeting</div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Room Dialog -->
    <room-form-dialog
      v-model="roomDialog"
      :editing-room="editingRoom"
      :room-form="roomForm"
      :room-form-valid="roomFormValid"
      :room-server-errors="roomServerErrors"
      @save="saveRoom"
      @update:form="roomForm = $event"
    />

    <!-- Booking Dialog -->
    <booking-form-dialog
      v-model="bookingDialog"
      :editing-booking="editingBooking"
      :booking-form="bookingForm"
      :booking-form-valid="bookingFormValid"
      :booking-server-errors="bookingServerErrors"
      @save="saveBooking"
      @update:form="bookingForm = $event"
    />

    <!-- Confirmation Dialog -->
    <confirm-dialog
      v-model="confirmDialog.show"
      :message="confirmDialog.message"
      :warning="confirmDialog.warning"
      @confirm="confirmDelete"
    />

    <!-- Global snackbar -->
    <v-snackbar 
      v-model="snackbar.show" 
      location="bottom right"
      :color="snackbar.color || 'error'"
      :timeout="4000"
      elevation="6"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">{{ snackbar.icon || 'mdi-alert-circle' }}</v-icon>
        {{ snackbar.message }}
      </div>
      <template #actions>
        <v-btn
          icon="mdi-close"
          size="small"
          @click="snackbar.show = false"
        />
      </template>
    </v-snackbar>

    <!-- Success Animation -->
    <success-checkmark v-model:show="showSuccessAnimation" :message="successMessage" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api';
import RoomFormDialog from '../components/RoomFormDialog.vue';
import BookingFormDialog from '../components/BookingFormDialog.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
import SuccessCheckmark from '../components/SuccessCheckmark.vue';

const rooms = ref([]);
const roomsLoading = ref(false);
const roomsError = ref('');
const selectedRoomId = ref(null);
const selectedRoom = computed(() =>
  rooms.value.find(r => r.id === selectedRoomId.value) || null
);

const bookings = ref([]);
const bookingsLoading = ref(false);
const bookingsError = ref('');

const snackbar = ref({ show: false, message: '', color: 'error', icon: 'mdi-alert-circle' });

const showSuccessAnimation = ref(false);
const successMessage = ref('Success!');

const confirmDialog = ref({ 
  show: false, 
  message: '', 
  warning: '',
  onConfirm: null 
});

const roomDialog = ref(false);
const roomFormValid = ref(false);
const editingRoom = ref(null);
const roomForm = ref({
  name: '',
  location: '',
  capacity: null,
  equipment: '',
  notes: ''
});
const roomServerErrors = ref([]);

const bookingDialog = ref(false);
const bookingFormValid = ref(false);
const editingBooking = ref(null);
const bookingForm = ref({
  title: '',
  bookedBy: '',
  start: '',
  end: '',
  description: '',
  attendees: null
});
const bookingServerErrors = ref([]);

function showError(message) {
  snackbar.value = { 
    show: true, 
    message, 
    color: 'error',
    icon: 'mdi-alert-circle' 
  };
}

function showSuccess(message) {
  snackbar.value = { 
    show: true, 
    message, 
    color: 'success',
    icon: 'mdi-check-circle' 
  };
}

function confirmDelete() {
  if (confirmDialog.value.onConfirm) {
    confirmDialog.value.onConfirm();
  }
  confirmDialog.value.show = false;
}

async function loadRooms() {
  roomsLoading.value = true;
  roomsError.value = '';
  try {
    const { data } = await api.getRooms();
    rooms.value = data;
    if (!selectedRoomId.value && rooms.value.length) {
      selectedRoomId.value = rooms.value[0].id;
      loadBookings();
    }
  } catch (e) {
    roomsError.value = 'Failed to load rooms';
    showError(roomsError.value);
  } finally {
    roomsLoading.value = false;
  }
}

async function loadBookings() {
  if (!selectedRoomId.value) return;
  bookingsLoading.value = true;
  bookingsError.value = '';
  try {
    const { data } = await api.getRoomBookings(selectedRoomId.value);
    bookings.value = data;
  } catch (e) {
    bookingsError.value = 'Failed to load bookings';
    showError(bookingsError.value);
  } finally {
    bookingsLoading.value = false;
  }
}

function selectRoom(room) {
  selectedRoomId.value = room.id;
  loadBookings();
}

function openRoomDialog(room = null) {
  editingRoom.value = room;
  roomServerErrors.value = [];
  if (room) {
    roomForm.value = { ...room };
  } else {
    roomForm.value = {
      name: '',
      location: '',
      capacity: null,
      equipment: '',
      notes: ''
    };
  }
  roomDialog.value = true;
}

async function saveRoom() {
  roomServerErrors.value = [];
  try {
    if (editingRoom.value?.id) {
      const { data } = await api.updateRoom(editingRoom.value.id, roomForm.value);
      const index = rooms.value.findIndex(r => r.id === data.id);
      rooms.value.splice(index, 1, data);
      roomDialog.value = false;
      successMessage.value = 'Room updated successfully!';
      showSuccessAnimation.value = true;
    } else {
      const { data } = await api.createRoom(roomForm.value);
      rooms.value.push(data);
      if (!selectedRoomId.value) {
        selectedRoomId.value = data.id;
        loadBookings();
      }
      roomDialog.value = false;
      successMessage.value = 'Room created successfully!';
      showSuccessAnimation.value = true;
    }
  } catch (e) {
    roomServerErrors.value = e.response?.data?.errors || ['Unexpected error'];
  }
}

function deleteRoom(room) {
  confirmDialog.value = {
    show: true,
    message: `Are you sure you want to delete the room "${room.name}"?`,
    warning: 'This action cannot be undone. All bookings for this room will also be deleted.',
    onConfirm: async () => {
      try {
        await api.deleteRoom(room.id);
        rooms.value = rooms.value.filter(r => r.id !== room.id);
        if (selectedRoomId.value === room.id) {
          selectedRoomId.value = rooms.value[0]?.id || null;
          bookings.value = [];
          if (selectedRoomId.value) await loadBookings();
        }
        showSuccess('Room deleted successfully!');
      } catch (e) {
        const msg = e.response?.data?.message || 'Failed to delete room';
        showError(msg);
      }
    }
  };
}

function openBookingDialog(booking = null) {
  bookingServerErrors.value = [];
  editingBooking.value = booking;
  if (booking) {
    bookingForm.value = { ...booking };
  } else {
    bookingForm.value = {
      title: '',
      bookedBy: '',
      start: '',
      end: '',
      description: '',
      attendees: null
    };
  }
  bookingDialog.value = true;
}

async function saveBooking() {
  bookingServerErrors.value = [];
  try {
    if (editingBooking.value?.id) {
      const { data } = await api.updateBooking(editingBooking.value.id, bookingForm.value);
      const index = bookings.value.findIndex(b => b.id === data.id);
      bookings.value.splice(index, 1, data);
      bookingDialog.value = false;
      successMessage.value = 'Booking updated successfully!';
      showSuccessAnimation.value = true;
    } else {
      const { data } = await api.createRoomBooking(selectedRoomId.value, bookingForm.value);
      bookings.value.push(data);
      bookingDialog.value = false;
      successMessage.value = 'Booking created successfully!';
      showSuccessAnimation.value = true;
    }
  } catch (e) {
    bookingServerErrors.value = e.response?.data?.errors || ['Unexpected error'];
  }
}

function deleteBooking(booking) {
  confirmDialog.value = {
    show: true,
    message: `Are you sure you want to delete the booking "${booking.title}"?`,
    warning: 'This action cannot be undone.',
    onConfirm: async () => {
      try {
        await api.deleteBooking(booking.id);
        bookings.value = bookings.value.filter(b => b.id !== booking.id);
        showSuccess('Booking deleted successfully!');
      } catch (e) {
        const msg = e.response?.data?.message || 'Failed to delete booking';
        showError(msg);
      }
    }
  };
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function getBookingStatus(booking) {
  const now = new Date();
  const start = new Date(booking.start);
  const end = new Date(booking.end);
  
  if (now < start) {
    return { status: 'upcoming', color: '#2196F3', label: 'Upcoming' };
  } else if (now >= start && now <= end) {
    return { status: 'ongoing', color: '#4CAF50', label: 'Ongoing' };
  } else {
    return { status: 'past', color: '#9E9E9E', label: 'Past' };
  }
}

onMounted(() => {
  loadRooms();
});
</script>

<style scoped>
.booking-card {
  transition: all 0.3s ease;
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.booking-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

.v-list-item {
  transition: all 0.2s ease;
}

.v-list-item:hover {
  transform: translateX(4px);
}

.rounded-lg {
  border-radius: 12px !important;
}

/* Stagger animation */
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  animation: fadeSlideIn 0.4s ease-out both;
}
</style>

