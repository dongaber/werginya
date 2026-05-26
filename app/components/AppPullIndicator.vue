<template>
  <div class="ptr" :style="{ height: pullY + 'px' }">
    <div
      class="ptr__spinner"
      :style="{
        opacity: progress,
        transform: `rotate(${progress * 360}deg) scale(${0.5 + progress * 0.5})`,
        transition: refreshing ? 'none' : 'opacity 0.1s, transform 0.1s',
      }"
    >
      <AppSpinner :size="24" :spinning="refreshing" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  pullY: number
  progress: number
  refreshing: boolean
}>()
</script>

<style scoped>
.ptr {
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 6px;
  transition: height 0.25s ease;
  will-change: height;
}

.ptr__spinner {
  display: flex;
  will-change: transform, opacity;
}
</style>
