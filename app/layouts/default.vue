<template>
  <div class="layout">
    <main class="layout__content">
      <slot />
    </main>
    <AppNav />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.layout__content {
  flex: 1;
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}
</style>
