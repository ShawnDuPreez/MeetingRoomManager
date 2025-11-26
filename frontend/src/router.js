import { createRouter, createWebHistory } from 'vue-router';
import Rooms from './views/Rooms.vue';
import Calendar from './views/Calendar.vue';

const routes = [
  {
    path: '/',
    name: 'Rooms',
    component: Rooms
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

