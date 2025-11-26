# Meeting Room Manager

A modern, professional full-stack web application for managing meeting rooms and bookings, featuring a polished UI/UX design built with Vue 3 + Vuetify and powered by Node.js + Express.

## Overview

This application provides an intuitive, enterprise-grade solution for workspace management:
- **Complete CRUD Operations**: Create, view, edit, and delete meeting rooms and bookings
- **Calendar Visualization**: Professional month-view calendar with color-coded booking indicators
- **Multi-Page Navigation**: Separate views for room management and calendar overview
- **Smart Validation**: Automatic conflict detection prevents overlapping bookings
- **Professional UI/UX**: Clean, modern interface with Material Design principles
- **Responsive Design**: Seamlessly adapts to desktop, tablet, and mobile devices
- **Real-time Feedback**: Success/error notifications and loading states for better user experience

## Technology Stack

### Frontend
- **Vue 3** (Composition API)
- **Vue Router 4** (Client-side routing)
- **Vuetify 3** (Material Design component library)
- **V-Calendar** (Calendar component library)
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

## Key Features

### 📅 Calendar View
- **Professional Month Grid**: Traditional calendar layout showing all bookings across rooms
- **Color-Coded Dots**: Each room has a unique color for instant visual identification
- **Click-to-View Details**: Click any date to see all bookings scheduled that day
- **Room Legend**: Clear legend showing which color represents which room
- **Month Navigation**: Easy navigation between months with arrow buttons
- **Today Highlighting**: Current date highlighted with special styling

### 🏢 Room Management
- **Visual Room Cards**: Each room displayed with avatar, location, and capacity
- **Comprehensive Details**: Name, location, capacity, equipment, and notes
- **Quick Actions**: Edit and delete buttons with confirmation dialogs
- **Protected Deletion**: Cannot delete rooms with existing bookings
- **Auto-Selection**: First room automatically selected on load

### 📋 Booking Management
- **Detailed Booking Cards**: Time, attendee count, and description at a glance
- **Date/Time Pickers**: User-friendly datetime input with native pickers
- **Conflict Detection**: Automatic validation prevents overlapping bookings
- **Full-Field Clickable**: Entire datetime field triggers picker for better UX
- **Professional Confirmation**: Custom dialogs for delete confirmations

### 🎨 UI/UX Design Features

#### Visual Design
- **Modern App Bar**: Professional header with navigation tabs and branding
- **Color Scheme**: Carefully selected Material Design color palette with primary blue theme
- **Card-Based Layout**: Elevated cards with rounded corners for visual hierarchy
- **Icon System**: Contextual Material Design icons throughout the interface
- **Typography**: Clear hierarchy with varied font weights and sizes
- **Gradient Backgrounds**: Professional gradient headers for visual interest
- **Spacing & Padding**: Consistent 8px grid system for polished appearance

#### Interactive Elements
- **Hover Effects**: Subtle animations on interactive elements (cards, list items, buttons)
- **Active States**: Clear visual feedback for selected items and current page
- **Loading States**: Elegant circular progress indicators with appropriate sizing
- **Empty States**: Friendly messages with icons when no data exists
- **Smooth Transitions**: Professional 0.2s-0.3s transitions for all interactions
- **Tab Navigation**: Intuitive switching between Rooms and Calendar views

#### User Experience
- **Multi-Page Navigation**: Separate Rooms and Calendar views with tab navigation
- **Two-Panel Layout**: Intuitive left-right split for rooms and bookings on Rooms page
- **Modal Dialogs**: Non-intrusive forms with gradient headers and clear actions
- **Component-Based Architecture**: Reusable dialog components for clean code
- **Smart Validation**: Real-time client-side and server-side validation
- **Contextual Actions**: Edit and delete icons positioned near each item
- **Professional Confirmations**: Custom confirmation dialogs instead of browser alerts
- **Success Feedback**: Green success snackbars for completed actions
- **Error Handling**: User-friendly error messages with dismissible alerts
- **Persistent Placeholders**: Labels stay visible for better form usability
- **Responsive Design**: Adapts beautifully to all screen sizes

## Project Structure

```
meeting-room-manager/
├── README.md                      # Project documentation
├── NOTES.md                       # Development notes and decisions
├── UI-UX-HIGHLIGHTS.md           # Design principles and highlights
├── .gitignore                     # Git ignore rules
├── backend/
│   ├── server.js                  # Express server with all API endpoints
│   └── package.json               # Backend dependencies
└── frontend/
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite configuration
    ├── index.html                 # HTML entry point with MDI icons
    └── src/
        ├── main.js                # Vue app initialization with Vuetify + VCalendar
        ├── router.js              # Vue Router configuration
        ├── api.js                 # Axios API wrapper
        ├── App.vue                # Main app shell with navigation
        ├── components/
        │   ├── RoomFormDialog.vue    # Room create/edit dialog
        │   ├── BookingFormDialog.vue # Booking create/edit dialog
        │   └── ConfirmDialog.vue     # Reusable confirmation dialog
        └── views/
            ├── Rooms.vue          # Room and booking management page
            └── Calendar.vue       # Calendar visualization page
```

## Time Spent

**Total Time**: Approximately **3 hours** of working time


## Development Notes

- The application uses in-memory storage, so data is lost when the backend restarts
- All validation is performed both client-side (Vue forms) and server-side (Express)
- The UI is fully responsive and works on mobile, tablet, and desktop screens
- Material Design principles are followed using Vuetify components
- Vue Router enables navigation between Rooms and Calendar views
- V-Calendar library provides professional calendar grid with color-coded indicators
- Component-based architecture with reusable dialog components for maintainability
- Native datetime pickers for improved date/time input UX

## License

This project was created as a technical assessment for CrystalForge Technologies.

