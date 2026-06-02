<template>
  <div class="card">
    <div class="card__header">
      <span class="card__type">{{ typeLabel }}</span>
      <span v-if="!hideStatus" class="card__status" :class="`card__status--${request.status.toLowerCase()}`">
        {{ statusLabel }}
      </span>
    </div>

    <div class="card__body">
      <div class="card__row">
        <svg class="card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5"/>
        </svg>
        <span class="card__address">{{ mainAddress }}</span>
      </div>

      <div v-if="subInfo" class="card__row card__row--secondary">
        <svg class="card__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="currentColor" d="M20 6h-2.18c.07-.44.18-.87.18-1.33C18 2.54 15.96.5 13.5.5c-1.28 0-2.43.52-3.28 1.35L9 3 7.78 1.85C6.93 1.02 5.78.5 4.5.5 2.04.5 0 2.54 0 5c0 .46.11.89.18 1.33H0v2h.36L2 22h20l1.64-16H24V6zM13.5 2.5c1.1 0 2 .9 2 2 0 .73-.4 1.37-1 1.73V8h-2V6.23c-.6-.36-1-1-1-1.73 0-1.1.9-2 2-2M9 6.23V8H7V6.23C6.4 5.87 6 5.23 6 4.5c0-1.1.9-2 2-2s2 .9 2 2c0 .73-.4 1.37-1 1.73"/>
        </svg>
        <span class="card__subinfo">{{ subInfo }}</span>
      </div>
    </div>

    <div class="card__footer">
      <div class="card__dates">
        <span class="card__date">{{ formattedDate }}</span>
        <span class="card__created">Создана {{ formattedCreatedAt }}</span>
      </div>
      <span class="card__payment">{{ paymentLabel }}</span>
    </div>

    <!-- Contacts section -->
    <div class="card__contacts-wrap">
      <!-- Unlocked: toggle show/hide -->
      <template v-if="contactsVisible">
        <button class="card__contacts-btn" @click="showContacts = !showContacts">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02z"/>
          </svg>
          {{ showContacts ? 'Скрыть контакты' : 'Показать контакты' }}
        </button>

        <Transition name="contacts">
          <div v-if="showContacts" class="card__contacts">
            <a v-if="request.contactPhone" :href="`tel:${request.contactPhone}`" class="contact-row">
              <span class="contact-row__label">Телефон</span>
              <span class="contact-row__value">{{ request.contactPhone }}</span>
            </a>
            <a v-if="request.contactTelegram" :href="`https://t.me/${request.contactTelegram.replace('@', '')}`" class="contact-row" target="_blank">
              <span class="contact-row__label">Telegram</span>
              <span class="contact-row__value">{{ request.contactTelegram }}</span>
            </a>
            <a v-if="request.contactWhatsapp" :href="`https://wa.me/${request.contactWhatsapp.replace(/\D/g, '')}`" class="contact-row" target="_blank">
              <span class="contact-row__label">WhatsApp</span>
              <span class="contact-row__value">{{ request.contactWhatsapp }}</span>
            </a>
          </div>
        </Transition>
      </template>

      <!-- Not unlocked: unlock button or subscription prompt -->
      <template v-else-if="!isOwner">
        <button
          v-if="canViewContacts"
          class="card__contacts-btn card__contacts-btn--unlock"
          :disabled="viewLoading"
          @click="$emit('view-contacts', request.id)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
          </svg>
          <span v-if="viewLoading">Открываем...</span>
          <span v-else-if="subscriptionActive">Показать контакты</span>
          <span v-else>Показать контакты (осталось {{ viewsRemaining }})</span>
        </button>

        <button v-else class="card__contacts-locked" @click="$emit('subscribe')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 1C8.676 1 6 3.676 6 7v1H4v15h16V8h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v1H8V7c0-2.276 1.724-4 4-4zm0 9a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>
          </svg>
          Нужна подписка
        </button>
      </template>
    </div>

    <!-- Owner actions -->
    <div v-if="isOwner && ownerActions.length" class="card__actions">
      <button
        v-for="action in ownerActions"
        :key="action.status"
        class="card__action-btn"
        :class="`card__action-btn--${action.variant}`"
        :disabled="actionLoading"
        @click="$emit('action', request.id, action.status)"
      >
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Request {
  id: number
  type: string
  paymentType: string
  status: string
  createdAt: string
  contactPhone?: string | null
  contactTelegram?: string | null
  contactWhatsapp?: string | null
  contactsUnlocked?: boolean
  rental: { address: string; startsAt: string; durationDays: number; equipmentType: { name: string } } | null
  transportation: { fromAddress: string; toAddress: string; startsAt: string; cargo: string; equipmentType: { name: string } } | null
  delivery: { toAddress: string; startsAt: string; cargo: string; volume: string } | null
}

const props = defineProps<{
  request: Request
  isOwner?: boolean
  hideStatus?: boolean
  actionLoading?: boolean
  viewLoading?: boolean
  canViewContacts?: boolean
  viewsRemaining?: number
  subscriptionActive?: boolean
}>()

defineEmits<{ action: [id: number, status: string]; 'view-contacts': [id: number]; subscribe: [] }>()

const showContacts = ref(false)

const contactsVisible = computed(
  () => props.isOwner || !!props.request.contactsUnlocked
)

watch(contactsVisible, (val) => { if (val) showContacts.value = true })

const ownerActions = computed(() => {
  const s = props.request.status
  if (s === 'PENDING') return [
    { label: 'Опубликовать', status: 'PUBLISHED', variant: 'primary' },
    { label: 'Отменить', status: 'CANCELLED', variant: 'danger' },
  ]
  if (s === 'PUBLISHED') return [
    { label: 'Выполнена', status: 'DONE', variant: 'success' },
    { label: 'Отменить', status: 'CANCELLED', variant: 'danger' },
  ]
  return []
})

const typeLabels: Record<string, string> = {
  RENTAL: 'Аренда',
  TRANSPORTATION: 'Перевозка',
  DELIVERY: 'Доставка',
}

const statusLabels: Record<string, string> = {
  PENDING: 'Черновик',
  PUBLISHED: 'Опубликована',
  IN_PROGRESS: 'В работе',
  DONE: 'Выполнена',
  CANCELLED: 'Отменена',
}

const paymentLabels: Record<string, string> = {
  CASH: 'Наличка',
  NON_CASH: 'Безналичка',
}

const typeLabel = computed(() => typeLabels[props.request.type] ?? props.request.type)
const statusLabel = computed(() => statusLabels[props.request.status] ?? props.request.status)
const paymentLabel = computed(() => paymentLabels[props.request.paymentType] ?? props.request.paymentType)

const mainAddress = computed(() => {
  const r = props.request
  if (r.rental) return r.rental.address
  if (r.transportation) return r.transportation.toAddress
  if (r.delivery) return r.delivery.toAddress
  return '—'
})

const subInfo = computed(() => {
  const r = props.request
  if (r.rental) return r.rental.equipmentType.name + ` · ${r.rental.durationDays} дн.`
  if (r.transportation) return r.transportation.equipmentType.name + ` · ${r.transportation.cargo}`
  if (r.delivery) return r.delivery.cargo + ` · ${r.delivery.volume}`
  return null
})

const formattedDate = computed(() => {
  const raw =
    props.request.rental?.startsAt ??
    props.request.transportation?.startsAt ??
    props.request.delivery?.startsAt ??
    props.request.createdAt

  return new Date(raw).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
})

const formattedCreatedAt = computed(() =>
  new Date(props.request.createdAt).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
)
</script>

<style scoped>
.card {
  background: var(--tg-secondary-bg);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card__type {
  font-size: 15px;
  font-weight: 600;
  color: var(--tg-text);
}

.card__status {
  font-size: 12px;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 20px;
}

.card__status--pending {
  background: color-mix(in srgb, var(--tg-hint) 15%, transparent);
  color: var(--tg-hint);
}

.card__status--published {
  background: color-mix(in srgb, #f59e0b 15%, transparent);
  color: #f59e0b;
}

.card__status--in_progress {
  background: color-mix(in srgb, var(--tg-button) 15%, transparent);
  color: var(--tg-button);
}

.card__status--done {
  background: color-mix(in srgb, #22c55e 15%, transparent);
  color: #22c55e;
}

.card__status--cancelled {
  background: color-mix(in srgb, #ff3b30 12%, transparent);
  color: #ff3b30;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card__row {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.card__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  color: var(--tg-hint);
}

.card__address {
  font-size: 14px;
  color: var(--tg-text);
  line-height: 1.3;
}

.card__subinfo {
  font-size: 13px;
  color: var(--tg-hint);
  line-height: 1.3;
}

.card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2px;
  border-top: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
}

.card__dates {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.card__date {
  font-size: 12px;
  color: var(--tg-hint);
}

.card__created {
  font-size: 11px;
  color: color-mix(in srgb, var(--tg-hint) 60%, transparent);
}

.card__payment {
  font-size: 12px;
  color: var(--tg-hint);
}

/* Contacts */
.card__contacts-wrap {
  border-top: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
  padding-top: 8px;
  min-height: 28px;
}

.card__contacts-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--tg-button);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.card__contacts-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.card__contacts-btn--unlock {
  color: var(--tg-button);
}

.card__contacts-locked {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--tg-hint);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.card__contacts {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 10px;
}

.contact-row {
  display: flex;
  justify-content: space-between;
  text-decoration: none;
}

.contact-row__label {
  font-size: 13px;
  color: var(--tg-hint);
}

.contact-row__value {
  font-size: 13px;
  color: var(--tg-button);
  font-weight: 500;
}

.contacts-enter-active,
.contacts-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.contacts-enter-from,
.contacts-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Owner actions */
.card__actions {
  display: flex;
  gap: 8px;
  border-top: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
  padding-top: 10px;
}

.card__action-btn {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s ease;
}

.card__action-btn:disabled {
  opacity: 0.5;
}

.card__action-btn--primary {
  background: var(--tg-button);
  color: var(--tg-button-text);
}

.card__action-btn--success {
  background: color-mix(in srgb, #22c55e 15%, var(--tg-secondary-bg));
  color: #22c55e;
}

.card__action-btn--danger {
  background: color-mix(in srgb, #ff3b30 12%, var(--tg-secondary-bg));
  color: #ff3b30;
}
</style>
