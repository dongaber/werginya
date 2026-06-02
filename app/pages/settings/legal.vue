<template>
  <div class="page">
    <AppPageHeader title="Правовые документы" />

    <div class="form">
      <AppFormField label="Ссылка на оферту">
        <input
          v-model="termsUrl"
          class="input"
          type="url"
          placeholder="https://..."
          :disabled="saving"
        />
      </AppFormField>

      <AppFormField label="Ссылка на политику конфиденциальности">
        <input
          v-model="privacyUrl"
          class="input"
          type="url"
          placeholder="https://..."
          :disabled="saving"
        />
      </AppFormField>
    </div>

    <div class="action">
      <button class="action__btn" :disabled="saving || !changed" @click="save">
        <span v-if="saving"><AppSpinner :size="20" /></span>
        <span v-else>Сохранить</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { showBackButton, hideBackButton } = useTelegram()
const handleBack = () => router.back()
onMounted(() => showBackButton(handleBack))
onUnmounted(() => hideBackButton(handleBack))

const { data, refresh } = await useAsyncData(
  'legal',
  () => useNuxtApp().$apiFetch<{ termsUrl: string; privacyUrl: string }>('/api/legal')
)

const termsUrl = ref(data.value?.termsUrl ?? '')
const privacyUrl = ref(data.value?.privacyUrl ?? '')
const saving = ref(false)

const changed = computed(
  () => termsUrl.value !== (data.value?.termsUrl ?? '') || privacyUrl.value !== (data.value?.privacyUrl ?? '')
)

const { success: showSuccess, error: showError } = useToast()

async function save() {
  saving.value = true
  try {
    await useNuxtApp().$apiFetch('/api/legal', {
      method: 'PATCH',
      body: { termsUrl: termsUrl.value, privacyUrl: privacyUrl.value },
    })
    await refresh()
    showSuccess('Сохранено')
  } catch (err) {
    showError(`Не удалось сохранить: ${errMsg(err)}`)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 24px;
}

.form {
  padding: 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

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
}

.input:disabled {
  opacity: 0.6;
}

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
  opacity: 0.45;
  cursor: default;
}
</style>
