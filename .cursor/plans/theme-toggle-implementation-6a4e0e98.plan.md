<!-- 6a4e0e98-7245-4f42-9b0a-e30f1cb84b53 31831ed9-755c-4e57-a015-4a32ab76e23e -->
# Visual Enhancement Suite

## Overview

Implement comprehensive visual improvements including dark/light mode toggle, custom typography, glassmorphism effects, stagger animations, status indicators, page transitions, and success animations.

## Implementation Steps

### 1. Google Font Integration & Background Color

**File: [`frontend/index.html`](frontend/index.html)**

- Add Google Fonts (Poppins) link in `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```


**File: [`frontend/src/main.js`](frontend/src/main.js)**

- Add dark theme configuration with off-white background for light mode
- Update Vuetify theme to include both light and dark themes
- Add custom font family to theme
- Key changes:
  - Light theme background: `#FAFAFA` (off-white)
  - Dark theme with complementary colors
  - Font family: `'Poppins', sans-serif`

### 2. Dark Mode Toggle Component

**New File: `frontend/src/components/ThemeToggle.vue`**

- Create theme toggle button component
- Use Vuetify's `useTheme()` composable
- Icon switches between `mdi-weather-night` and `mdi-white-balance-sunny`
- Store preference in localStorage

**File: [`frontend/src/App.vue`](frontend/src/App.vue)**

- Add ThemeToggle component to app bar (right side, before tabs)
- Import and register component

### 3. Enhanced Box Shadows & Border Radius

**File: [`frontend/src/App.vue`](frontend/src/App.vue)** - Update global styles:

```css
/* Enhanced shadows on hover */
.v-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
}

/* Border radius variations */
.rounded-lg { border-radius: 16px !important; }
.rounded-xl { border-radius: 20px !important; }
.rounded-2xl { border-radius: 24px !important; }
```

**File: [`frontend/src/views/Rooms.vue`](frontend/src/views/Rooms.vue)**

- Update cards to use `rounded-xl` class
- Add enhanced hover shadows to list items and booking cards

**File: [`frontend/src/views/Calendar.vue`](frontend/src/views/Calendar.vue)**

- Apply `rounded-2xl` to main calendar card
- Increase shadow intensity on calendar day hover

### 4. Glassmorphism on Dialogs

**Files to update:**

- `frontend/src/components/RoomFormDialog.vue`
- `frontend/src/components/BookingFormDialog.vue`
- `frontend/src/components/ConfirmDialog.vue`

Add glassmorphism effect:

```css
.glass-dialog {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Dark mode variant */
.v-theme--dark .glass-dialog {
  background: rgba(30, 30, 30, 0.85) !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 5. Stagger Animation for List Items

**File: [`frontend/src/views/Rooms.vue`](frontend/src/views/Rooms.vue)**

- Add CSS keyframes for fade-in animation
- Apply staggered animation delay to `v-list-item` using `:style` binding
- Calculate delay: `index * 50ms`

CSS to add:

```css
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
```

### 6. Color-Coded Status Indicators for Bookings

**File: [`frontend/src/views/Rooms.vue`](frontend/src/views/Rooms.vue)**

- Add computed function `getBookingStatus(booking)` that returns 'upcoming', 'ongoing', or 'past'
- Add colored indicator chip/dot to each booking card
- Colors: 
  - Upcoming: blue (`#2196F3`)
  - Ongoing: green (`#4CAF50`)  
  - Past: grey (`#9E9E9E`)

**File: [`frontend/src/views/Calendar.vue`](frontend/src/views/Calendar.vue)**

- Apply same status logic to booking details dialog

### 7. Animated Page Transitions

**File: [`frontend/src/App.vue`](frontend/src/App.vue)**

- Wrap `<router-view>` with `<transition>` component
- Use Vue's built-in transition modes

Template update:

```vue
<v-main class="bg-grey-lighten-4">
  <transition name="page" mode="out-in">
    <router-view />
  </transition>
</v-main>
```

CSS transitions:

```css
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
```

### 8. Success Checkmark Animation

**New File: `frontend/src/components/SuccessCheckmark.vue`**

- Create animated SVG checkmark component
- Use stroke-dasharray animation for draw effect
- Trigger via global event bus or composable

**File: [`frontend/src/views/Rooms.vue`](frontend/src/views/Rooms.vue)**

- Import SuccessCheckmark component
- Show animated checkmark overlay after successful create/update
- Auto-hide after 1.5 seconds

SVG animation CSS:

```css
@keyframes checkmark {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.checkmark-path {
  stroke-dasharray: 100;
  animation: checkmark 0.6s ease-in-out;
}
```

### 9. Additional Styling Updates

**Update all component files** to use:

- New border-radius classes (rounded-xl, rounded-2xl)
- Enhanced box-shadow on hover
- Poppins font (automatically applied via theme)
- Dark mode compatible colors

## Files Modified

- `frontend/index.html`
- `frontend/src/main.js`
- `frontend/src/App.vue`
- `frontend/src/views/Rooms.vue`
- `frontend/src/views/Calendar.vue`
- `frontend/src/components/RoomFormDialog.vue`
- `frontend/src/components/BookingFormDialog.vue`
- `frontend/src/components/ConfirmDialog.vue`

## New Files

- `frontend/src/components/ThemeToggle.vue`
- `frontend/src/components/SuccessCheckmark.vue`

## Testing Checklist

- [ ] Dark/light mode toggle works across all pages
- [ ] Font loads correctly
- [ ] Glassmorphism visible on dialogs
- [ ] List items animate with stagger effect
- [ ] Status indicators show correct colors
- [ ] Page transitions smooth between routes
- [ ] Success checkmark displays after create/update
- [ ] All hover effects enhanced

### To-dos

- [ ] Add Google Fonts and update theme with off-white background and dark mode
- [ ] Create ThemeToggle component and add to app bar
- [ ] Update box-shadow intensities and add border-radius variations
- [ ] Implement glassmorphism effect on all dialog components
- [ ] Add stagger animation to room and booking list items
- [ ] Implement color-coded status indicators for bookings
- [ ] Add animated transitions between routes
- [ ] Create and integrate success checkmark animation