import router from '@/router';
import { computed, ref } from 'vue';

export type User = {
  id: number;
  email: string;
};

export const useSelfUser = () => {
  const state = ref<User>();

  const login = (email: string, password: string) => {
    fetch('http://localhost:3000/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status !== 200) {
          alert('ログインに失敗しました');
          return;
        }

        state.value = {
          id: res.user.id,
          email: res.user.email
        };

        router.push('/');
      });
  };

  const signUp = (email: string, password: string) => {
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((res) => {
        router.push('/login');
      });
  };

  const isLogin = () => !!state.value;

  return {
    state,
    login,
    signUp,
    isLogin
  };
};
