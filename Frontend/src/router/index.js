import { createRouter, createWebHistory } from 'vue-router';
import Events from '../views/Events.vue';
import Teams from '../views/Teams.vue';
import Leagues from '../views/Leagues.vue';
import Login from '../components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'events',
      component: Events,
    },
    {
      path: '/leagues',
      name: 'leagues',
      component: Leagues,
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      children: [
        {
          path: 'events',
          name: 'Events',
          component: Events,
          meta: { requiresAuth: true}
        },
      ],
    }
  ],
})

router.beforeEach((to, next) => {
  const token = localStorage.getItem('token');
  if (to.meta.requiresAuth && !token) {
    next('/');
  } else {
    next();
  }
})

export default router
