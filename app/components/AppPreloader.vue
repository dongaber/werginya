<template>
  <Transition name="preloader">
    <div v-if="visible" class="preloader">
      <AppSpinner :size="36" />
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

.preloader-leave-active {
  transition: opacity 0.3s ease;
}

.preloader-leave-to {
  opacity: 0;
}
</style>
