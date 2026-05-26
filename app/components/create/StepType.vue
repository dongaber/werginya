<template>
  <div class="step">
    <p class="step__hint">Выберите тип заявки</p>
    <div class="cards">
      <button
        v-for="option in options"
        :key="option.value"
        class="card"
        :class="{ 'card--active': modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        <span class="card__icon" v-html="option.icon" />
        <span class="card__label">{{ option.label }}</span>
        <span class="card__desc">{{ option.desc }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ modelValue: string | null }>()
defineEmits<{ 'update:modelValue': [value: string] }>()

const options = [
  {
    value: 'RENTAL',
    label: 'Аренда',
    desc: 'Аренда спецтехники на срок',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m6 13H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/>
    </svg>`,
  },
  {
    value: 'TRANSPORTATION',
    label: 'Перевозка',
    desc: 'Перевозка груза спецтехникой',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m13.5-9 1.96 2.5H17V9.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5"/>
    </svg>`,
  },
  {
    value: 'DELIVERY',
    label: 'Доставка',
    desc: 'Доставка груза по адресу',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
      <path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5zm-5 0v3H5V6h10z"/>
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
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text);
  display: block;
}

.card__desc {
  display: block;
  font-size: 13px;
  color: var(--tg-hint);
  margin-top: 2px;
}

.card__icon ~ .card__label {
  display: flex;
  flex-direction: column;
}
</style>
