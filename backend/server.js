const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory stores
let rooms = [];
let bookings = [];
let roomIdCounter = 1;
let bookingIdCounter = 1;

// Helpers
function validateRoom(body) {
  const errors = [];
  if (!body.name) errors.push('Name is required');
  if (!body.location) errors.push('Location is required');
  if (body.capacity != null && body.capacity <= 0) errors.push('Capacity must be > 0');
  return errors;
}

function validateBooking(body) {
  const errors = [];
  if (!body.roomId) errors.push('roomId is required');
  if (!body.title) errors.push('Title is required');
  if (!body.start || !body.end) errors.push('Start and end are required');

  const start = new Date(body.start);
  const end = new Date(body.end);
  if (isNaN(start) || isNaN(end) || start >= end) {
    errors.push('Invalid start/end times');
  }

  // Simple overlap check in same room
  const roomBookings = bookings.filter(b => b.roomId === Number(body.roomId));
  for (const b of roomBookings) {
    const bStart = new Date(b.start);
    const bEnd = new Date(b.end);
    if (start < bEnd && end > bStart && b.id !== body.id) {
      errors.push('Booking overlaps with existing booking');
      break;
    }
  }
  return errors;
}

// --- ROOM ROUTES ---

app.get('/rooms', (req, res) => {
  res.json(rooms);
});

app.get('/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id === Number(req.params.id));
  if (!room) return res.status(404).json({ message: 'Room not found' });
  res.json(room);
});

app.post('/rooms', (req, res) => {
  const errors = validateRoom(req.body);
  if (errors.length) return res.status(400).json({ errors });

  const room = {
    id: roomIdCounter++,
    name: req.body.name,
    location: req.body.location,
    capacity: req.body.capacity ?? null,
    equipment: req.body.equipment ?? '',
    notes: req.body.notes ?? ''
  };
  rooms.push(room);
  res.status(201).json(room);
});

app.put('/rooms/:id', (req, res) => {
  const room = rooms.find(r => r.id === Number(req.params.id));
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const toValidate = { ...room, ...req.body };
  const errors = validateRoom(toValidate);
  if (errors.length) return res.status(400).json({ errors });

  Object.assign(room, req.body);
  res.json(room);
});

app.delete('/rooms/:id', (req, res) => {
  const roomId = Number(req.params.id);
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) return res.status(404).json({ message: 'Room not found' });

  // Optional: block delete if bookings exist
  const hasBookings = bookings.some(b => b.roomId === roomId);
  if (hasBookings) {
    return res.status(409).json({ message: 'Cannot delete room with existing bookings' });
  }

  rooms.splice(roomIndex, 1);
  res.status(204).send();
});

// --- BOOKING ROUTES ---

app.get('/rooms/:id/bookings', (req, res) => {
  const roomId = Number(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const roomBookings = bookings.filter(b => b.roomId === roomId);
  res.json(roomBookings);
});

app.post('/rooms/:id/bookings', (req, res) => {
  const roomId = Number(req.params.id);
  const room = rooms.find(r => r.id === roomId);
  if (!room) return res.status(404).json({ message: 'Room not found' });

  const bookingData = { ...req.body, roomId };
  const errors = validateBooking(bookingData);
  if (errors.length) return res.status(400).json({ errors });

  const booking = {
    id: bookingIdCounter++,
    roomId,
    title: bookingData.title,
    description: bookingData.description ?? '',
    start: bookingData.start,
    end: bookingData.end,
    bookedBy: bookingData.bookedBy ?? 'Unknown',
    attendees: bookingData.attendees ?? 0
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

app.get('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === Number(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  res.json(booking);
});

app.put('/bookings/:id', (req, res) => {
  const booking = bookings.find(b => b.id === Number(req.params.id));
  if (!booking) return res.status(404).json({ message: 'Booking not found' });

  const updated = { ...booking, ...req.body, id: booking.id };
  const errors = validateBooking(updated);
  if (errors.length) return res.status(400).json({ errors });

  Object.assign(booking, updated);
  res.json(booking);
});

app.delete('/bookings/:id', (req, res) => {
  const index = bookings.findIndex(b => b.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Booking not found' });

  bookings.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

