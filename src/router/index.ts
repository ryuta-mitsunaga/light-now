import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import SignUp from '../views/SignUp.vue';
import Top from '../views/Top.vue';
import SendGroups from '../views/SendGroups.vue';
import LineBot from '../views/LineBot.vue';
import MyPage from '../views/MyPage.vue';
import Shogi from '../views/Shogi.vue';
import ShogiRooms from '../views/ShogiRooms.vue';

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
      path: '/user/:userId/lineBot',
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
      path: '/shogi/rooms',
      name: 'shogiRooms',
      component: ShogiRooms
    },
    {
      path: '/shogi/room/:roomId',
      name: 'shogiRoom',
      component: Shogi
    }
  ]
});

export default router;
