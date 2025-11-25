<template>
    <v-app>
      <!-- App Bar -->
      <v-app-bar color="primary" elevation="0" prominent>
        <v-container fluid>
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-office-building</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">Meeting Room Manager</div>
              <div class="text-caption">Manage your workspace efficiently</div>
            </div>
          </div>
        </v-container>
      </v-app-bar>

      <v-main class="bg-grey-lighten-4">
        <v-container class="py-8" fluid>
          <v-row>
            <!-- Left Panel: Rooms -->
            <v-col cols="12" md="4">
              <v-card elevation="2" class="rounded-lg">
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
                      v-for="room in rooms"
                      :key="room.id"
                      @click="selectRoom(room)"
                      :active="room.id === selectedRoomId"
                      class="mb-2 rounded-lg"
                      color="primary"
                      :class="{ 'elevation-2': room.id === selectedRoomId }"
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
              <v-card elevation="2" class="rounded-lg">
                <v-card-title class="bg-primary pa-4">
                  <div class="d-flex align-center text-white mb-3">
                    <v-icon class="mr-2" color="white">mdi-calendar-clock</v-icon>
                    <div>
                      <div class="text-h6">Bookings</div>
                      <div class="text-caption" v-if="selectedRoom">{{ selectedRoom.name }}</div>
                    </div>
                  </div>
                  <v-btn
                    color="white"
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
                        v-for="b in bookings" 
                        :key="b.id" 
                        cols="12"
                      >
                        <v-card 
                          class="booking-card" 
                          elevation="1"
                          hover
                        >
                          <v-card-text>
                            <div class="d-flex justify-space-between align-start">
                              <div class="flex-grow-1">
                                <div class="d-flex align-center mb-2">
                                  <v-icon color="primary" class="mr-2">mdi-calendar-check</v-icon>
                                  <span class="text-h6 font-weight-medium">{{ b.title }}</span>
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
          <v-dialog v-model="roomDialog" max-width="600px" persistent>
            <v-card class="rounded-lg">
              <v-card-title class="bg-primary text-white pa-4">
                <v-icon class="mr-2" color="white">
                  {{ editingRoom?.id ? 'mdi-pencil' : 'mdi-plus-circle' }}
                </v-icon>
                {{ editingRoom?.id ? 'Edit Meeting Room' : 'Add New Meeting Room' }}
              </v-card-title>
              
              <v-card-text class="pa-6">
                <v-form ref="roomFormRef" v-model="roomFormValid">
                  <v-text-field
                    v-model="roomForm.name"
                    label="Room Name"
                    placeholder="e.g., Conference Room A"
                    variant="outlined"
                    prepend-inner-icon="mdi-door"
                    :rules="[v => !!v || 'Name is required']"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model="roomForm.location"
                    label="Location"
                    placeholder="e.g., 2nd Floor, East Wing"
                    variant="outlined"
                    prepend-inner-icon="mdi-map-marker"
                    :rules="[v => !!v || 'Location is required']"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model.number="roomForm.capacity"
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
                    v-model="roomForm.equipment"
                    label="Equipment (Optional)"
                    placeholder="e.g., Projector, Whiteboard, Video Conferencing"
                    variant="outlined"
                    prepend-inner-icon="mdi-devices"
                    rows="2"
                    class="mb-3"
                    persistent-placeholder
                  />
                  
                  <v-textarea
                    v-model="roomForm.notes"
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
                  @click="roomDialog = false"
                  class="text-none"
                >
                  Cancel
                </v-btn>
                <v-btn 
                  color="primary" 
                  variant="elevated"
                  @click="saveRoom"
                  class="text-none px-6"
                >
                  Save Room
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
          <!-- Booking Dialog -->
          <v-dialog v-model="bookingDialog" max-width="600px" persistent>
            <v-card class="rounded-lg">
              <v-card-title class="bg-primary text-white pa-4">
                <v-icon class="mr-2" color="white">
                  {{ editingBooking?.id ? 'mdi-pencil' : 'mdi-calendar-plus' }}
                </v-icon>
                {{ editingBooking?.id ? 'Edit Booking' : 'New Booking' }}
              </v-card-title>
              
              <v-card-text class="pa-6">
                <v-form ref="bookingFormRef" v-model="bookingFormValid">
                  <v-text-field
                    v-model="bookingForm.title"
                    label="Meeting Title"
                    placeholder="e.g., Team Standup, Client Meeting"
                    variant="outlined"
                    prepend-inner-icon="mdi-text"
                    :rules="[v => !!v || 'Title is required']"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model="bookingForm.bookedBy"
                    label="Booked By (Optional)"
                    placeholder="Your name"
                    variant="outlined"
                    prepend-inner-icon="mdi-account"
                    class="mb-3"
                    persistent-placeholder
                  />
                  
                  <v-text-field
                    v-model="bookingForm.start"
                    label="Start Date & Time"
                    type="datetime-local"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar-clock"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model="bookingForm.end"
                    label="End Date & Time"
                    type="datetime-local"
                    variant="outlined"
                    prepend-inner-icon="mdi-calendar-clock"
                    class="mb-3"
                  />
                  
                  <v-text-field
                    v-model.number="bookingForm.attendees"
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
                    v-model="bookingForm.description"
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
                  @click="bookingDialog = false"
                  class="text-none"
                >
                  Cancel
                </v-btn>
                <v-btn 
                  color="primary" 
                  variant="elevated"
                  @click="saveBooking"
                  class="text-none px-6"
                >
                  Save Booking
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
  
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
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import api from './api';
  
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
  
  const roomDialog = ref(false);
  const roomFormRef = ref(null);
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
  const bookingFormRef = ref(null);
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
    const form = roomFormRef.value;
    if (form) {
      const valid = await form.validate();
      if (!valid) return;
    }
    roomServerErrors.value = [];
    try {
      if (editingRoom.value?.id) {
        const { data } = await api.updateRoom(editingRoom.value.id, roomForm.value);
        const index = rooms.value.findIndex(r => r.id === data.id);
        rooms.value.splice(index, 1, data);
        showSuccess('Room updated successfully!');
      } else {
        const { data } = await api.createRoom(roomForm.value);
        rooms.value.push(data);
        if (!selectedRoomId.value) {
          selectedRoomId.value = data.id;
          loadBookings();
        }
        showSuccess('Room created successfully!');
      }
      roomDialog.value = false;
    } catch (e) {
      roomServerErrors.value = e.response?.data?.errors || ['Unexpected error'];
    }
  }
  
  async function deleteRoom(room) {
    if (!confirm(`Delete room "${room.name}"?`)) return;
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
    const form = bookingFormRef.value;
    if (form) {
      const valid = await form.validate();
      if (!valid) return;
    }
    bookingServerErrors.value = [];
    try {
      if (editingBooking.value?.id) {
        const { data } = await api.updateBooking(editingBooking.value.id, bookingForm.value);
        const index = bookings.value.findIndex(b => b.id === data.id);
        bookings.value.splice(index, 1, data);
        showSuccess('Booking updated successfully!');
      } else {
        const { data } = await api.createRoomBooking(selectedRoomId.value, bookingForm.value);
        bookings.value.push(data);
        showSuccess('Booking created successfully!');
      }
      bookingDialog.value = false;
    } catch (e) {
      bookingServerErrors.value = e.response?.data?.errors || ['Unexpected error'];
    }
  }
  
  async function deleteBooking(booking) {
    if (!confirm(`Delete booking "${booking.title}"?`)) return;
    try {
      await api.deleteBooking(booking.id);
      bookings.value = bookings.value.filter(b => b.id !== booking.id);
      showSuccess('Booking deleted successfully!');
    } catch (e) {
      const msg = e.response?.data?.message || 'Failed to delete booking';
      showError(msg);
    }
  }
  
  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
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
  </style>
  

