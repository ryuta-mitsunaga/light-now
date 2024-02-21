<template>
  <div
    class="d-flex justify-content-center align-items-center"
    style="width: 50px; height: 55px"
    :class="classes"
    @click="$emit('select', pieceInfo)"
  >
    <ShogiPiece :piece-info="pieceInfo" />
  </div>
</template>

<script lang="ts" setup>
import ShogiPiece from '@/components/shogi/ShogiPiece.vue';
import { useShogi } from '@/composables/useShogi';
import { computed } from 'vue';

const props = defineProps<{
  cellIndex: { left: number; right: number };
  initialPosition: number;
  isAvailable: boolean;
}>();

const { pieceInfo, setState, confirmPromote, promote, data } = useShogi(props.initialPosition);

const classes = computed(() => {
  return {
    'bg-primary': props.isAvailable
  };
});

const emit = defineEmits(['select']);

defineExpose({
  pieceInfo,
  setState,
  confirmPromote,
  promote
});
</script>

<style scoped></style>
