<template>
  <div>
    <div
      class="modal fade modal-s"
      id="addUserGroupModal"
      tabindex="-1"
      aria-labelledby="addUserGroupModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">ユーザー追加</h5>
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
                v-model="data.searchEmail"
                @keyup.enter="searchUser"
                type="email"
                class="form-control"
                placeholder="メールアドレスで検索"
                aria-label="メールアドレスで検索"
              />
              <button @click="searchUser" class="btn btn-outline-success" type="button">
                検索
              </button>
            </div>

            <div v-if="data.resultUser">
              <button
                @click="addUser(data.resultUser)"
                class="btn btn-success btn-sm me-2"
                data-bs-dismiss="modal"
              >
                追加
              </button>
              <span>{{ data.resultUser.name }}さん</span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { customFetch } from '@/services/customFetch';
import type { SearchUser, User, UserGroup, AddUser } from '@/types';
import { ref } from 'vue';

const props = defineProps<{
  userGroup?: UserGroup;
}>();

const emit = defineEmits(['addedUser']);

const data = ref({
  resultUser: undefined as User | undefined,
  searchEmail: ''
});

const searchUser = async () => {
  const url = `user/search`;
  const params = new URLSearchParams();
  params.append('email', data.value.searchEmail);

  const res = await customFetch<SearchUser>(`search/?${params.toString()}`, 'get');

  if (!res) return;

  data.value.resultUser = res.user;
};

const addUser = async (user: User) => {
  if (!props.userGroup) return;

  const body = JSON.stringify({
    userId: user.id
  });

  await customFetch<SearchUser>(`userGroup/${props.userGroup.id}/addUser`, 'post', body);

  emit('addedUser');
};
</script>
