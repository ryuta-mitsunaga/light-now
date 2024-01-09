<template>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" v-model="data.email" class="form-control" id="email" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" v-model="data.password" class="form-control" id="password" required />
    </div>

    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Confirm Password</label>
      <input
        type="password"
        v-model="data.confirmPassword"
        class="form-control"
        id="confirmPassword"
        required
      />
      <p v-show="isConfirmPasswordInValid" class="text-danger">パスワードが間違っています</p>
    </div>

    <button type="button" class="btn btn-primary" @click="signUp">登録</button>
  </form>
</template>

<script lang="ts" setup>
import router from '@/router';
import { computed, reactive } from 'vue';

const data = reactive({
  email: '',
  password: '',
  confirmPassword: ''
});

const isConfirmPasswordInValid = computed(() => {
  return data.password !== data.confirmPassword;
});

const signUp = () => {
  // バリデーションエラーの場合
  if (isConfirmPasswordInValid.value) {
    return;
  }

  fetch('http://localhost:3000/signup', {
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
      router.push('/login');
    });
};
</script>
