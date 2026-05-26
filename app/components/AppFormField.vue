<template>
  <div class="field">
    <label class="field__label">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<style scoped>
.field {
  margin-bottom: 16px;
}

.field__label {
  display: block;
  font-size: 13px;
  color: var(--tg-hint);
  margin-bottom: 6px;
}
</style>
