<template>
  <div class="layout">
    <main class="layout__content" :class="{ 'layout__content--full': route.path === '/create' }">
      <slot />
    </main>
    <AppNav v-if="route.path !== '/create'" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: var(--sa-top);
}

.layout__content {
  flex: 1;
  padding-bottom: calc(80px + var(--sa-bottom));
}

.layout__content--full {
  padding-bottom: 0;
}
</style>
