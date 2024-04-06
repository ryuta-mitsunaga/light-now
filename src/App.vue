<template>
  <div>
    <header class="sticky-top">
      <GlobalHeader />
    </header>
    <div class="px-3 py-2">
      <div id="globalAlert" />
      <RouterView />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { RouterLink, RouterView } from 'vue-router';
import GlobalHeader from './views/GlobalHeader.vue';
import { useSelfUser } from '@/composables/useSelfUser';
import { useGlobalAlert } from '@/composables/useGlobalAlert';
import { computed, provide } from 'vue';
import router from './router';

const selfUserComposable = useSelfUser();

selfUserComposable.getUser();

provide('selfUserComposable', selfUserComposable);
</script>

<style scoped></style>
