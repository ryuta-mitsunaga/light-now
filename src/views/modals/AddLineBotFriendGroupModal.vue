<template>
  <div>
    <div
      class="modal fade modal-s"
      id="addLineBotFriendGroupModal"
      tabindex="-1"
      aria-labelledby="addLineBotFriendGroupModalLabel"
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
                v-model="data.keyword"
                @keyup.enter="search"
                type="text"
                class="form-control"
                placeholder="メールアドレスで検索"
                aria-label="メールアドレスで検索"
              />
              <button @click="search" class="btn btn-outline-success" type="button">検索</button>
            </div>

            <div class="mb-2" v-for="lineBotFriend in data.lineBotFriends">
              <button
                @click="addLineBotFriend(lineBotFriend)"
                class="btn btn-success btn-sm me-2"
                data-bs-dismiss="modal"
                :disabled="isRegistered(lineBotFriend)"
              >
                {{ isRegistered(lineBotFriend) ? '追加済み' : '追加' }}
              </button>
              <span>{{ lineBotFriend.name }}さん</span>
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
import type {
  SearchUser,
  User,
  SendGroup,
  LineBotFriend,
  IndexLineBotFriend,
  IndexSendGroup
} from '@/types';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  userGroup?: SendGroup;
}>();

const emit = defineEmits(['addedUser']);

const data = ref({
  lineBotFriends: undefined as IndexLineBotFriend['line_bot_friends'] | undefined,
  keyword: ''
});

const search = async () => {
  const url = `user/search`;
  const params = new URLSearchParams();
  params.append('keyword', data.value.keyword);

  const res = await customFetch<IndexLineBotFriend>(
    `lineBot/${props.userGroup?.line_bot_id}/friends?${params.toString()}`,
    'get'
  );

  if (!res) return;

  data.value.lineBotFriends = res.line_bot_friends;
};

const addLineBotFriend = async (lineBotFriend: LineBotFriend) => {
  if (!props.userGroup) return;

  const body = JSON.stringify({
    lineBotFriendId: lineBotFriend.id
  });

  await customFetch<SearchUser>(`userGroup/${props.userGroup.id}/addLineBotFriend`, 'post', body);

  emit('addedUser');
};

const isRegistered = (lineBotFriend: LineBotFriend) => {
  if (!props.userGroup) return false;

  return props.userGroup.line_bot_friends?.some(
    (_lineBotFriend) => _lineBotFriend.line_user_id === lineBotFriend.line_user_id
  );
};

const modalEl = ref<HTMLElement | null>(null);
onMounted(() => {
  modalEl.value = document.getElementById('addLineBotFriendGroupModal');
  modalEl.value?.addEventListener('shown.bs.modal', (event) => {
    search();
  });

  modalEl.value?.addEventListener('hidden.bs.modal', (event) => {
    data.value.keyword = '';
  });
});

onUnmounted(() => {
  modalEl.value?.removeEventListener('shown.bs.modal', (event) => {
    search();
  });

  modalEl.value?.addEventListener('hidden.bs.modal', (event) => {
    data.value.keyword = '';
  });
});
</script>
