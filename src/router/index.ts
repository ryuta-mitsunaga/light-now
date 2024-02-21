import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import Top from '../views/Top.vue';
import SendGroups from '../views/SendGroups.vue';
import LineBot from '../views/LineBot.vue';
import MyPage from '../views/MyPage.vue';
import Shogi from '../views/Shogi.vue';

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
      path: '/user/:userId/userGroups',
      name: 'userGroups',
      component: SendGroups
    },
    {
      path: '/lineBot',
      name: 'lineBot',
      component: LineBot
    },
    {
      path: '/user/:userId/myPage',
      name: 'myPage',
      component: MyPage
    },
    {
      path: '/user/:userId/user/:id/lineLink',
      name: 'lineLink',
      component: SignUp
    },
    {
      path: '/user/:userId/shogi',
      name: 'shogi',
      component: Shogi
    }
  ]
});

export default router;
