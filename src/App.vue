<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import GlobalHeader from './views/GlobalHeader.vue';
</script>

<template>
  <header class="sticky-top">
    <GlobalHeader />
  </header>
  <RouterView />
</template>

<style scoped></style>
