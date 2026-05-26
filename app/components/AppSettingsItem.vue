<template>
  <NuxtLink :to="to" class="item">
    <span v-if="icon" class="item__icon" v-html="icon" />
    <span class="item__label">{{ label }}</span>
    <span class="item__arrow">›</span>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ to: string; label: string; icon?: string }>()
</script>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  text-decoration: none;
  color: var(--tg-text);
  border-bottom: 1px solid color-mix(in srgb, var(--tg-hint) 15%, transparent);
  transition: opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.item:last-child {
  border-bottom: none;
}

.item:active {
  opacity: 0.6;
}

.item__icon {
  display: flex;
  color: var(--tg-button);
  flex-shrink: 0;
}

.item__label {
  flex: 1;
  font-size: 16px;
}

.item__arrow {
  color: var(--tg-hint);
  font-size: 20px;
  line-height: 1;
}
</style>
