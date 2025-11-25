# Meeting Room Manager

A modern, professional full-stack web application for managing meeting rooms and bookings, featuring a polished UI/UX design built with Vue 3 + Vuetify and powered by Node.js + Express.

## Overview

This application provides an intuitive, enterprise-grade solution for workspace management:
- **Complete CRUD Operations**: Create, view, edit, and delete meeting rooms and bookings
- **Smart Validation**: Automatic conflict detection prevents overlapping bookings
- **Professional UI/UX**: Clean, modern interface with Material Design principles
- **Responsive Design**: Seamlessly adapts to desktop, tablet, and mobile devices
- **Real-time Feedback**: Success/error notifications and loading states for better user experience

## Technology Stack

### Frontend
- **Vue 3** (Composition API)
- **Vuetify 3** (Material Design component library)
- **Axios** (HTTP client)
- **Vite** (Build tool and dev server)

### Backend
- **Node.js**
- **Express.js**
- **In-memory storage** (arrays for rooms and bookings)
- **CORS** enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation & Running

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend server will start on `http://localhost:4000`

#### 2. Frontend Setup

Open a new terminal window/tab:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### 3. Access the Application

Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Rooms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooms` | Get all rooms |
| GET | `/rooms/:id` | Get a specific room |
| POST | `/rooms` | Create a new room |
| PUT | `/rooms/:id` | Update a room |
| DELETE | `/rooms/:id` | Delete a room (fails if bookings exist) |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rooms/:id/bookings` | Get all bookings for a room |
| POST | `/rooms/:id/bookings` | Create a booking for a room |
| GET | `/bookings/:id` | Get a specific booking |
| PUT | `/bookings/:id` | Update a booking |
| DELETE | `/bookings/:id` | Delete a booking |

## UI/UX Design Features

### Visual Design
- **Modern App Bar**: Professional header with branding and descriptive tagline
- **Color Scheme**: Carefully selected Material Design color palette with primary blue theme
- **Card-Based Layout**: Elevated cards with rounded corners for visual hierarchy
- **Icon System**: Contextual icons throughout the interface for better visual communication
- **Typography**: Clear hierarchy with varied font weights and sizes
- **Spacing & Padding**: Consistent spacing system for a polished, professional look

### Interactive Elements
- **Hover Effects**: Subtle animations on interactive elements (cards, list items, buttons)
- **Active States**: Clear visual feedback for selected items
- **Loading States**: Elegant circular progress indicators
- **Empty States**: Friendly messages with icons when no data exists
- **Badges**: Visual indicators (e.g., room count badge)

### User Experience
- **Two-Panel Layout**: Intuitive left-right split with rooms and bookings
- **Modal Dialogs**: Non-intrusive forms with clear headers and actions
- **Smart Validation**: Real-time client-side validation with helpful error messages
- **Contextual Actions**: Edit and delete buttons positioned near each item
- **Success Feedback**: Green success notifications for completed actions
- **Error Handling**: User-friendly error messages with dismissible alerts
- **Responsive Design**: Adapts beautifully to all screen sizes

### Room Management
- List all meeting rooms with visual avatars and metadata
- Create new rooms with comprehensive details (name, location, capacity, equipment, notes)
- Edit existing rooms with pre-filled forms
- Delete rooms (protected if bookings exist)
- Visual indicators for capacity and location

### Booking Management
- Card-based booking display with full details
- Rich booking creation with time, attendees, and descriptions
- Edit existing bookings with validation
- Delete bookings with confirmation
- Overlap detection prevents scheduling conflicts
- Time formatting for better readability

## Project Structure

```
meeting-room-manager/
├── README.md
├── NOTES.md
├── backend/
│   ├── server.js           # Express server with all API endpoints
│   └── package.json        # Backend dependencies
└── frontend/
    ├── package.json        # Frontend dependencies
    ├── vite.config.js      # Vite configuration
    ├── index.html          # HTML entry point
    └── src/
        ├── main.js         # Vue app initialization with Vuetify
        ├── api.js          # Axios API wrapper
        └── App.vue         # Main application component
```

## Time Spent

**Total Time**: _[To be filled in]_ hours

## Development Notes

- The application uses in-memory storage, so data is lost when the backend restarts
- All validation is performed both client-side (Vue forms) and server-side (Express)
- The UI is fully responsive and works on mobile, tablet, and desktop screens
- Material Design principles are followed using Vuetify components

## License

This project was created as a technical assessment for CrystalForge Technologies.

