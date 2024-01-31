<template>
  <div>
    <form class="needs-validation mb-5" @submit.prevent="createLineBot">
      <div class="row">
        <div class="col col-12 col-sm-6">
          <div class="mb-3">
            <label for="lineChannelSecret" class="form-label">LINEチャネルシークレット</label>
            <input
              v-model="data.lineChannelSecret"
              id="lineChannelSecret"
              type="text"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="lineChannelToken" class="form-label">LINEチャネルアクセストークン</label>
            <input
              v-model="data.lineChannelToken"
              id="lineChannelToken"
              type="text"
              class="form-control"
              required
            />
          </div>

          <button class="btn btn-success" type="submit">LINEボットを登録</button>
        </div>
      </div>
    </form>

    <h2 class="mb-3">登録中のLINEボット</h2>
    <div v-for="lineBot in lineBots">
      <div class="d-flex align-items-center">
        <input
          @click="reacquisition(lineBot)"
          class="btn btn-outline-success"
          type="button"
          value="更新"
        />
        <div class="m-2 d-flex align-items-center" style="height: 80px">
          <img
            class="img-thumbnail rounded-circle"
            :src="lineBot.picture_url"
            alt="LINEアイコン"
            style="width: 60px; height: 60px"
          />
        </div>
        <span class="fw-bold fs-5 me-2">
          {{ lineBot.name }}
        </span>

        <span>
          {{ lineBot.basic_id }}
        </span>
      </div>
    </div>

    <!-- <div v-for="(group, index) in groups">
      <div class="border">
        <div class="d-flex justify-content-between">
          <p>{{ group.group_name }}</p>
          <p>{{ group.users.length }}人</p>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';
import type { IndexLineBot, LineBot } from '@/types';
import { customFetch } from '@/services/customFetch';

const data = ref({
  lineChannelSecret: '',
  lineChannelToken: ''
});

const createLineBot = async () => {
  await customFetch('lineBot', 'post', JSON.stringify(data.value));

  indexLineBot();
};

const lineBots = ref<LineBot[]>([]);
const indexLineBot = async () => {
  const res = await customFetch<IndexLineBot>('lineBot', 'get');
  lineBots.value = res?.line_bots || [];
};
indexLineBot();

const reacquisition = async (lineBot: LineBot) => {
  await customFetch<IndexLineBot>(
    `lineBot/${lineBot.id}/reacquisition`,
    'put',
    JSON.stringify(data.value)
  );
};
</script>
