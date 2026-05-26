<template>
  <Transition name="preloader">
    <div v-if="visible" class="preloader">
      <div class="preloader__spinner" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
const visible = ref(true)

onMounted(() => {
  visible.value = false
})
</script>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tg-bg);
}

.preloader__spinner {
  width: 36px;
  height: 36px;
  border: 3px solid color-mix(in srgb, var(--tg-button) 20%, transparent);
  border-top-color: var(--tg-button);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preloader-leave-active {
  transition: opacity 0.3s ease;
}

.preloader-leave-to {
  opacity: 0;
}
</style>
