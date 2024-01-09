<template>
  <form class="needs-validation" @submit.prevent="login">
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" v-model="data.email" class="form-control" id="email" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" v-model="data.password" class="form-control" id="password" required />
    </div>

    <button type="submit" class="btn btn-primary me-2">ログイン</button>
    <button type="button" class="btn btn-secondary" @click="$router.push('signUp')">登録</button>
  </form>
</template>

<script lang="ts" setup>
import router from '@/router';
import { reactive } from 'vue';

const data = reactive({
  email: '',
  password: ''
});

const login = () => {
  fetch('http://localhost:3000/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password
    })
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== 200) {
        alert(res.message);
        return;
      }
      router.push('/');
    });
};
</script>
