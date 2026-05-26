<template>
  <div class="step">
    <AppFormField label="Телефон">
      <div class="input input--readonly">
        <span v-if="phone">{{ phone }}</span>
        <span v-else class="placeholder">Не указан в профиле Telegram</span>
      </div>
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

const { telegram } = useNuxtApp()
const tg = telegram as any
const tgUser = tg?.initDataUnsafe?.user ?? tg?.user

const phone = tgUser?.phone_number ?? null
const telegramUsername = tgUser?.username ? `@${tgUser.username}` : null

watchEffect(() => {
  if (phone && !props.form.contactPhone) props.form.contactPhone = phone
  if (telegramUsername && !props.form.contactTelegram) props.form.contactTelegram = telegramUsername
})
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
</style>
