<template>
  <Transition name="sheet">
    <div v-if="modelValue" class="backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="sheet">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex;
  align-items: flex-end;
  z-index: 200;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.sheet {
  background: var(--tg-bg);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.2s ease;
}

.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.2s ease;
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}

.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}
</style>
