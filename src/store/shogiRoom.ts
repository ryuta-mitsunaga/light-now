import type { useActionCable } from '@/composables/useActionCable';
import { defineStore } from 'pinia';

export const useShogiRoomStore = defineStore('shogiRoom', {
  state: (): {
    connections: (typeof useActionCable)[];
  } => ({
    connections: []
  })
});
