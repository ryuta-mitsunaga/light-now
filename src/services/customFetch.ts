import { useGlobalAlert } from '@/composables/useGlobalAlert';
import router from '@/router';

export const customFetch = async <T>(
  url: string,
  method: 'get' | 'post' | 'put' | 'delete',
  body?: BodyInit
) => {
  return fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    method,
    credentials: 'include',
    body,
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(async (res) => {
      if (res.status === 403) {
        router.push('/login');
        useGlobalAlert().show('ログインしてください。', 'danger');
        return;
      }

      if (!res.ok) {
        throw new Error('エラーが発生しました。');
      }

      return res.json() as Promise<T>;
    })
    .catch((err) => {
      throw new Error('予期せぬエラーが発生しました。時間が経ってから再度お試しください。');
    });
};
