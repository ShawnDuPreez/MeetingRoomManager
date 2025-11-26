<template>
  <v-container class="py-8" fluid>
    <v-card elevation="2" class="rounded-lg">
      <v-card-title class="bg-primary text-white pa-4">
        <div class="d-flex align-center">
          <v-icon class="mr-2" color="white">mdi-calendar-month</v-icon>
          <div>
            <div class="text-h5">All Bookings Calendar</div>
            <div class="text-caption">View all meetings across all rooms</div>
          </div>
        </div>
      </v-card-title>

      <v-card-text class="pa-6">
        <v-alert 
          v-if="error" 
          type="error" 
          variant="tonal"
          class="mb-4"
          closable
        >
          {{ error }}
        </v-alert>

        <div v-if="loading" class="text-center py-12">
          <v-progress-circular
            indeterminate
            color="primary"
            size="48"
          />
          <div class="text-grey mt-4">Loading bookings...</div>
        </div>

        <div v-else>
          <div v-if="allBookings.length === 0" class="text-center py-12">
            <v-icon size="80" color="grey-lighten-1">mdi-calendar-blank</v-icon>
            <div class="text-h6 text-grey mt-4">No bookings scheduled</div>
            <div class="text-caption text-grey mt-2">Create bookings from the Rooms page</div>
          </div>

          <v-row v-else>
            <v-col 
              v-for="booking in sortedBookings" 
              :key="booking.id" 
              cols="12" 
              md="6" 
              lg="4"
            >
              <v-card 
                class="booking-calendar-card" 
                elevation="2"
                :color="getBookingColor(booking)"
                hover
              >
                <v-card-text class="pa-4">
                  <div class="d-flex justify-space-between align-start mb-3">
                    <v-chip 
                      size="small" 
                      color="white"
                      class="font-weight-bold"
                    >
                      {{ formatDateOnly(booking.start) }}
                    </v-chip>
                    <v-chip 
                      size="small" 
                      variant="outlined"
                      color="white"
                    >
                      {{ booking.roomName }}
                    </v-chip>
                  </div>

                  <div class="text-h6 font-weight-bold text-white mb-2">
                    {{ booking.title }}
                  </div>

                  <div class="d-flex align-center text-white mb-2">
                    <v-icon size="small" color="white" class="mr-2">mdi-clock-outline</v-icon>
                    <span class="text-body-2">
                      {{ formatTimeOnly(booking.start) }} – {{ formatTimeOnly(booking.end) }}
                    </span>
                  </div>

                  <div class="d-flex align-center text-white">
                    <v-icon size="small" color="white" class="mr-2">mdi-account</v-icon>
                    <span class="text-body-2">{{ booking.bookedBy }}</span>
                  </div>

                  <div v-if="booking.attendees" class="d-flex align-center text-white mt-1">
                    <v-icon size="small" color="white" class="mr-2">mdi-account-group</v-icon>
                    <span class="text-body-2">{{ booking.attendees }} attendees</span>
                  </div>

                  <div v-if="booking.description" class="text-caption text-white mt-2 opacity-90">
                    {{ booking.description }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api';

const allBookings = ref([]);
const rooms = ref([]);
const loading = ref(false);
const error = ref('');

const colors = [
  'blue-darken-1',
  'purple-darken-1',
  'teal-darken-1',
  'orange-darken-1',
  'pink-darken-1',
  'indigo-darken-1',
  'cyan-darken-1',
  'deep-purple-darken-1'
];

const sortedBookings = computed(() => {
  return [...allBookings.value].sort((a, b) => {
    return new Date(a.start) - new Date(b.start);
  });
});

function getBookingColor(booking) {
  const index = rooms.value.findIndex(r => r.id === booking.roomId);
  return colors[index % colors.length];
}

async function loadAllBookings() {
  loading.value = true;
  error.value = '';
  try {
    // First load all rooms
    const roomsResponse = await api.getRooms();
    rooms.value = roomsResponse.data;

    // Then load bookings for each room
    const bookingPromises = rooms.value.map(async (room) => {
      const { data } = await api.getRoomBookings(room.id);
      return data.map(booking => ({
        ...booking,
        roomName: room.name,
        roomLocation: room.location
      }));
    });

    const bookingsArrays = await Promise.all(bookingPromises);
    allBookings.value = bookingsArrays.flat();
  } catch (e) {
    error.value = 'Failed to load bookings';
  } finally {
    loading.value = false;
  }
}

function formatDateOnly(iso) {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return iso;
  }
}

function formatTimeOnly(iso) {
  try {
    const date = new Date(iso);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch {
    return iso;
  }
}

onMounted(() => {
  loadAllBookings();
});
</script>

<style scoped>
.booking-calendar-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.booking-calendar-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
}

.opacity-90 {
  opacity: 0.9;
}
</style>

