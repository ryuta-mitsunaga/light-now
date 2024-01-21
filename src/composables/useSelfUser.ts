import router from '@/router';
import { computed, ref } from 'vue';

export type User = {
  id: number;
  email: string;
  name: string;
  lineChannelSecret: string;
  lineChannelToken: string;
};

export const useSelfUser = () => {
  const state = ref<User>();

  const login = (email: string, password: string) => {
    fetch(`${import.meta.env.VITE_API_URL}login`, {
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
          email: res.user.email,
          name: res.user.name,
          lineChannelSecret: res.user.lineChannelSecret,
          lineChannelToken: res.user.lineChannelToken
        };

        router.push('/');
      });
  };

  const signUp = (
    email: string,
    password: string,
    name: string,
    lineChannelSecret: string,
    lineChannelToken: string
  ) => {
    fetch(`${import.meta.env.VITE_API_URL}signup`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        name,
        lineChannelSecret,
        lineChannelToken
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
