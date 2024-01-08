<template>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" v-model="data.email" class="form-control" id="email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" v-model="data.password" class="form-control" id="password" />
    </div>

    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Confirm Password</label>
      <input
        type="password"
        v-model="data.confirmPassword"
        class="form-control"
        id="confirmPassword"
      />
      <p v-show="isConfirmPasswordInValid" class="text-danger">パスワードが間違っています</p>
    </div>

    <button type="button" class="btn btn-primary" @click="$router.push('signUp')">登録</button>
  </form>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue'

const data = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const isConfirmPasswordInValid = computed(() => {
  return data.password !== data.confirmPassword
})
</script>
