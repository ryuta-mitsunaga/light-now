import router from '@/router';
import { customFetch } from '@/services/customFetch';
import type { ResponseStatus, User } from '@/types';
import { computed, ref } from 'vue';

export const useSelfUser = () => {
  const state = ref<User>();

  const login = (email: string, password: string) => {
    const request = JSON.stringify({
      email,
      password
    });

    customFetch<{ user: User }>('login', 'post', request).then((res) => {
      if (!res) return;

      state.value = {
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        lineUserId: res.user.lineUserId
      };

      router.push('/');
    });
  };

  const signUp = (email: string, password: string, name: string, lineUserId: string) => {
    customFetch<{ user: User }>(
      'signup',
      'post',
      JSON.stringify({ email, password, name, lineUserId })
    ).then(() => router.push('/login'));
  };

  const logout = async () => {
    await customFetch('logout', 'delete');

    state.value = undefined;
    router.push('/login');
  };

  const update = async (user: User & { password: string }) => {
    customFetch<{ user: User }>(
      `user/${user.id}`,
      'put',
      JSON.stringify({
        email: user.email,
        password: user.password,
        name: user.name,
        lineUserId: user.lineUserId
      })
    ).then(() => router.push('/login'));
  };

  const isRegistered = async (lineUserId: string) => {
    return customFetch<ResponseStatus & { result: boolean }>(
      `lineUserId/${lineUserId}/isRegistered`,
      'get'
    );
  };

  const getUser = async () => {
    return customFetch<{ user: User }>('user', 'get').then((res) => {
      if (!res) return;

      state.value = res.user;
    });
  };

  const isLogin = () => !!state.value;

  return {
    state,
    login,
    signUp,
    logout,
    isLogin,
    update,
    isRegistered,
    getUser
  };
};
