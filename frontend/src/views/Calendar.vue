<template>
  <v-container class="py-8" fluid>
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="rounded-2xl">
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
                        >
                          <v-card-text class="pa-5">
                            <div 
                              class="booking-color-dot"
                              :style="{ backgroundColor: roomColorMap[booking.roomId] || colors[0] }"
                            ></div>
                            <div class="d-flex align-center justify-space-between mb-4">
                              <div class="text-h5 font-weight-bold">
                                {{ booking.title }}
                              </div>
                              <v-chip 
                                :color="getBookingStatus(booking).color"
                                size="small"
                                variant="outlined"
                              >
                                {{ getBookingStatus(booking).label }}
                              </v-chip>
                            </div>

                            <div class="d-flex align-center mb-3">
                              <v-icon color="primary" class="mr-3">mdi-door</v-icon>
                              <div>
                                <div class="text-body-1 font-weight-medium">{{ booking.roomName }}</div>
                                <div class="text-caption opacity-90">{{ booking.roomLocation }}</div>
                              </div>
                            </div>

                            <div class="d-flex align-center mb-3">
                              <v-icon color="primary" class="mr-3">mdi-clock-outline</v-icon>
                              <span class="text-h6 font-weight-medium">
                                {{ formatTimeOnly(booking.start) }} – {{ formatTimeOnly(booking.end) }}
                              </span>
                            </div>

                            <div class="d-flex align-center mb-3">
                              <v-icon color="primary" class="mr-3">mdi-account</v-icon>
                              <span class="text-body-1">{{ booking.bookedBy }}</span>
                            </div>

                            <div v-if="booking.attendees" class="d-flex align-center mb-3">
                              <v-icon color="primary" class="mr-3">mdi-account-group</v-icon>
                              <span class="text-body-1">{{ booking.attendees }} attendees</span>
                            </div>

                            <v-divider v-if="booking.description" class="my-4 opacity-30" />

                            <div v-if="booking.description" class="text-body-1 opacity-90" style="line-height: 1.6;">
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
              <v-card class="mt-6 rounded-xl" elevation="3">
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
                        :style="{ backgroundColor: roomColorMap[room.id] || colors[0] }" 
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

const roomColorMap = computed(() => {
  const map = {};
  rooms.value.forEach((room, index) => {
    map[room.id] = colors[index % colors.length];
  });
  return map;
});

// Prepare calendar attributes (dots for bookings)
const calendarAttributes = computed(() => {
  const attributes = [];
  
  allBookings.value.forEach((booking) => {
    const color = roomColorMap.value[booking.roomId] || colors[0];
    
    attributes.push({
      key: booking.id,
      dates: new Date(booking.start),
      dot: {
        class: 'booking-dot',
        style: {
          backgroundColor: color
        }
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

function getBookingStatus(booking) {
  const now = new Date();
  const start = new Date(booking.start);
  const end = new Date(booking.end);
  
  if (now < start) {
    return { status: 'upcoming', color: 'primary', label: 'Upcoming' };
  } else if (now >= start && now <= end) {
    return { status: 'ongoing', color: 'success', label: 'Ongoing' };
  } else {
    return { status: 'past', color: 'grey-darken-1', label: 'Past' };
  }
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
  background-color: transparent !important;
}

.booking-detail-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.25) !important;
}

.booking-detail-card :deep(.v-card-text) {
  position: relative;
  background-color: rgb(var(--v-theme-surface));
}

.v-theme--dark .booking-detail-card :deep(.v-card-text) {
  background-color: rgb(var(--v-theme-surface));
}

.booking-color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  position: absolute;
  top: 8px;
  left: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.v-theme--dark .booking-color-dot {
  border: 2px solid rgba(0, 0, 0, 0.6);
}

.opacity-90 {
  opacity: 0.9;
}

.dot-legend {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  border: 2px solid white;
  flex-shrink: 0;
}

.v-theme--dark .dot-legend {
  border: 2px solid #2a2a2a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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

.v-theme--dark .legend-item:hover {
  background-color: #3a3a3a;
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

.v-theme--dark :deep(.vc-container) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
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

.v-theme--dark :deep(.vc-header) {
  background: linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%);
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

.v-theme--dark :deep(.vc-weekday) {
  color: #42A5F5;
  background-color: #1a1a1a;
  border-bottom: 2px solid #444;
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

.v-theme--dark :deep(.vc-day) {
  background-color: #2a2a2a;
  border: 1px solid #444;
}

:deep(.vc-day:hover) {
  background-color: #f5f8ff;
  border-color: #1976D2;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.v-theme--dark :deep(.vc-day:hover) {
  background-color: #3a3a3a;
  border-color: #42A5F5;
  box-shadow: 0 2px 8px rgba(66, 165, 245, 0.2);
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

.v-theme--dark :deep(.vc-day-content) {
  color: #e0e0e0;
}

:deep(.vc-day.is-today) {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border: 2px solid #1976D2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.v-theme--dark :deep(.vc-day.is-today) {
  background: linear-gradient(135deg, #1565C0 0%, #0D47A1 100%);
  border: 2px solid #42A5F5;
  box-shadow: 0 0 0 3px rgba(66, 165, 245, 0.2);
}

:deep(.vc-day.is-today .vc-day-content) {
  color: #1976D2;
  font-weight: 800;
}

.v-theme--dark :deep(.vc-day.is-today .vc-day-content) {
  color: #fff;
}

:deep(.vc-day.weekday-1),
:deep(.vc-day.weekday-7) {
  background-color: #fafafa;
}

.v-theme--dark :deep(.vc-day.weekday-1),
.v-theme--dark :deep(.vc-day.weekday-7) {
  background-color: #1e1e1e;
}

:deep(.vc-day.weekday-1:hover),
:deep(.vc-day.weekday-7:hover) {
  background-color: #f0f4ff;
}

.v-theme--dark :deep(.vc-day.weekday-1:hover),
.v-theme--dark :deep(.vc-day.weekday-7:hover) {
  background-color: #353535;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 2px solid white !important;
}

.v-theme--dark :deep(.vc-dot) {
  border: 2px solid #2a2a2a !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
}

:deep(.booking-dot) {
  width: 10px !important;
  height: 10px !important;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
}

.v-theme--dark :deep(.booking-dot) {
  border: 2px solid rgba(0, 0, 0, 0.6);
}


:deep(.vc-day.is-not-in-month) {
  background-color: #f9f9f9;
}

.v-theme--dark :deep(.vc-day.is-not-in-month) {
  background-color: #1a1a1a;
}

:deep(.vc-day.is-not-in-month .vc-day-content) {
  color: #bdbdbd;
  font-weight: 400;
}

.v-theme--dark :deep(.vc-day.is-not-in-month .vc-day-content) {
  color: #666;
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
