<template>
  <div class="main">
    <div class="header">
      <h1>PDF 文件权限校验与预览</h1>
    </div>
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="includedComponents">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, RouterView } from 'vue-router';
const router = useRouter()

// 根据路由meta中的KeepAlive字段，决定哪些组件需要被缓存
const includedComponents = computed(() => {
  const routes = router.getRoutes();
  const includeds = [];
  routes.forEach(route => {
    if (route.meta.KeepAlive) {
      includeds.push(route.name)
    }
  });
  return includeds
})
</script>
<style scoped>
.main {
  width: 100%;
  height: 100%;
}
h1 {
  font-size: 24px;
}
.header {
  width: 100%;
  height: 80px; 
  display: flex;
  align-items: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}
</style>