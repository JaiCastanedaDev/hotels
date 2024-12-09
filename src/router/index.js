import { createRouter, createWebHistory } from 'vue-router';
import HotelForm from '@/components/HotelForm.vue';

const routes = [
  {
    path: '/hotels/edit/:id',
    name: 'editHotel',
    component: HotelForm,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
