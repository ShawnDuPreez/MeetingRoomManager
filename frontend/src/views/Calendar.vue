<template>
  <v-container class="py-8" fluid>
    <v-row>
      <v-col cols="12">
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

          <v-card-text class="pa-8">
            <v-alert 
              v-if="error" 
              type="error" 
              variant="tonal"
              class="mb-6"
              closable
            >
              {{ error }}
            </v-alert>

            <div v-if="loading" class="text-center py-16">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
              />
              <div class="text-h6 text-grey mt-6">Loading bookings...</div>
            </div>

            <div v-else>
              <VCalendar
                :attributes="calendarAttributes"
                @dayclick="onDayClick"
                expanded
                borderless
                class="custom-calendar"
              />

              <!-- Booking Details Dialog -->
              <v-dialog v-model="detailsDialog" max-width="900px">
                <v-card class="rounded-lg" elevation="8">
                  <v-card-title class="pa-6" style="background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);">
                    <div class="d-flex align-center text-white">
                      <v-icon class="mr-3" color="white" size="32">mdi-calendar-check</v-icon>
                      <div>
                        <div class="text-h5 font-weight-bold">{{ formatSelectedDate }}</div>
                        <div class="text-caption mt-1 opacity-90">
                          {{ selectedDateBookings.length }} booking{{ selectedDateBookings.length !== 1 ? 's' : '' }}
                        </div>
                      </div>
                    </div>
                  </v-card-title>

                  <v-card-text class="pa-6">
                    <div v-if="selectedDateBookings.length === 0" class="text-center py-12">
                      <v-icon size="80" color="grey-lighten-1">mdi-calendar-blank</v-icon>
                      <div class="text-h6 text-grey mt-4">No bookings for this date</div>
                      <div class="text-caption text-grey mt-2">Select a date with a colored dot to view bookings</div>
                    </div>

                    <v-row v-else>
                      <v-col 
                        v-for="booking in selectedDateBookings" 
                        :key="booking.id" 
                        cols="12"
                      >
                        <v-card 
                          class="booking-detail-card" 
                          elevation="3"
                          :color="getBookingColor(booking)"
                        >
                          <v-card-text class="pa-5">
                            <div class="text-h5 font-weight-bold text-white mb-4">
                              {{ booking.title }}
                            </div>

                            <div class="d-flex align-center text-white mb-3">
                              <v-icon color="white" class="mr-3">mdi-door</v-icon>
                              <div>
                                <div class="text-body-1 font-weight-medium">{{ booking.roomName }}</div>
                                <div class="text-caption opacity-90">{{ booking.roomLocation }}</div>
                              </div>
                            </div>

                            <div class="d-flex align-center text-white mb-3">
                              <v-icon color="white" class="mr-3">mdi-clock-outline</v-icon>
                              <span class="text-h6 font-weight-medium">
                                {{ formatTimeOnly(booking.start) }} – {{ formatTimeOnly(booking.end) }}
                              </span>
                            </div>

                            <div class="d-flex align-center text-white mb-3">
                              <v-icon color="white" class="mr-3">mdi-account</v-icon>
                              <span class="text-body-1">{{ booking.bookedBy }}</span>
                            </div>

                            <div v-if="booking.attendees" class="d-flex align-center text-white mb-3">
                              <v-icon color="white" class="mr-3">mdi-account-group</v-icon>
                              <span class="text-body-1">{{ booking.attendees }} attendees</span>
                            </div>

                            <v-divider v-if="booking.description" class="my-4 opacity-30" />

                            <div v-if="booking.description" class="text-body-1 text-white opacity-90" style="line-height: 1.6;">
                              {{ booking.description }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-divider />

                  <v-card-actions class="pa-6 justify-end">
                    <v-btn
                      color="primary"
                      variant="elevated"
                      size="large"
                      @click="detailsDialog = false"
                      class="px-8"
                    >
                      <v-icon class="mr-2">mdi-close</v-icon>
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

              <!-- Legend -->
              <v-card class="mt-6 rounded-lg" elevation="3">
                <v-card-text class="pa-6">
                  <div class="d-flex align-center mb-4">
                    <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
                    <span class="text-h6 font-weight-bold">Room Legend</span>
                  </div>
                  <v-divider class="mb-4" />
                  <div class="d-flex flex-wrap" style="gap: 20px;">
                    <div 
                      v-for="(room, index) in rooms" 
                      :key="room.id"
                      class="d-flex align-center legend-item"
                    >
                      <div 
                        :style="{ backgroundColor: colors[index % colors.length] }" 
                        class="dot-legend mr-3"
                      ></div>
                      <div>
                        <div class="text-body-1 font-weight-medium">{{ room.name }}</div>
                        <div class="text-caption text-grey">{{ room.location }}</div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../api';

const allBookings = ref([]);
const rooms = ref([]);
const loading = ref(false);
const error = ref('');
const detailsDialog = ref(false);
const selectedDate = ref(null);

const colors = [
  '#1976D2', // blue
  '#9C27B0', // purple
  '#00796B', // teal
  '#F57C00', // orange
  '#E91E63', // pink
  '#3F51B5', // indigo
  '#00ACC1', // cyan
  '#512DA8'  // deep purple
];

// Prepare calendar attributes (dots for bookings)
const calendarAttributes = computed(() => {
  const attributes = [];
  
  allBookings.value.forEach((booking) => {
    const roomIndex = rooms.value.findIndex(r => r.id === booking.roomId);
    const color = colors[roomIndex % colors.length];
    
    attributes.push({
      key: booking.id,
      dates: new Date(booking.start),
      dot: {
        color: color,
        class: 'booking-dot'
      },
      customData: booking
    });
  });
  
  return attributes;
});

// Get bookings for selected date
const selectedDateBookings = computed(() => {
  if (!selectedDate.value) return [];
  
  const selected = new Date(selectedDate.value);
  selected.setHours(0, 0, 0, 0);
  
  return allBookings.value.filter(booking => {
    const bookingDate = new Date(booking.start);
    bookingDate.setHours(0, 0, 0, 0);
    return bookingDate.getTime() === selected.getTime();
  });
});

const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return '';
  return new Date(selectedDate.value).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
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

function onDayClick(day) {
  selectedDate.value = day.date;
  detailsDialog.value = true;
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
.booking-detail-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.booking-detail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25) !important;
}

.opacity-90 {
  opacity: 0.9;
}

.dot-legend {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
  flex-shrink: 0;
}

.legend-item {
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: default;
}

.legend-item:hover {
  background-color: #f5f5f5;
  transform: translateY(-1px);
}

.gap-4 {
  gap: 1rem;
}

:deep(.custom-calendar) {
  width: 100%;
  border: none;
  font-family: inherit;
  --vc-gray-900: #1a1a1a;
  --vc-gray-700: #424242;
  --vc-gray-400: #9e9e9e;
}

:deep(.vc-container) {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

:deep(.vc-header) {
  padding: 32px 24px;
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  margin-bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 100px;
}

:deep(.vc-title) {
  font-size: 2rem;
  font-weight: 800;
  color: white !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  flex: 1;
}

:deep(.vc-weeks) {
  padding: 0;
  margin: 0;
}

:deep(.vc-weekday) {
  font-weight: 700;
  color: #1976D2;
  padding: 16px 0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #e0e0e0;
}

:deep(.vc-day) {
  min-height: 100px;
  border: 1px solid #e8e8e8;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
  padding: 8px;
  background-color: white;
}

:deep(.vc-day:hover) {
  background-color: #f5f8ff;
  border-color: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

:deep(.vc-day-content) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #424242;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 4px;
}

:deep(.vc-day.is-today) {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 2px solid #1976D2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

:deep(.vc-day.is-today .vc-day-content) {
  color: #1976D2;
  font-weight: 800;
}

:deep(.vc-day.weekday-1),
:deep(.vc-day.weekday-7) {
  background-color: #fafafa;
}

:deep(.vc-day.weekday-1:hover),
:deep(.vc-day.weekday-7:hover) {
  background-color: #f0f4ff;
}

:deep(.vc-dots) {
  position: absolute !important;
  top: 8px !important;
  left: 8px !important;
  display: flex !important;
  justify-content: flex-start !important;
  flex-wrap: wrap;
  gap: 4px;
  margin: 0 !important;
  padding: 0 !important;
  z-index: 1;
}

:deep(.vc-dot) {
  width: 10px !important;
  height: 10px !important;
  border-radius: 50%;
  margin: 0 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
}

:deep(.vc-day.is-not-in-month) {
  background-color: #f9f9f9;
}

:deep(.vc-day.is-not-in-month .vc-day-content) {
  color: #bdbdbd;
  font-weight: 400;
}

:deep(.vc-arrows-container) {
  padding: 0;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

:deep(.vc-arrow) {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transition: all 0.2s ease;
  background-color: rgba(255, 255, 255, 0.25);
  pointer-events: all;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 12px;
}

:deep(.vc-arrow:hover) {
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:deep(.vc-arrow svg) {
  color: white !important;
  width: 24px;
  height: 24px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}
</style>
