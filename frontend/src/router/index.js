import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Dashboard from '../views/Dashboard.vue';
import Users from '../views/Users.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true } // Solo para usuarios NO logueados
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true } // Protegida: requiere token
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true } // Protegemos la ruta si tienes esta configuración
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GUARDIA DE NAVEGACIÓN ACTUALIZADO (Sin usar next)
router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('crm_token');

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si requiere auth y no está logueado, retornamos la ruta del login
    return '/login';
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Si es para invitados (como el login) y ya está logueado, lo mandamos al dashboard
    return '/';
  }
  
  // Si no entra en los if anteriores, Vue Router automáticamente lo deja pasar
});

export default router;