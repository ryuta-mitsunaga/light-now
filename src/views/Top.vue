<template>
  <div>
    <div class="mb-3">
      <div class="row">
        <div class="col col-sm-6 d-flex align-items-center">
          <input
            type="text"
            v-model="data.searchWord"
            class="form-control me-1"
            placeholder="カテゴリ / 種類 などを入力"
          />
          <input
            type="button"
            @click="getStores()"
            class="btn btn-success btn-sm me-2 h-75"
            value="検索"
          />
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
        <!-- <div>{{ data.paginate.total_count }}件</div> -->
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
            <div
              @click="interest(store)"
              class="interest-btn border rounded-3 p-1 d-flex justify-content-center align-items-center"
              :class="overInterestCount(store) ? '' : 'btn-action'"
            >
              <span v-if="overInterestCount(store)">
                <i class="bi bi-send-check"></i>
              </span>
              <span v-else style="font-size: 14px">気になる<i class="bi bi-eye-fill" /></span>
            </div>
          </div>
        </div>

        <hr />
      </div>
    </div>

    <StoreDetailModal :store="data.selectingStore" @interest="interest" />
    <SendLineMessageModal :lineAccounts="data.lineAccounts" @sendLine="sendLine" />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, reactive, ref, vModelCheckbox, watch } from 'vue';
import { useSelfUser } from '@/composables/useSelfUser';
import type { Store, IndexStoreResponse, IndexLineAccountResponse, LineAccount } from '@/types';
import StoreDetailModal from './modals/StoreDetailModal.vue';
import SendLineMessageModal from './modals/SendLineMessageModal.vue';
import { Modal } from 'bootstrap';

const selfUserComposable = inject<ReturnType<typeof useSelfUser>>('selfUserComposable');

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

const userInfo = computed(() => {
  return selfUserComposable?.state.value;
});

const getStores = (page?: number) => {
  if (
    !userInfo.value ||
    (data.paginate.current_page &&
      data.paginate.total_page &&
      data.paginate.current_page === data.paginate.total_page &&
      page &&
      page >= data.paginate.current_page)
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

  fetch(`http://localhost:3000/user/${userInfo.value.id}/store?${query}`, {
    method: 'GET',
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((res: IndexStoreResponse) => {
      if (res.status.code !== 200) {
        alert(res.status.message);
        return;
      }

      stores.value = res.stores;
      data.paginate = res.paginate;
    });
};
getStores();

const interest = async (store: Store) => {
  if (!userInfo.value || overInterestCount(store)) return;

  fetch(`http://localhost:3000/user/${userInfo.value.id}/store/${store.id}/interest`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== 200) {
        alert(res.message);
        return;
      }

      stores.value.forEach((s) => {
        if (s.id === store.id) {
          s.interest_count++;

          if (overInterestCount(s)) {
            data.sendingStore = s;
          }
        }
      });

      if (data.sendingStore) selectLineAccount();
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

const selectLineAccount = async () => {
  await fetch(`http://localhost:3000/user/1/lineAccount`, {
    method: 'GET',
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((res: IndexLineAccountResponse) => {
      if (res.status.code !== 200) {
        alert(res.status.message);
        return;
      }

      data.lineAccounts = res.line_accounts;
    });

  new Modal('#sendLineMessageModal').show();
};

const sendLine = (lineAccountId: number) => {
  if (!userInfo.value || !data.sendingStore) return;

  fetch(
    `http://localhost:3000/user/${userInfo.value.id}/store/${data.sendingStore.id}/lineAccount/${lineAccountId}/lineSendMessage`,
    {
      method: 'POST',
      credentials: 'include'
    }
  )
    .then((res) => res.json())
    .then((res) => {
      if (res.status.code !== 200) {
        alert(res.status.message);
        return;
      }

      data.sendingStore = null;
    });
};

watch(
  () => data.interestedCheck,
  () => {
    getStores();
  }
);
</script>

<style scoped lang="scss">
.interest-btn {
  width: 100px;
  height: 50px;
}
</style>
