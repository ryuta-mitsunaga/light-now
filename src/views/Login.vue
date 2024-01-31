<template>
  <form
    class="needs-validation mb-3"
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
  </form>

  <div>
    <span class="fw-bold">LINE公式アカウントからユーザー登録</span><br />
    <a href="https://lin.ee/jk9duP9"
      ><img
        src="https://scdn.line-apps.com/n/line_add_friends/btn/ja.png"
        alt="友だち追加"
        height="36"
        border="0"
    /></a>
  </div>
</template>

<script lang="ts" setup>
import { inject, onMounted, reactive } from 'vue';
import { useSelfUser } from '@/composables/useSelfUser';
import { useGlobalAlert } from '@/composables/useGlobalAlert';

const selfUserComposable = inject<ReturnType<typeof useSelfUser>>('selfUserComposable');

const data = reactive({
  email: '',
  password: ''
});
</script>
