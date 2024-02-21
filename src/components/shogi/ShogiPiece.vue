<template>
  <div v-if="pieceInfo.piece" class="shogi-piece">
    <img :src="getPngPath" alt="shogi piece" :style="imgStyle" />
  </div>
</template>

<script setup lang="ts">
import type { PieceInfo } from '@/composables/useShogi';
import { computed } from 'vue';

const props = defineProps<{
  pieceInfo: PieceInfo;
  isGetPiece?: boolean;
}>();

const getPngPath = computed(() => {
  const blackOrWhite = props.pieceInfo.isBlack ? 'black' : 'white';

  return new URL(
    `/src/assets/shogi/pieces/${blackOrWhite}/${props.pieceInfo.piece}.png`,
    import.meta.url
  ).href;
});

const imgStyle = computed(() => {
  return {
    width: props.isGetPiece ? '30px' : '40px'
  };
});
</script>

<style>
.shogi-piece {
  font-weight: bold;
  text-align: center;
}
</style>
