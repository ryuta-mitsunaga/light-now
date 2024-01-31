<template>
  <div
    class="modal fade"
    id="confirmModal"
    aria-hidden="true"
    aria-labelledby="confirmModalToggleLabel"
    tabindex="-1"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">確認</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <p>{{ message }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="$emit('cancel')"
          >
            キャンセル
          </button>
          <button
            type="button"
            class="btn btn-success"
            data-bs-dismiss="modal"
            @click="$emit('confirmed')"
          >
            {{ confirmLabel }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string;
  confirmLabel: string;
}>();
</script>
