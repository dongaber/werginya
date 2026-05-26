<template>
  <div class="spinner" :style="{ width: size + 'px', height: size + 'px' }" />
</template>

<script setup lang="ts">
defineProps<{ size?: number }>()
</script>

<style scoped>
.spinner {
  border: 3px solid color-mix(in srgb, var(--tg-button) 20%, transparent);
  border-top-color: var(--tg-button);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
