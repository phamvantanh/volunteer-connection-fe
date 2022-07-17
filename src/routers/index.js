import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/auth/LoginPage.vue'
import RegisterPage from '../views/auth/Register.vue'
import EmailVerify from '../views/auth/EmailVerify.vue'
import HomePage from '../views/volunteer/HomePage.vue'
import DashBoard from '../views/admin/DashBoard.vue'
import AdminPage from '../views/admin/AdminPage.vue'
import UserManager from '../views/admin/UserManager.vue'
import PostManager from '../views/admin/PostManager.vue'
import Category from '../views/admin/Category.vue'
import EventManager from '../views/admin/EventManager.vue'
import ReportManager from '../views/admin/ReportManager.vue'
// import store from "../store";
import Welcome from '../views/volunteer/Welcome.vue'
import PostDetail from '../views/volunteer/PostDetail.vue'
import EventDetail from '../views/volunteer/EventDetail.vue'
import UserProfile from '../views/volunteer/UserProfile.vue'
import BookMark from '../views/volunteer/BookMark.vue'
import NewPost from '../views/organization/NewPost.vue'
import NewEvent from '../views/organization/NewEvent.vue'
import PostSearch from '../views/volunteer/PostSearch.vue'
import EventSearch from '../views/volunteer/EventSearch.vue'
import EditPost from '@/views/organization/EditPost.vue'
import EditEvent from '@/views/organization/EditEvent.vue'
import RegisteredVolunteer from '@/views/organization/RegisteredVolunteer.vue'

import TestUpload from '../views/volunteer/TestUpload.vue'

Vue.use(VueRouter)
export const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
    },
    {
      path: '/',
      component: HomePage,
      children: [{
        path: '',
        component: Welcome
      },
      {
        path: 'post/:slug',
        component: PostDetail
      },
      {
        path: 'post/:slug/edit',
        component: EditPost
      },
      {
        path: 'event/:slug',
        component: EventDetail
      },
      {
        path: 'event/:slug/edit',
        component: EditEvent
      },
      {
        path: 'event/:id/volunteer',
        component: RegisteredVolunteer
      },
      {
        path: 'user/:url',
        component: UserProfile
      },
      {
        path: 'bookmarked',
        component: BookMark
      },
      {
        path: 'add/post',
        component: NewPost
      },
      {
        path: 'add/event',
        component: NewEvent
      },
      {
        path: 'posts/search',
        name: "PostSearch",
        component: PostSearch
      },
      {
        path: 'events/search',
        name: "EventSearch",
        component: EventSearch
      },

      {
        path: 'test',
        name: "TestUpload",
        component: TestUpload
      },
      ]
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
    {
      path: '/admin/',
      component: AdminPage,
      meta: { authorize: ['admin'] },
      children: [
        {
          path: '',
          name: "DashBoard",
          component: DashBoard
        },
        {
          path: 'dashboard',
          name: "DashBoard1",
          component: DashBoard
        },
        {
          path: 'users',
          name: "UserManager",
          component: UserManager
        },
        {
          path: 'posts',
          name: "PostManager",
          component: PostManager
        },
        {
          path: 'category',
          name: "CategoryManager",
          component: Category
        },
        {
          path: 'events',
          name: "EventManager",
          component: EventManager
        },
        {
          path: 'reports',
          name: "ReportManager",
          component: ReportManager
        },]
    },
    // { path: '*', redirect: '/' },
  ]
});
// router.beforeEach((to, from, next) => {
//   // redirect to login page if not logged in and trying to access a restricted page
//   const { authorize } = to.meta;
//   const currentUser = store.state.role==='undefined'?null:store.state.role;

//   if (authorize) {
//       if (!currentUser) {
//           // not logged in so redirect to login page with the return url
//           return next({ path: '/', query: { returnUrl: to.path } });
//       }

//       // check if route is restricted by role
//       if (authorize.length && !authorize.includes(currentUser)) {
//           // role not authorised so redirect to home page
//           return next({ path: '/' });
//       }
//   }
//   next();
// })