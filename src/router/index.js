import { createRouter, createWebHistory } from 'vue-router';
import { DEFAULT_TITLE } from '../core/config';
import { checkAuth } from '../core/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomePage.vue'),
      meta: {
        requiresAuth: false,
        title: 'LLYMAR.RU'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/LoginPage.vue'),
      meta: {
        requiresAuth: false,
        title: 'Вход - LLYMAR.RU'
      }
    },
    {
      path: '/logout',
      name: 'logout',
      component: () => import('../pages/LogoutPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Выход'
      }
    },
    {
      path: '/user/calculator',
      name: 'calculator',
      component: () => import('../pages/CalcPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Калькулятор - LLYMAR.RU'
      }
    },
    {
      path: '/user/account',
      name: 'account',
      component: () => import('../pages/AccountPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Аккаунт - LLYMAR.RU'
      }
    },
    {
      path: '/user/history',
      name: 'history',
      component: () => import('../pages/HistoryPage.vue'),
      meta: {
        requiresAuth: true,
        title: 'Калькулятор - LLYMAR.RU'
      }
    },
  ]
});

router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title || DEFAULT_TITLE; 
  const chk = await checkAuth();
  if (to.meta.requiresAuth && !sessionStorage.getItem('token') && !chk) {
    // Redirect to the login page if not authenticated
    next('/login');
  } else { 
    // Continue to the requested route
    next();
  }
});

export default router;