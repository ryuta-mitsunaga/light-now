<template>
  <form
    class="needs-validation"
    @submit.prevent="selfUserComposable?.login(data.email, data.password)"
  >
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" v-model="data.email" class="form-control" id="email" required />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" v-model="data.password" class="form-control" id="password" required />
    </div>

    <button type="submit" class="btn btn-success me-2">ログイン</button>
    <button type="button" class="btn btn-secondary" @click="$router.push('signUp')">登録</button>
  </form>
</template>

<script lang="ts" setup>
import { inject, reactive } from 'vue';
import { useSelfUser } from '@/composables/useSelfUser';

const selfUserComposable = inject<ReturnType<typeof useSelfUser>>('selfUserComposable');

const data = reactive({
  email: '',
  password: ''
});
</script>
