import { createRouter, createWebHistory } from 'vue-router';
import { DEFAULT_TITLE } from '../core/config';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Home Page'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Home Page'
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../pages/LogoutPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Home Page'
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('../pages/UserPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Home Page'
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || DEFAULT_TITLE;  
  if (to.meta.requiresAuth && !sessionStorage.getItem('token')) {
    // Redirect to the login page if not authenticated
    next('/login');
  } else { 
    // Continue to the requested route
    next();
  }
});

export default router;