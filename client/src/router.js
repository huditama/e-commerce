import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Store from './views/Store.vue'
import Admin from './views/Admin.vue'
import AdminEdit from './views/AdminEdit.vue'
import AdminCreate from './views/AdminCreate.vue'
import AdminTransactions from './views/AdminTransactions.vue'

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/store',
      name: 'store',
      component: Store
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      children: [
        {
          path: 'create',
          name: 'create',
          component: AdminCreate
        },
        {
          path: 'edit',
          name: 'edit',
          component: AdminEdit
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: AdminTransactions
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
