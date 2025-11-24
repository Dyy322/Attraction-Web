<template>
  <!-- 路由出口：根据网址显示 Login.vue 或 AppLayout.vue -->
  <router-view />
</template>

<script setup>
// 这里通常不需要写任何逻辑
</script>

<style>
/*
  确保 html, body 和 #app 占满全屏
  这样我们布局里的 h-screen 才能生效
*/
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>