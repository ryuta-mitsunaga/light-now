<template>
  <div>
    <div
      class="modal fade modal-s"
      id="sendLineMessageModal"
      tabindex="-1"
      aria-labelledby="sendLineMessageModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">メッセージ送信</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-for="lineAccount in lineAccounts">
              <input
                class="btn btn-success"
                type="button"
                value="選択"
                data-bs-toggle="modal"
                data-bs-target="#sendConfirmModal"
                @click="data.selectLineAccount = lineAccount"
              />
              <span class="m-2">
                <img
                  class="img-thumbnail rounded-circle"
                  :src="lineAccount.picture_url"
                  :alt="lineAccount.name + 'さんのLINEアイコン'"
                  style="width: 60px; height: 60px"
                />
              </span>
              <span class="fw-bold fs-5">
                {{ lineAccount.name }}
              </span>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="modal fade"
      id="sendConfirmModal"
      aria-hidden="true"
      aria-labelledby="sendConfirmModalToggleLabel"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">メッセージ送信確認</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div v-if="data.selectLineAccount">
              <p>{{ data.selectLineAccount.name }}さんにLINEメッセージを送信します。</p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="backToList"
            >
              戻る
            </button>
            <button
              type="button"
              class="btn btn-success"
              data-bs-dismiss="modal"
              @click="$emit('sendLine', data.selectLineAccount?.id)"
            >
              送信
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LineAccount } from '@/types';
import { reactive } from 'vue';
import { Modal } from 'bootstrap';

defineProps<{
  lineAccounts: LineAccount[];
}>();

const data = reactive<{
  selectLineAccount: LineAccount | null;
}>({
  selectLineAccount: null
});

const backToList = () => {
  const sendConfirmModal = new Modal('#sendConfirmModal');
  sendConfirmModal.hide();

  const sendLineMessageModal = new Modal('#sendLineMessageModal');
  sendLineMessageModal.show();
};
</script>
