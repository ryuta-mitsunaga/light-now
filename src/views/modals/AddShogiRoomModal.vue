<template>
  <div>
    <div
      class="modal fade modal-s"
      id="addShogiRoomModal"
      tabindex="-1"
      aria-labelledby="addShogiRoomModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">部屋を作成</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="input-group mb-3">
              <input
                v-model="data.roomName"
                type="text"
                class="form-control"
                placeholder="部屋名"
                aria-label="対局部屋を作成"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
            <button @click="create" type="button" class="btn btn-success" data-bs-dismiss="modal">
              作成
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { customFetch } from '@/services/customFetch';
import { ref } from 'vue';

const data = ref({
  roomName: ''
});

const emit = defineEmits(['created']);

const create = async () => {
  await customFetch(
    '/shogi/room',
    'post',
    JSON.stringify({
      name: data.value.roomName
    })
  );

  emit('created');
};
</script>
