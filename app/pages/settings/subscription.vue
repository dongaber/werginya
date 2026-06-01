<template>
  <div class="page">
    <AppPageHeader title="Подписка" back />

    <!-- Status card -->
    <div class="status-card" :class="isActive ? 'status-card--active' : 'status-card--inactive'">
      <div class="status-card__icon" v-html="isActive ? crownIcon : lockIcon" />
      <div>
        <p class="status-card__title">{{ isActive ? 'Подписка активна' : 'Нет подписки' }}</p>
        <p class="status-card__sub">
          {{ isActive ? `До ${formattedExpiry}` : 'Откройте доступ ко всем функциям' }}
        </p>
      </div>
    </div>

    <!-- Plans -->
    <div class="section">
      <p class="section__title">Выберите план</p>
      <div class="plans">
        <button
          v-for="plan in plans"
          :key="plan.id"
          class="plan"
          :class="{ 'plan--selected': selectedPlan === plan.id }"
          @click="selectedPlan = plan.id"
        >
          <div class="plan__top">
            <span class="plan__label">{{ plan.label }}</span>
            <span v-if="plan.badge" class="plan__badge">{{ plan.badge }}</span>
          </div>
          <span class="plan__price">{{ plan.price }} ₽</span>
          <span class="plan__per">{{ plan.per }}</span>
        </button>
      </div>
    </div>

    <div class="action">
      <button class="action__btn" :disabled="buying || isActive" @click="buy">
        <span v-if="buying"><AppSpinner :size="20" /></span>
        <span v-else>{{ isActive ? 'Подписка активна' : 'Оформить подписку' }}</span>
      </button>
      <p class="action__note">
        {{ isActive ? `Продление доступно после ${formattedExpiry}` : 'Тестовый режим — оплата не взимается' }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { telegramId } = useTelegram()

const { data, refresh } = await useFetch<{ active: boolean; expiresAt: string | null }>(
  '/api/subscription',
  { query: { telegramId: telegramId.value } }
)

const isActive = computed(() => data.value?.active ?? false)
const formattedExpiry = computed(() => {
  if (!data.value?.expiresAt) return ''
  return new Date(data.value.expiresAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const plans = [
  { id: 'month_1', label: '1 месяц', price: '299', per: '299 ₽/мес', badge: null },
  { id: 'month_3', label: '3 месяца', price: '699', per: '233 ₽/мес', badge: 'Выгодно' },
  { id: 'month_6', label: '6 месяцев', price: '1 199', per: '200 ₽/мес', badge: null },
  { id: 'month_12', label: '12 месяцев', price: '1 990', per: '166 ₽/мес', badge: 'Лучшая цена' },
]

const selectedPlan = ref('month_1')
const buying = ref(false)
const { error: showError } = useToast()

async function buy() {
  buying.value = true
  try {
    await $fetch('/api/subscription', {
      method: 'POST',
      body: { telegramId: telegramId.value, plan: selectedPlan.value },
    })
    await refresh()
  } catch (err) {
    showError(`Не удалось оформить подписку: ${errMsg(err)}`)
  } finally {
    buying.value = false
  }
}

const crownIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
  <path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1h14z"/>
</svg>`

const lockIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
  <path fill="currentColor" d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6m0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4m0 9a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2"/>
</svg>`
</script>

<style scoped>
.page {
  padding-bottom: 24px;
}

/* Status card */
.status-card {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 16px 16px 0;
  padding: 16px;
  border-radius: 16px;
}

.status-card--active {
  background: color-mix(in srgb, #f59e0b 12%, var(--tg-secondary-bg));
  border: 1.5px solid color-mix(in srgb, #f59e0b 40%, transparent);
}

.status-card--inactive {
  background: var(--tg-secondary-bg);
  border: 1.5px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
}

.status-card__icon {
  display: flex;
  flex-shrink: 0;
  color: #f59e0b;
}

.status-card--inactive .status-card__icon {
  color: var(--tg-hint);
}

.status-card__title {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text);
}

.status-card__sub {
  font-size: 13px;
  color: var(--tg-hint);
  margin-top: 2px;
}

/* Plans */
.section {
  padding: 20px 16px 0;
}

.section__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-hint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.plans {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plan {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 14px 16px;
  border-radius: 14px;
  border: 2px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
  background: var(--tg-secondary-bg);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.plan--selected {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 8%, var(--tg-secondary-bg));
}

.plan__top {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.plan__label {
  font-size: 15px;
  font-weight: 600;
  color: var(--tg-text);
}

.plan__badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 20px;
  background: color-mix(in srgb, #f59e0b 15%, transparent);
  color: #f59e0b;
}

.plan__price {
  font-size: 16px;
  font-weight: 700;
  color: var(--tg-text);
  margin-right: 4px;
}

.plan__per {
  font-size: 11px;
  color: var(--tg-hint);
  min-width: 72px;
  text-align: right;
}

/* Action */
.action {
  padding: 20px 16px 0;
}

.action__btn {
  width: 100%;
  padding: 15px;
  border-radius: 14px;
  border: none;
  background: var(--tg-button);
  color: var(--tg-button-text);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  transition: opacity 0.15s ease;
}

.action__btn:disabled {
  opacity: 0.5;
}

.action__note {
  text-align: center;
  font-size: 12px;
  color: var(--tg-hint);
  margin-top: 10px;
}
</style>
