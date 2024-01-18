<template>
  <div class="d-flex justify-content-between align-items-center" style="height: 60px">
    <!-- <div>da</div>
    <h1 class="fw-bold fs-2">ライなう</h1>
    <div></div> -->

    <nav class="navbar navbar-dark bg-success fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">ライなう2</a>
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
              <li class="nav-item">
                <a class="nav-link active" href="#">店舗登録</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">ユーザーグループ設定</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">ログアウト</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
