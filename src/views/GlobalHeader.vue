<template>
  <div class="d-flex justify-content-between align-items-center" style="height: 60px">
    <!-- <div>da</div>
    <h1 class="fw-bold fs-2">ライなう</h1>
    <div></div> -->

    <nav class="navbar navbar-dark bg-success fixed-top">
      <div class="container-fluid">
        <router-link class="navbar-brand" to="/">ライなう</router-link>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasDarkNavbar"
          aria-controls="offcanvasDarkNavbar"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="offcanvas offcanvas-end text-bg-success"
          tabindex="-1"
          id="offcanvasDarkNavbar"
          aria-labelledby="offcanvasDarkNavbarLabel"
        >
          <div class="offcanvas-header">
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body text-white">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item" data-bs-dismiss="offcanvas">
                <router-link class="nav-link active" to="/myPage">マイページ</router-link>
              </li>
              <li class="nav-item" data-bs-dismiss="offcanvas">
                <router-link class="nav-link active" to="/userGroups"
                  >ユーザーグループ設定</router-link
                >
              </li>
              <li class="nav-item" data-bs-dismiss="offcanvas">
                <router-link class="nav-link active" to="/lineBot">LINEボット設定</router-link>
              </li>
              <li class="nav-item" data-bs-dismiss="offcanvas">
                <a class="nav-link active" aria-current="page" @click="logout">ログアウト</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useSelfUser } from '@/composables/useSelfUser';
import { computed, inject } from 'vue';

const selfUser = inject('selfUserComposable') as ReturnType<typeof useSelfUser>;

const logout = () => {
  selfUser.logout();
};
</script>
