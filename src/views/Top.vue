<template>
  <div class="mb-3">
    <div class="row">
      <div class="col col-sm-6 d-flex">
        <input
          type="text"
          v-model="data.searchWord"
          class="form-control me-1"
          placeholder="カテゴリ / 種類 などを入力"
        />
        <input type="button" @click="getStores" class="btn btn-primary" value="検索" />
      </div>
    </div>
  </div>

  <div class="mb-3">
    <span>{{ data.paginate }}件</span>
    <nav aria-label="Store page navigation">
      <ul class="pagination justify-content-center">
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li class="page-item" v-for="page in data.paginate.total_page" @click="getStores(page)">
          <span class="page-link">{{ page }}</span>
        </li>
        <li class="page-item"><a class="page-link" href="#">1</a></li>
        <li class="page-item"><a class="page-link" href="#">2</a></li>
        <li class="page-item"><a class="page-link" href="#">3</a></li>
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
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

  <!-- Modal -->
  <div
    class="modal fade modal-xl"
    id="storeDetailModal"
    tabindex="-1"
    aria-labelledby="storeDetailModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-body">
          <iframe
            class="w-100"
            v-if="data.selectingStore"
            frameborder="1"
            :src="data.selectingStore.url"
            style="height: 70vh"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
          <button type="button" class="btn btn-primary">気になる</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import router from '@/router';
import { computed, inject, reactive, ref } from 'vue';
import { useSelfUser } from '@/composables/useSelfUser';
import type { Store, IndexStoreResponse } from '@/types';

const selfUserComposable = inject<ReturnType<typeof useSelfUser>>('selfUserComposable');

// type Store = {
//   id: number;
//   name: string;
//   category: string;
//   interestCount: number;
//   url: string;
//   isSent: boolean;
// };

const data = reactive<{
  selectingStore: Store | null;
  searchWord: string;
  paginate: IndexStoreResponse['paginate'];
}>({
  selectingStore: null,
  searchWord: '',
  paginate: {
    total_count: 0,
    total_page: 0,
    current_page: 0
  }
});

const stores = ref<Store[]>([]);

const openDetail = (store: Store) => {
  data.selectingStore = store;
};

const userInfo = computed(() => {
  return selfUserComposable?.state.value;
});

const getStores = (page?: number) => {
  if (!userInfo.value) return;

  const params = { keyword: data.searchWord, page: page || data.paginate.current_page };
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

const interest = (store: Store) => {
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
        if (s.id === store.id) s.interest_count++;
      });
    });

  // const target = stores.value.find((s) => s.id === store.id);
  // if (target && target.interestCount > 100) {
  //   target.isSent = true;
  // } else if (target) {
  //   target.interestCount += 1;
  // }
};

const overInterestCount = (store: Store) => store.interest_count >= 30;
</script>

<style scoped>
.interest-btn {
  width: 100px;
  height: 50px;
}
</style>
