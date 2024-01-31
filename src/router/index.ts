import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import Top from '../views/Top.vue';
import UserGroups from '../views/UserGroups.vue';
import LineBot from '../views/LineBot.vue';
import MyPage from '../views/MyPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/signUp',
      name: 'signUp',
      component: SignUp
    },
    {
      path: '/',
      name: 'top',
      component: Top
    },
    {
      path: '/userGroups',
      name: 'userGroups',
      component: UserGroups
    },
    {
      path: '/lineBot',
      name: 'lineBot',
      component: LineBot
    },
    {
      path: '/myPage',
      name: 'myPage',
      component: MyPage
    },
    {
      path: '/user/:id/lineLink',
      name: 'lineLink',
      component: SignUp
    }
  ]
});

export default router;
