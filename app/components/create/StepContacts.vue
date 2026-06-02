<template>
  <div class="step">
    <AppFormField label="Телефон">
      <div v-if="userPhone" class="input input--readonly">
        {{ userPhone }}
      </div>
      <template v-else>
        <input
          :value="form.contactPhone"
          class="input"
          :class="{ 'input--readonly': phoneLocked }"
          type="tel"
          placeholder="Не указан"
          readonly
        />
        <button
          v-if="!phoneLocked"
          class="tg-request-btn"
          type="button"
          :disabled="requesting"
          @click="requestPhone"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"/>
          </svg>
          <span>{{ requesting ? 'Запрос...' : 'Поделиться через Telegram' }}</span>
        </button>
        <span v-if="phoneLocked" class="field-hint">Получен из Telegram</span>
      </template>
    </AppFormField>

    <AppFormField label="Telegram">
      <div class="input input--readonly">
        <span v-if="telegramUsername">{{ telegramUsername }}</span>
        <span v-else class="placeholder">Нет username в профиле</span>
      </div>
    </AppFormField>

    <AppFormField label="WhatsApp">
      <input
        v-model="form.contactWhatsapp"
        class="input"
        type="tel"
        placeholder="+7 900 000-00-00"
      />
    </AppFormField>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ form: Record<string, any> }>()

const { userPhone, username, requestContact } = useTelegram()
const telegramUsername = computed(() => username.value ? `@${username.value}` : null)
const requesting = ref(false)
const phoneLocked = ref(false)

watchEffect(() => {
  if (userPhone.value && !props.form.contactPhone) {
    props.form.contactPhone = userPhone.value
    phoneLocked.value = true
  }
  if (telegramUsername.value && !props.form.contactTelegram) {
    props.form.contactTelegram = telegramUsername.value
  }
})

function requestPhone() {
  requesting.value = true
  requestContact((phone) => {
    requesting.value = false
    if (phone) {
      props.form.contactPhone = phone
      phoneLocked.value = true
    }
  })
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tg-hint) 30%, transparent);
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
  font-size: 15px;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.input--readonly {
  background: color-mix(in srgb, var(--tg-hint) 8%, var(--tg-secondary-bg));
  color: var(--tg-hint);
  display: flex;
  align-items: center;
  min-height: 46px;
}

.placeholder {
  font-size: 14px;
  font-style: italic;
}

.tg-request-btn {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1.5px solid var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 10%, transparent);
  color: var(--tg-button);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 0.15s ease;
}

.tg-request-btn:disabled {
  opacity: 0.5;
  cursor: default;
}

.field-hint {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #22c55e;
}
</style>
