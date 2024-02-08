<template>
  <form @submit.prevent="signUp">
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

    <div class="mb-3">
      <label for="name" class="form-label">name</label>
      <input type="text" v-model="data.name" class="form-control" id="name" required />
    </div>

    <div class="mb-3">
      <label for="lineUserId" class="form-label">LINEユーザーID</label>
      <input type="text" v-model="data.lineUserId" class="form-control" id="lineUserId" disabled />
    </div>

    <button type="submit" class="btn btn-success">登録</button>
  </form>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, reactive } from 'vue';
import { useSelfUser } from '@/composables/useSelfUser';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import { useGlobalAlert } from '@/composables/useGlobalAlert';

const selfUserComposable = inject<ReturnType<typeof useSelfUser>>('selfUserComposable');

const route = useRoute();
const router = useRouter();

const userId = computed(() => route.params.id as unknown as number);

const data = reactive({
  id: userId.value,
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  lineUserId: route.query.lineUserId as string
});

const globalAlert = useGlobalAlert();

onMounted(async () => {
  // 登録済みの場合はログイン画面に遷移
  const isRegistered = (await selfUserComposable?.isRegistered(data.lineUserId))?.result;
  if (isRegistered) {
    globalAlert.show('登録済みです。', 'danger');
    router.push('/login');
  }
});

const isConfirmPasswordInValid = computed(() => {
  return data.password !== data.confirmPassword;
});

const signUp = () => {
  // バリデーションエラーの場合
  if (isConfirmPasswordInValid.value) {
    return;
  }

  selfUserComposable?.update(data);
};
</script>
