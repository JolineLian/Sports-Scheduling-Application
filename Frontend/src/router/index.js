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
          beforeEnter: (to, from, next) => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
              next({ name: 'Login' });
            } else {
              next();
            }
          },
        },
      ],
    },
    
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
