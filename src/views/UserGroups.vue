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
            {{ group.group_name }}
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
          <li class="list-group-item" v-for="user in group.users">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                {{ user.name }}
              </div>
              <button
                @click="openDeleteUserGroupInGroupConfirmModal(user, group)"
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
              @click="openAddUserGroupModal(group)"
              type="button"
              class="btn btn-outline-success btn-sm me-2"
              data-bs-toggle="modal"
              data-bs-target="#addUserGroupModal"
            >
              <i class="bi bi-person-add"></i>
            </button>
          </li>
        </ul>
      </div>
    </div>

    <AddUserGroupModal :user-group="data.selectingUserGroup" @added-user="getGroups" />
    <ConfirmModal :message="confirmedMessage" confirmLabel="削除" @confirmed="confirmed" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { IndexUserGroup, CreateUserGroup, IndexLineBot, UserGroup, User } from '@/types';
import router from '@/router';
import AddUserGroupModal from './modals/AddUserGroupModal.vue';
import ConfirmModal from './modals/ConfirmModal.vue';
import { customFetch } from '@/services/customFetch';

const data = ref({
  groupName: '',
  lineBotId: 0,
  selectingUserGroup: undefined as UserGroup | undefined,
  selectingUser: undefined as User | undefined,
  opeModalType: '' as 'addUserGroup' | 'deleteUserInGroup' | 'deleteUserGroup'
});

const groups = ref<IndexUserGroup['user_groups']>([]);

const getGroups = async () => {
  const res = await customFetch<IndexUserGroup>('userGroups', 'get');

  if (!res) return;

  groups.value = res.user_groups;
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

const openAddUserGroupModal = (userGroup: UserGroup) => {
  data.value.selectingUserGroup = userGroup;
  data.value.opeModalType = 'addUserGroup';
};

const openConfirmModal = (userGroup: UserGroup) => {
  data.value.selectingUserGroup = userGroup;
  data.value.opeModalType = 'deleteUserGroup';
};

const openDeleteUserGroupInGroupConfirmModal = (user: User, userGroup: UserGroup) => {
  data.value.selectingUser = user;
  data.value.selectingUserGroup = userGroup;
  data.value.opeModalType = 'deleteUserInGroup';
};

const deleteUserGroup = async () => {
  if (!data.value.selectingUserGroup) return;

  await customFetch<IndexLineBot>(`userGroup/${data.value.selectingUserGroup.id}`, 'delete');

  getGroups();
};

const deleteUserInGroup = async (user: User, userGroup: UserGroup) => {
  if (!(data.value.selectingUserGroup && data.value.selectingUser)) return;

  await customFetch<IndexLineBot>(
    `userGroup/${data.value.selectingUserGroup.id}/user/${user.id}`,
    'delete'
  );

  getGroups();
};

const confirmed = () => {
  switch (data.value.opeModalType) {
    case 'addUserGroup':
      break;
    case 'deleteUserGroup':
      deleteUserGroup();
      break;
    case 'deleteUserInGroup':
      if (!(data.value.selectingUserGroup && data.value.selectingUser)) return;

      deleteUserInGroup(data.value.selectingUser, data.value.selectingUserGroup);
      break;
  }
};

const confirmedMessage = computed(() => {
  switch (data.value.opeModalType) {
    case 'deleteUserGroup':
      return `本当に${data.value.selectingUserGroup?.group_name}を削除しますか？`;
    case 'deleteUserInGroup':
      return `本当に${data.value.selectingUserGroup?.group_name}から${data.value.selectingUser?.name}さんを削除しますか？`;
  }
});
</script>

<style scoped>
.card {
  width: 18rem;
}
</style>
