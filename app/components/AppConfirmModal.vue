<template>
  <AppBottomSheet :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <h2 class="title">{{ title }}</h2>
    <p v-if="message" class="message">{{ message }}</p>
    <div class="actions">
      <button class="btn btn--cancel" @click="$emit('update:modelValue', false)">Отмена</button>
      <button class="btn btn--confirm" :disabled="loading" @click="$emit('confirm')">
        {{ loading ? '...' : confirmLabel }}
      </button>
    </div>
  </AppBottomSheet>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  message?: string
  confirmLabel?: string
  loading?: boolean
}>()

defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()
</script>

<style scoped>
.title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.message {
  font-size: 14px;
  color: var(--tg-hint);
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
}

.btn--cancel {
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
}

.btn--confirm {
  background: #ff3b30;
  color: #fff;
}
</style>
