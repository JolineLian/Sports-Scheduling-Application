import { createRouter, createWebHistory } from 'vue-router';
import Events from '../views/Events.vue';
import Teams from '../views/Teams.vue';
import Leagues from '../views/Leagues.vue';
import Login from '../components/Login.vue';
import Dashboard from '@/components/Dashboard.vue';
import {jwtDecode} from 'jwt-decode'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      redirect: '/login'
    },
    // {
    //   path: '/events',
    //   name: 'Events',
    //   component: Events,
    // },
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
        {
          path: 'leagues',
          name: 'Leagues',
          component: Leagues,
          meta: { requiresAuth: true, requiresAdmin: true }
        },
        {
          path: 'teams',
          name: 'Teams',
          component: Teams,
          meta: { requiresAuth: true, requiresAdmin: true }
        }
        
      ],
    }
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  
  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/login');
    }

    try {
      const decoded = jwtDecode(token);

      // Route requires admin but user isn't admin
      if (to.meta.requiresAdmin && !decoded.isAdmin) {
        return next('/dashboard/events');
      }

      return next(); // Authenticated and allowed
    } catch (error) {
      console.error('Invalid token', error);
      return next('/login');
    }
  }

  next(); // Public route
});



export default router
