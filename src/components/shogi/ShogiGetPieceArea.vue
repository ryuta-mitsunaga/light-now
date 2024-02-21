<template>
  <div class="outer">
    <div class="d-flex justify-content-center align-items-center">
      <ShogiPiece
        is-get-piece
        v-for="piece in pieces"
        :piece-info="piece"
        @click="selectPiece(piece)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PieceInfo } from '@/composables/useShogi';
import ShogiPiece from '@/components/shogi/ShogiPiece.vue';

defineProps<{
  pieces: PieceInfo[];
}>();

const emit = defineEmits(['selectPiece']);

const selectPiece = (piece: PieceInfo) => {
  emit('selectPiece', piece);
};
</script>
<style scoped>
.outer {
  width: 150px;
  height: 100px;
  border: 1px solid #000;
}
</style>
