<template>
  <form>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input type="email" class="form-control" id="email" />
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" />
    </div>

    <button @click="$router.push('/')" type="submit" class="btn btn-primary me-2">ログイン</button>
    <button type="button" class="btn btn-secondary" @click="$router.push('signUp')">登録</button>
  </form>
</template>
