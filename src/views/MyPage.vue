<template>
  <div>
    <h2 class="mb-3">マイページ</h2>
    <div>
      {{ selfUser.state.value?.email }}
      <hr />
    </div>

    <div>
      {{ selfUser.state.value?.name }}
      <hr />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { useSelfUser } from '@/composables/useSelfUser';
import { inject } from 'vue';

const selfUser = inject('selfUserComposable') as ReturnType<typeof useSelfUser>;
</script>
