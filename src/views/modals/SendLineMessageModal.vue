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
            <div v-for="(group, index) in userGroups" class="mb-3">
              <div class="card">
                <div class="card-header">
                  <div class="d-flex justify-content-between">
                    <div class="d-flex justify-content-between align-items-center">
                      {{ group.group_name }}
                    </div>
                    <input
                      class="btn btn-success btn-sm"
                      type="button"
                      value="選択"
                      data-bs-toggle="modal"
                      data-bs-target="#sendConfirmModal"
                      @click="data.selectSendGroup = group"
                    />
                  </div>
                </div>
                <ul class="list-group list-group-flush">
                  <li class="list-group-item" v-for="lineBotFriend in group.line_bot_friends">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>{{ lineBotFriend.name }}さん</div>
                    </div>
                  </li>
                </ul>
              </div>
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
            <div v-if="data.selectSendGroup">
              <p>{{ data.selectSendGroup.group_name }}にLINEメッセージを送信します。</p>
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
              @click="$emit('sendLine', data.selectSendGroup?.id)"
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
import type { IndexSendGroup, LineAccount, LineBot, User, SendGroup } from '@/types';
import { reactive } from 'vue';
import { Modal } from 'bootstrap';

defineProps<{
  userGroups: IndexSendGroup['send_groups'];
}>();

const data = reactive<{
  selectSendGroup: IndexSendGroup['send_groups'][number] | null;
}>({
  selectSendGroup: null
});

const backToList = () => {
  const sendConfirmModal = new Modal('#sendConfirmModal');
  sendConfirmModal.hide();

  const sendLineMessageModal = new Modal('#sendLineMessageModal');
  sendLineMessageModal.show();
};
</script>
