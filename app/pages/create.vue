<template>
  <div class="page">
    <AppPageHeader :title="stepTitle" :back="step > 0" @back="prevStep" />

    <!-- Progress bar -->
    <div class="progress">
      <div class="progress__track">
        <div class="progress__fill" :style="{ width: progressPct + '%' }" />
      </div>
      <span class="progress__label">Шаг {{ step + 1 }} из {{ totalSteps }}</span>
    </div>

    <!-- Steps -->
    <div class="step-wrap">
      <Transition :name="transitionName" mode="out-in">
        <div :key="step" class="step-content">
          <CreateStepType v-if="step === 0" v-model="form.type" />
          <CreateStepDetails v-else-if="step === 1" :type="form.type!" :form="detailsForm" />
          <CreateStepContacts v-else-if="step === 2" :form="contactsForm" />
          <CreateStepPayment v-else-if="step === 3" v-model="form.paymentType" />
          <CreateStepReview
            v-else-if="step === 4"
            :type="form.type!"
            :payment-type="form.paymentType"
            :form="detailsForm"
            :contacts-form="contactsForm"
            :equipment-types="equipmentTypes ?? null"
          />
        </div>
      </Transition>
    </div>

    <!-- Bottom action -->
    <div class="action">
      <button class="action__btn" :disabled="!canProceed || submitting" @click="nextStep">
        <span v-if="submitting" class="action__spinner"><AppSpinner :size="20" /></span>
        <span v-else>{{ isLast ? 'Создать' : 'Далее' }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const { data: equipmentTypes } = await useFetch<{ id: number; name: string; icon: string }[]>(
  '/api/equipment-types'
)

const totalSteps = 5
const step = ref(0)
const transitionName = ref('step-forward')
const submitting = ref(false)

const form = reactive<{
  type: string | null
  paymentType: string | null
}>({
  type: null,
  paymentType: null,
})

const detailsForm = reactive<Record<string, any>>({
  equipmentTypeId: null,
  address: '',
  fromAddress: '',
  toAddress: '',
  cargo: '',
  startsAt: '',
  durationDays: 1,
  ratePerHour: 0,
  volume: '',
})

const contactsForm = reactive<Record<string, any>>({
  contactPhone: '',
  contactTelegram: '',
  contactWhatsapp: '',
})

const stepTitles = ['Тип заявки', 'Детали', 'Контакты', 'Оплата', 'Проверка']
const stepTitle = computed(() => stepTitles[step.value] ?? '')
const progressPct = computed(() => ((step.value + 1) / totalSteps) * 100)
const isLast = computed(() => step.value === totalSteps - 1)

const canProceed = computed(() => {
  if (step.value === 0) return !!form.type
  if (step.value === 1) return isDetailsValid()
  if (step.value === 2) return true
  if (step.value === 3) return !!form.paymentType
  return true
})

function isDetailsValid() {
  if (!detailsForm.startsAt) return false
  if (form.type === 'RENTAL') {
    return !!detailsForm.equipmentTypeId && !!detailsForm.address && detailsForm.durationDays >= 1
  }
  if (form.type === 'TRANSPORTATION') {
    return (
      !!detailsForm.equipmentTypeId &&
      !!detailsForm.cargo &&
      !!detailsForm.fromAddress &&
      !!detailsForm.toAddress &&
      detailsForm.ratePerHour >= 0
    )
  }
  if (form.type === 'DELIVERY') {
    return !!detailsForm.cargo && !!detailsForm.toAddress && !!detailsForm.volume
  }
  return false
}

function prevStep() {
  if (step.value === 0) {
    router.back()
    return
  }
  transitionName.value = 'step-back'
  step.value--
}

async function nextStep() {
  if (!canProceed.value) return
  if (isLast.value) {
    await submit()
    return
  }
  transitionName.value = 'step-forward'
  step.value++
}

const { telegramId } = useTelegram()
const { error: showError } = useToast()

async function submit() {
  submitting.value = true
  try {
    const body: Record<string, any> = {
      telegramId: telegramId.value,
      type: form.type,
      paymentType: form.paymentType,
      contactPhone: contactsForm.contactPhone || undefined,
      contactTelegram: contactsForm.contactTelegram || undefined,
      contactWhatsapp: contactsForm.contactWhatsapp || undefined,
    }

    if (form.type === 'RENTAL') {
      body.rental = {
        equipmentTypeId: detailsForm.equipmentTypeId,
        address: detailsForm.address,
        startsAt: new Date(detailsForm.startsAt).toISOString(),
        durationDays: detailsForm.durationDays,
      }
    } else if (form.type === 'TRANSPORTATION') {
      body.transportation = {
        equipmentTypeId: detailsForm.equipmentTypeId,
        cargo: detailsForm.cargo,
        fromAddress: detailsForm.fromAddress,
        toAddress: detailsForm.toAddress,
        startsAt: new Date(detailsForm.startsAt).toISOString(),
        ratePerHour: detailsForm.ratePerHour,
      }
    } else if (form.type === 'DELIVERY') {
      body.delivery = {
        cargo: detailsForm.cargo,
        toAddress: detailsForm.toAddress,
        startsAt: new Date(detailsForm.startsAt).toISOString(),
        volume: detailsForm.volume,
      }
    }

    await $fetch('/api/requests', { method: 'POST', body })
    router.push('/my-requests')
  } catch {
    showError('Не удалось создать заявку. Попробуйте ещё раз.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.progress {
  padding: 12px 16px 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress__track {
  flex: 1;
  height: 4px;
  background: color-mix(in srgb, var(--tg-hint) 20%, transparent);
  border-radius: 2px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  background: var(--tg-button);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress__label {
  font-size: 12px;
  color: var(--tg-hint);
  white-space: nowrap;
}

.step-wrap {
  flex: 1;
  overflow: hidden;
  padding: 8px 16px 16px;
}

.step-content {
  height: 100%;
}

/* Forward transition */
.step-forward-enter-active,
.step-forward-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.step-forward-enter-from {
  opacity: 0;
  transform: translateX(40px);
}

.step-forward-leave-to {
  opacity: 0;
  transform: translateX(-40px);
}

/* Back transition */
.step-back-enter-active,
.step-back-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.step-back-enter-from {
  opacity: 0;
  transform: translateX(-40px);
}

.step-back-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.action {
  padding: 12px 16px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
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
  transition: opacity 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
}

.action__btn:disabled {
  opacity: 0.45;
  cursor: default;
}

.action__spinner {
  display: flex;
}
</style>
