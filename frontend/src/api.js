import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000'
});

export default {
  // Rooms
  getRooms() {
    return api.get('/rooms');
  },
  getRoom(id) {
    return api.get(`/rooms/${id}`);
  },
  createRoom(payload) {
    return api.post('/rooms', payload);
  },
  updateRoom(id, payload) {
    return api.put(`/rooms/${id}`, payload);
  },
  deleteRoom(id) {
    return api.delete(`/rooms/${id}`);
  },

  // Bookings
  getRoomBookings(roomId) {
    return api.get(`/rooms/${roomId}/bookings`);
  },
  createRoomBooking(roomId, payload) {
    return api.post(`/rooms/${roomId}/bookings`, payload);
  },
  getBooking(id) {
    return api.get(`/bookings/${id}`);
  },
  updateBooking(id, payload) {
    return api.put(`/bookings/${id}`, payload);
  },
  deleteBooking(id) {
    return api.delete(`/bookings/${id}`);
  }
};
