<template>
  <div style="user-select: none">
    <div v-for="store in stores">
      <div>
        <span v-if="store.isSent">
          <i class="bi bi-send-check"></i>
        </span>
        <span
          v-else
          @click="interest(store)"
          class="interest-btn border rounded-pill p-1 text-center"
          style="cursor: pointer"
        >
          <span style="font-size: 10px">気になる</span><i class="bi bi-eye-fill" />
        </span>
      </div>
      <h2
        @click="openDetail(store)"
        class="fw-bold fs-5 mb-0 text-decoration-underline"
        data-bs-toggle="modal"
        data-bs-target="#storeDetailModal"
      >
        {{ store.name }}
        {{ store.genre }}
      </h2>
      <div>{{ store.category }}</div>
      <div>
        <span v-if="store.isSent">
          <i class="bi bi-check-lg"></i>
        </span>
        <meter v-else max="100" low="20" high="80" optimum="10" :value="store.interestCount">
          10%
        </meter>
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
import type { Store } from '@/types';

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
}>({
  selectingStore: null
});

const stores = ref<Store[]>([
  // {
  //   id: 1,
  //   name: 'シースケープ　テラス・ダイニング',
  //   category: '焼肉',
  //   interestCount: 10,
  //   url: 'https://www.hotpepper.jp/strJ001266951/',
  //   isSent: false
  // },
  // {
  //   id: 2,
  //   name: 'store2',
  //   category: 'カレー',
  //   interestCount: 20,
  //   url: 'https://www.hotpepper.jp/strJ001266951/',
  //   isSent: false
  // },
  // {
  //   id: 3,
  //   name: 'store3',
  //   category: '寿司',
  //   interestCount: 90,
  //   url: 'https://www.hotpepper.jp/strJ001266951/',
  //   isSent: false
  // }
]);

const openDetail = (store: Store) => {
  data.selectingStore = store;
};

const userInfo = computed(() => {
  return selfUserComposable?.state.value;
});

const getStores = () => {
  if (!userInfo.value) return;

  fetch(`http://localhost:3000/user/${userInfo.value.id}/store`, {
    method: 'GET',
    credentials: 'include'
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status !== 200) {
        alert(res.message);
        return;
      }
      stores.value = res.stores.columns;
    });
};
getStores();

const interest = (store: Store) => {
  if (!userInfo.value) return;

  fetch(`http://localhost:3000/user/${userInfo.value.id}/store/1/interest`, {
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
      router.push('/');
    });

  // const target = stores.value.find((s) => s.id === store.id);
  // if (target && target.interestCount > 100) {
  //   target.isSent = true;
  // } else if (target) {
  //   target.interestCount += 1;
  // }
};
</script>

<style scoped>
.interest-btn {
  transition: transform 0.2s;
  display: inline-block;
  &:active {
    transform: scale(0.95);
  }
}
</style>
