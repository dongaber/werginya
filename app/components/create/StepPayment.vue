<template>
  <div class="step">
    <p class="step__hint">Выберите тип оплаты</p>
    <div class="cards">
      <button
        v-for="option in options"
        :key="option.value"
        class="card"
        :class="{ 'card--active': modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        <span class="card__icon" v-html="option.icon" />
        <div>
          <span class="card__label">{{ option.label }}</span>
          <span class="card__desc">{{ option.desc }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string | null }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const options = [
  {
    value: 'CASH',
    label: 'Наличка',
    desc: 'Оплата наличными при получении',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="currentColor" d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4"/>
    </svg>`,
  },
  {
    value: 'NON_CASH',
    label: 'Безналичка',
    desc: 'Оплата по счёту или переводом',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2m0 14H4v-6h16zm0-10H4V6h16z"/>
    </svg>`,
  },
]
</script>

<style scoped>
.step__hint {
  font-size: 14px;
  color: var(--tg-hint);
  margin-bottom: 16px;
}

.cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 16px;
  border: 2px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
  background: var(--tg-secondary-bg);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.card--active {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 8%, var(--tg-secondary-bg));
}

.card__icon {
  display: flex;
  color: var(--tg-button);
  flex-shrink: 0;
}

.card__label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text);
}

.card__desc {
  display: block;
  font-size: 13px;
  color: var(--tg-hint);
  margin-top: 2px;
}
</style>
