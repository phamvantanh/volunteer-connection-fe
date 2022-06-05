import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/Register.vue'
import EmailVerify from '../views/auth/EmailVerify.vue'
import HomePage from '../views/volunteer/HomePage.vue'
Vue.use(VueRouter)
export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      meta:{requiresVisitor: true},
    },
    {
      path: '/',
      component: HomePage,
        // children: [{
        //   path: '',
        //   component: Campaign
        // }]
    },
    
    {
      path: '/register',
      name: 'RegisterPage',
      component: RegisterPage
    },

    {
      path: '/verify-email',
      name: 'EmailVerify',
      component: EmailVerify
    },
    { path: '*', redirect: '/' },
  ]
});
