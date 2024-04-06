<template>
  <div class="d-flex justify-content-between align-items-center">
    <h2 class="m-0">対局部屋</h2>
    <button @click="getRooms" class="btn btn-sm btn-outline-success">更新</button>
  </div>

  <div class="mt-3">
    <div class="d-flex justify-content-center">
      <button class="btn btn-success d-block w-75" style="max-width: 300px" @click="openModal">
        部屋を作成
      </button>
    </div>

    <div class="mt-3">
      <div v-if="data.isLoading" class="text-center">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else class="rooms-container">
        <div class="w-100" v-for="room in data.rooms" :key="room.id">
          <div class="card">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <div v-if="room.joinUsers.length >= 2">
                  <span class="border px-2 py-1 rounded bg-danger text-white">
                    <i class="bi bi-people-fill me-1"></i>
                    <span>対局中</span>
                  </span>
                </div>
                <div v-else>
                  <span class="border px-2 py-1 rounded bg-success text-white">
                    <span>待機中</span>
                  </span>
                </div>

                {{ room.name }}
                <div>
                  <span @click="deleteRoom(room.id)">
                    <i class="bi bi-x-lg"></i>
                  </span>
                </div>
              </div>
            </div>

            <div
              class="d-flex justify-content-between align-items-center p-2"
              style="min-height: 70px"
            >
              <div>
                <div v-for="user in room.joinUsers" :key="user.id">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>{{ user.name }}</div>
                  </div>
                </div>
              </div>
              <button
                v-if="room.joinUsers.length < 2"
                @click="$router.push({ name: 'shogiRoom', params: { roomId: room.id } })"
                class="btn btn-success btn-sm"
                style="height: 30px"
              >
                入室
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AddShogiRoomModal @created="getRooms" />
  </div>
</template>

<script setup lang="ts">
import { customFetch } from '@/services/customFetch';
import type { User } from '@/types';
import { Modal } from 'bootstrap';
import { onMounted, ref } from 'vue';
import AddShogiRoomModal from './modals/AddShogiRoomModal.vue';
import { useGlobalAlert } from '@/composables/useGlobalAlert';

const alert = useGlobalAlert();

type ShogiRoom = {
  id: number;
  name: string;
  created_user: User;
  joinUsers: User[];
};

const data = ref<{
  rooms: ShogiRoom[];
  isLoading: boolean;
}>({
  rooms: [],
  isLoading: false
});

const emit = defineEmits(['disconnect']);

const getRooms = async () => {
  data.value.isLoading = true;

  data.value.rooms = (await customFetch<{ data: ShogiRoom[] }>('/shogi/rooms', 'get'))?.data || [];
  data.value.isLoading = false;
};

onMounted(() => {
  getRooms();

  /** 20秒ごとにroomsを更新する */
  setInterval(getRooms, 20000);
});

const openModal = () => {
  const modal = document.getElementById('addShogiRoomModal');
  const modalInstance = new Modal(modal as HTMLElement);
  modalInstance.show();
};

const deleteRoom = async (roomId: number) => {
  await customFetch(`/shogi/room/${roomId}`, 'delete');

  alert.show('部屋を削除しました', 'success');

  getRooms();
};
</script>

<style scoped>
.rooms-container {
  display: grid;
  justify-items: center;
  align-items: center;
  gap: 10px;
  grid-template-columns: repeat(auto-fill, 300px);
}
</style>
