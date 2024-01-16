<template>
  <div>
    <header class="sticky-top">
      <GlobalHeader />
    </header>
    <div class="px-3 py-2">
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
import GlobalHeader from './views/GlobalHeader.vue';
import { useSelfUser } from '@/composables/useSelfUser';
import { provide } from 'vue';
import router from './router';

const selfUserComposable = useSelfUser();
provide('selfUserComposable', selfUserComposable);

router.beforeEach((to, from, next) => {
  if (!['login', 'signUp'].includes((to.name || '') as string) && !selfUserComposable?.isLogin()) {
    next({ name: 'login' });
  } else {
    next();
  }
});
</script>

<style scoped></style>
