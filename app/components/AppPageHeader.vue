<template>
  <div class="header">
    <button v-if="back" class="header__back" @click="onBack">‹</button>
    <h1 class="header__title">{{ title }}</h1>
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; back?: boolean }>()
const emit = defineEmits<{ back: [] }>()
const attrs = useAttrs()
const router = useRouter()

function onBack() {
  emit('back')
  if (!attrs.onBack) router.back()
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  background: var(--tg-bg);
  z-index: 10;
}

.header__back {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--tg-button);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  -webkit-tap-highlight-color: transparent;
}

.header__title {
  flex: 1;
  font-size: 20px;
  font-weight: 600;
}
</style>
