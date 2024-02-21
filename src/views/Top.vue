<template>
  <div>
    <div class="mb-3">
      <div class="row">
        <div class="col col-sm-6">
          <div class="input-group mb-1">
            <input
              type="text"
              v-model="data.searchWord"
              class="form-control"
              placeholder="カテゴリ / 種類 などを入力"
            />
            <button class="btn btn-outline-success" @click="getStores()" type="button">検索</button>
          </div>

          <div class="d-flex align-items-end">
            <div class="form-check" style="width: 150px">
              <input
                class="form-check-input"
                type="checkbox"
                v-model="data.interestedCheck"
                id="interestedCheck"
              />
              <label class="form-check-label" for="interestedCheck"> 気になる済み </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <div v-if="data.showPagination && data.paginate.total_count > 10">
        <nav aria-label="Store page navigation" class="me-1">
          <ul class="pagination pagination-sm justify-content-end mb-0">
            <li
              v-if="data.paginate.current_page - 1 !== -1"
              @click="getStores(data.paginate.current_page - 1)"
              class="page-item"
            >
              <span class="page-link" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </span>
            </li>
            <template v-for="(page, i) in paginationNum">
              <span>
                <li
                  class="page-item"
                  @click="getStores(page)"
                  :class="{ active: page === data.paginate.current_page }"
                >
                  <span class="page-link">{{ i !== 4 ? page : '...' }}</span>
                </li>
              </span>
            </template>

            <li class="page-item" @click="getStores(data.paginate.total_page)">
              <span class="page-link">{{ data.paginate.total_page }}</span>
            </li>

            <li
              @click="getStores(data.paginate.current_page + 1)"
              class="page-item"
              :class="{ disabled: data.paginate.current_page === data.paginate.total_page }"
            >
              <div class="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <div style="user-select: none">
      <div v-for="store in stores">
        <div class="d-flex justify-content-between align-items-center">
          <div class="me-3">
            <h2
              @click="openDetail(store)"
              class="fw-bold fs-5 mb-0 text-decoration-underline cursor-pointer"
              data-bs-toggle="modal"
              data-bs-target="#storeDetailModal"
            >
              {{ store.name }}
            </h2>
            <div>
              {{ store.genre }}
            </div>
            <div>
              <span v-if="overInterestCount(store)">
                <i class="bi bi-check-lg"></i>
              </span>
              <meter v-else max="30" low="10" high="25" optimum="5" :value="store.interest_count" />
            </div>
          </div>
          <div>
            <button
              @click="interest(store)"
              class="interest-btn btn border rounded-3 p-1 d-flex justify-content-center align-items-center btn-action"
              :class="overInterestCount(store) ? 'btn-outline-secondary' : 'btn-outline-success'"
            >
              <span v-if="overInterestCount(store)"> リセット </span>
              <span v-else style="font-size: 14px">気になる<i class="bi bi-eye-fill" /></span>
            </button>
          </div>
        </div>

        <hr />
      </div>
    </div>

    <div v-if="data.showPagination && data.paginate.total_count > 10">
      <nav aria-label="Store page navigation" class="me-1">
        <ul class="pagination pagination-sm justify-content-end mb-0">
          <li
            v-if="data.paginate.current_page - 1 !== -1"
            @click="getStores(data.paginate.current_page - 1)"
            class="page-item"
          >
            <span class="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </span>
          </li>
          <template v-for="(page, i) in paginationNum">
            <span>
              <li
                class="page-item"
                @click="getStores(page)"
                :class="{ active: page === data.paginate.current_page }"
              >
                <span class="page-link">{{ i !== 4 ? page : '...' }}</span>
              </li>
            </span>
          </template>

          <li class="page-item" @click="getStores(data.paginate.total_page)">
            <span class="page-link">{{ data.paginate.total_page }}</span>
          </li>

          <li
            @click="getStores(data.paginate.current_page + 1)"
            class="page-item"
            :class="{ disabled: data.paginate.current_page === data.paginate.total_page }"
          >
            <div class="page-link" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </div>
          </li>
        </ul>
      </nav>
    </div>

    <div>
      <h3>チャット</h3>
      <div>
        <button @click="sendChat" class="btn">チャット開始</button>
      </div>
    </div>

    <StoreDetailModal :store="data.selectingStore" @interest="interest" />
    <SendLineMessageModal :user-groups="userGroups" @sendLine="sendLine" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, ref, vModelCheckbox, watch } from 'vue';
import { useSelfUser } from '@/composables/useSelfUser';
import type {
  Store,
  IndexStoreResponse,
  IndexLineAccountResponse,
  LineAccount,
  IndexLineBot,
  IndexSendGroup,
  SendGroup
} from '@/types';
import StoreDetailModal from './modals/StoreDetailModal.vue';
import SendLineMessageModal from './modals/SendLineMessageModal.vue';
import { Modal } from 'bootstrap';
import router from '@/router';
import { customFetch } from '@/services/customFetch';
import ActionCable from 'actioncable';

const data = reactive<{
  selectingStore: Store | null;
  searchWord: string;
  paginate: IndexStoreResponse['paginate'];
  interestedCheck: boolean;
  showPagination: boolean;
  lineAccounts: IndexLineAccountResponse['line_accounts'];
  sendingStore: Store | null;
  tempSearchWord: string;
}>({
  selectingStore: null,
  searchWord: '',
  paginate: {
    total_count: 0,
    total_page: 0,
    current_page: 0
  },
  interestedCheck: false,
  showPagination: true,
  lineAccounts: [],
  sendingStore: null,
  tempSearchWord: ''
});

const stores = ref<Store[]>([]);

const openDetail = (store: Store) => {
  data.selectingStore = store;
};

const getStores = async (page?: number) => {
  if (
    data.paginate.current_page &&
    data.paginate.total_page &&
    data.paginate.current_page === data.paginate.total_page &&
    page &&
    page >= data.paginate.current_page
  )
    return;

  if (page === undefined) {
    page = 0;
    data.tempSearchWord = data.searchWord;
  } else {
    data.searchWord = data.tempSearchWord;
  }

  data.showPagination = !data.interestedCheck;

  const params = {
    keyword: data.searchWord,
    page: page?.toString() || '0',
    interested: data.interestedCheck.toString()
  };
  const query = new URLSearchParams(params);

  customFetch<IndexStoreResponse>(`store?${query}`, 'get').then((res) => {
    if (!res) return;

    stores.value = res.stores;
    data.paginate = res.paginate;
  });
};
getStores();

const interest = async (store: Store) => {
  // 30以上気になる済みの場合はリセット
  if (overInterestCount(store)) return clearInterest(store);

  await customFetch(`store/${store.id}/interest`, 'post');

  stores.value.forEach((s) => {
    if (s.id === store.id) {
      s.interest_count++;

      if (overInterestCount(s)) {
        data.sendingStore = s;
      }
    }
  });

  if (data.sendingStore) selectLineAccount();
};

const clearInterest = async (store: Store) => {
  await customFetch(`store/${store.id}/interest`, 'delete');

  stores.value.forEach((s) => {
    if (s.id === store.id) {
      s.interest_count = 0;
    }
  });
};

const overInterestCount = (store: Store) => store.interest_count >= 30;

const paginationNum = computed(() => {
  let limit = data.paginate.current_page + 5;
  let startPage = data.paginate.current_page;

  if (limit > data.paginate.total_page) {
    limit = data.paginate.total_page;

    startPage = data.paginate.total_page - 4;
  }

  const pages = [];
  for (let i = startPage; i < limit; i++) {
    if (i >= data.paginate.total_page) break;
    pages.push(i);
  }

  return pages;
});

const userGroups = ref<IndexSendGroup['send_groups']>([]);
const selectLineAccount = async () => {
  const res = await customFetch<IndexSendGroup>('userGroups', 'get');

  if (!res) return;

  userGroups.value = res.send_groups;

  new Modal('#sendLineMessageModal').show();
};

const sendLine = async (userGroupId: number) => {
  if (!data.sendingStore) return;

  await customFetch(
    `store/${data.sendingStore.id}/userGroup/${userGroupId}/lineSendMessage`,
    'post'
  );

  data.sendingStore = null;
};

watch(
  () => data.interestedCheck,
  () => {
    getStores();
  }
);

const cable = ActionCable.createConsumer('ws://localhost:3000/cable');
const chatChannel = cable.subscriptions.create('ChatChannel', {
  connected() {
    console.log('connected');
  },
  disconnected() {
    console.log('disconnected');
  },
  received(data) {
    console.log(data);
  }
});

const sendChat = () => {
  chatChannel.perform('send_message', { message: 'hello' });
};
</script>

<style scoped lang="scss">
.interest-btn {
  width: 100px;
  height: 50px;
}
</style>
