<template>
  <div
    class="modal fade modal-xl"
    id="storeDetailModal"
    tabindex="-1"
    aria-labelledby="storeDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <iframe
            class="w-100"
            v-if="store"
            frameborder="1"
            :src="store.url"
            style="height: 70vh"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
          <button
            type="button"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="$emit('interest', store)"
          >
            気になる
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Store } from '@/types';

defineProps<{
  store: Store | null;
}>();
</script>
