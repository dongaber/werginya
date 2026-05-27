<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div v-if="modelValue" class="overlay" @click.self="$emit('update:modelValue', false)" />
    </Transition>

    <Transition name="sheet">
      <div v-if="modelValue" class="sheet">
        <div class="sheet__handle" />

        <div class="sheet__icon">👑</div>

        <h2 class="sheet__title">Подписка</h2>
        <p class="sheet__subtitle">Вы использовали все 5 бесплатных просмотров контактов</p>

        <ul class="benefits">
          <li class="benefit">
            <span class="benefit__icon">📋</span>
            <span class="benefit__text">Безлимитный просмотр контактов</span>
          </li>
          <li class="benefit">
            <span class="benefit__icon">⚡</span>
            <span class="benefit__text">Приоритетное размещение заявок</span>
          </li>
          <li class="benefit">
            <span class="benefit__icon">🔔</span>
            <span class="benefit__text">Уведомления о новых заявках</span>
          </li>
        </ul>

        <button class="btn btn--primary" @click="handleSubscribe">
          Оформить подписку
        </button>
        <button class="btn btn--ghost" @click="$emit('update:modelValue', false)">
          Позже
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

function handleSubscribe() {
  emit('update:modelValue', false)
  // TODO: wire to payment when ready
  navigateTo('/settings')
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 100;
}

.sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
  background: var(--tg-bg);
  border-radius: 20px 20px 0 0;
  padding: 12px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: color-mix(in srgb, var(--tg-hint) 30%, transparent);
  margin-bottom: 4px;
}

.sheet__icon {
  font-size: 48px;
  line-height: 1;
}

.sheet__title {
  font-size: 22px;
  font-weight: 700;
  color: var(--tg-text);
  margin: 0;
}

.sheet__subtitle {
  font-size: 14px;
  color: var(--tg-hint);
  text-align: center;
  line-height: 1.4;
  margin: 0;
}

.benefits {
  list-style: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 4px 0 8px;
}

.benefit {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: var(--tg-secondary-bg);
  border-radius: 12px;
}

.benefit__icon {
  font-size: 20px;
  flex-shrink: 0;
}

.benefit__text {
  font-size: 14px;
  color: var(--tg-text);
  font-weight: 500;
}

.btn {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btn--primary {
  background: var(--tg-button);
  color: var(--tg-button-text);
}

.btn--ghost {
  background: transparent;
  color: var(--tg-hint);
  font-weight: 400;
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.sheet-enter-active,
.sheet-leave-active {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  transform: translateY(100%);
}
</style>
