<template>
  <div class="step">
    <p class="step__hint">Проверьте данные перед отправкой</p>

    <div class="review-list">
      <div class="review-item">
        <span class="review-item__label">Тип заявки</span>
        <span class="review-item__value">{{ typeLabel }}</span>
      </div>

      <div class="review-item">
        <span class="review-item__label">Оплата</span>
        <span class="review-item__value">{{ paymentLabel }}</span>
      </div>

      <template v-if="type === 'RENTAL' || type === 'TRANSPORTATION'">
        <div class="review-item">
          <span class="review-item__label">Вид техники</span>
          <span class="review-item__value">{{ equipmentName }}</span>
        </div>
      </template>

      <template v-if="type === 'TRANSPORTATION' || type === 'DELIVERY'">
        <div class="review-item">
          <span class="review-item__label">Груз</span>
          <span class="review-item__value">{{ form.cargo || '—' }}</span>
        </div>
      </template>

      <template v-if="type === 'TRANSPORTATION'">
        <div class="review-item">
          <span class="review-item__label">Откуда</span>
          <span class="review-item__value">{{ form.fromAddress || '—' }}</span>
        </div>
      </template>

      <div class="review-item">
        <span class="review-item__label">Куда</span>
        <span class="review-item__value">{{ toAddressValue || '—' }}</span>
      </div>

      <div class="review-item">
        <span class="review-item__label">Когда</span>
        <span class="review-item__value">{{ formattedDate }}</span>
      </div>

      <template v-if="type === 'RENTAL'">
        <div class="review-item">
          <span class="review-item__label">Срок</span>
          <span class="review-item__value">{{ form.durationDays }} {{ daysLabel }}</span>
        </div>
      </template>

      <template v-if="type === 'TRANSPORTATION'">
        <div class="review-item">
          <span class="review-item__label">Ставка</span>
          <span class="review-item__value">{{ form.ratePerHour }} ₽/час</span>
        </div>
      </template>

      <template v-if="type === 'DELIVERY'">
        <div class="review-item">
          <span class="review-item__label">Объём</span>
          <span class="review-item__value">{{ form.volume || '—' }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  type: string
  paymentType: string | null
  form: Record<string, any>
  equipmentTypes: { id: number; name: string; icon: string }[] | null
}>()

const typeLabels: Record<string, string> = {
  RENTAL: 'Аренда',
  TRANSPORTATION: 'Перевозка',
  DELIVERY: 'Доставка',
}

const paymentLabels: Record<string, string> = {
  CASH: 'Наличка',
  NON_CASH: 'Безналичка',
}

const typeLabel = computed(() => typeLabels[props.type] ?? props.type)
const paymentLabel = computed(() => (props.paymentType ? paymentLabels[props.paymentType] ?? props.paymentType : '—'))

const equipmentName = computed(() => {
  if (!props.form.equipmentTypeId || !props.equipmentTypes) return '—'
  return props.equipmentTypes.find((e) => e.id === props.form.equipmentTypeId)?.name ?? '—'
})

const toAddressValue = computed(() =>
  props.type === 'RENTAL' ? props.form.address : props.form.toAddress
)

const formattedDate = computed(() => {
  if (!props.form.startsAt) return '—'
  return new Date(props.form.startsAt).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const daysLabel = computed(() => {
  const n = props.form.durationDays
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'дня'
  return 'дней'
})
</script>

<style scoped>
.step__hint {
  font-size: 14px;
  color: var(--tg-hint);
  margin-bottom: 16px;
}

.review-list {
  background: var(--tg-secondary-bg);
  border-radius: 16px;
  overflow: hidden;
}

.review-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
}

.review-item:last-child {
  border-bottom: none;
}

.review-item__label {
  font-size: 14px;
  color: var(--tg-hint);
  flex-shrink: 0;
}

.review-item__value {
  font-size: 14px;
  color: var(--tg-text);
  text-align: right;
}
</style>
