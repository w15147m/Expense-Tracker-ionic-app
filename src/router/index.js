import { createRouter, createWebHistory } from '@ionic/vue-router';
import { authService } from '../services/auth.service';
import AuthPage from '../views/AuthPage.vue';
import HomePage from '../views/HomePage.vue';

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/DashboardPage.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await authService.isAuthenticated();
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth');
  } else if (to.path === '/auth' && isAuthenticated) {
    next('/home');
  } else {
    next();
  }
});

export default router;
