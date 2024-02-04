<template>
  <div>
    <form class="needs-validation col col-12 col-sm-6 mb-5" @submit.prevent="createGroup()">
      <div class="mb-3">
        <input
          v-model="data.groupName"
          type="text"
          class="form-control mb-3"
          placeholder="グループ名"
          required
        />

        <select
          class="form-select"
          aria-label="Default select example"
          v-model="data.lineBotId"
          required
        >
          <option v-for="lineBot in lineBots" :value="lineBot.id" key="lineBot.id">
            {{ `${lineBot.name} (${lineBot.basic_id})` }}
          </option>
        </select>
      </div>

      <button class="btn btn-success" type="submit">グループ作成</button>
    </form>

    <h2 class="mb-3">グループ一覧</h2>
    <div v-for="(group, index) in groups" class="mb-3">
      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex">
              {{ group.group_name }}
              <div class="ms-1">
                {{ lineBotFindById(group.line_bot_id)?.basic_id || '' }}
              </div>
            </div>
            <div>
              <span
                @click="openConfirmModal(group)"
                data-bs-toggle="modal"
                data-bs-target="#confirmModal"
              >
                <i class="bi bi-x-lg"></i>
              </span>
            </div>
          </div>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item" v-for="lineBotFriend in group.line_bot_friends">
            <div class="d-flex justify-content-between align-items-center">
              <div>{{ lineBotFriend.name }}さん</div>
              <button
                @click="openDeleteSendGroupInGroupConfirmModal(lineBotFriend, group)"
                data-bs-toggle="modal"
                data-bs-target="#confirmModal"
                class="btn btn-outline-danger btn-sm"
              >
                <i class="bi bi-dash"></i>
              </button>
            </div>
          </li>
        </ul>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">
            <button
              @click="openAddSendGroupModal(group)"
              type="button"
              class="btn btn-outline-success btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#addLineBotFriendGroupModal"
            >
              <i class="bi bi-person-add"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <AddLineBotFriendGroupModal :user-group="data.selectingSendGroup" @added-user="getGroups" />
    <ConfirmModal :message="confirmedMessage" confirmLabel="削除" @confirmed="confirmed" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type {
  IndexSendGroup,
  CreateSendGroup,
  IndexLineBot,
  SendGroup,
  User,
  LineBotFriend
} from '@/types';
import AddLineBotFriendGroupModal from './modals/AddLineBotFriendGroupModal.vue';
import ConfirmModal from './modals/ConfirmModal.vue';
import { customFetch } from '@/services/customFetch';

const data = ref({
  groupName: '',
  lineBotId: 0,
  selectingSendGroup: undefined as SendGroup | undefined,
  selectingLineBotFriend: undefined as LineBotFriend | undefined,
  openModalType: '' as 'addSendGroup' | 'deleteUserInGroup' | 'deleteSendGroup'
});

const groups = ref<IndexSendGroup['send_groups']>([]);

const getGroups = async () => {
  const res = await customFetch<IndexSendGroup>('userGroups', 'get');

  if (!res) return;

  groups.value = res.send_groups;
};
getGroups();

const createGroup = async () => {
  const body = JSON.stringify({
    groupName: data.value.groupName,
    lineBotId: data.value.lineBotId
  });

  await customFetch('userGroup', 'post', body);

  getGroups();
};

const lineBots = ref<IndexLineBot['line_bots']>([]);
const indexLineBot = async () => {
  const res = await customFetch<IndexLineBot>('lineBot', 'get');

  if (!res) return;

  lineBots.value = res.line_bots;
  data.value.lineBotId = res.line_bots[0].id;
};
indexLineBot();

const openAddSendGroupModal = (userGroup: SendGroup) => {
  data.value.selectingSendGroup = userGroup;
  data.value.openModalType = 'addSendGroup';
};

const openConfirmModal = (userGroup: SendGroup) => {
  data.value.selectingSendGroup = userGroup;
  data.value.openModalType = 'deleteSendGroup';
};

const openDeleteSendGroupInGroupConfirmModal = (
  lineBotFriend: LineBotFriend,
  userGroup: SendGroup
) => {
  data.value.selectingLineBotFriend = lineBotFriend;
  data.value.selectingSendGroup = userGroup;
  data.value.openModalType = 'deleteUserInGroup';
};

const deleteSendGroup = async () => {
  if (!data.value.selectingSendGroup) return;

  await customFetch<IndexLineBot>(`userGroup/${data.value.selectingSendGroup.id}`, 'delete');

  getGroups();
};

const deleteUserInGroup = async (lineBotFriend: LineBotFriend) => {
  if (!(data.value.selectingSendGroup && data.value.selectingLineBotFriend)) return;

  await customFetch<IndexLineBot>(
    `userGroup/${data.value.selectingSendGroup.id}/lineBotFriend/${lineBotFriend.id}`,
    'delete'
  );

  getGroups();
};

const confirmed = () => {
  switch (data.value.openModalType) {
    case 'addSendGroup':
      break;
    case 'deleteSendGroup':
      deleteSendGroup();
      break;
    case 'deleteUserInGroup':
      if (!(data.value.selectingSendGroup && data.value.selectingLineBotFriend)) return;

      deleteUserInGroup(data.value.selectingLineBotFriend);
      break;
  }
};

const confirmedMessage = computed(() => {
  switch (data.value.openModalType) {
    case 'deleteSendGroup':
      return `本当に${data.value.selectingSendGroup?.group_name}を削除しますか？`;
    case 'deleteUserInGroup':
      return `本当に${data.value.selectingSendGroup?.group_name}から${data.value.selectingLineBotFriend?.name}さんを削除しますか？`;
  }
});

const lineBotFindById = (id: number) => {
  return lineBots.value.find((lineBot) => lineBot.id === id);
};
</script>

<style scoped>
.card {
  width: 18rem;
}
</style>
