<template>
  <div class="page">
    <AppPageHeader title="Фильтр по гео" back />

    <div class="section">
      <p class="section__hint">
        Введите название города или района. Будут показаны только заявки с адресами, содержащими этот текст.
      </p>

      <div class="field">
        <input
          v-model="city"
          class="field__input"
          type="text"
          placeholder="Например: Москва"
          maxlength="100"
        />
        <button v-if="city" class="field__clear" @click="city = ''">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <div v-if="active" class="active-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5"/>
        </svg>
        Активен: {{ filters?.geoCity }}
      </div>
    </div>

    <div class="actions">
      <button class="btn btn--primary" :disabled="saving || city === (filters?.geoCity ?? '')" @click="handleSave">
        {{ saving ? 'Сохранение...' : 'Сохранить' }}
      </button>
      <button v-if="filters?.geoCity" class="btn btn--danger" :disabled="saving" @click="handleClear">
        Сбросить фильтр
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { filters, load, save, invalidate } = useUserFilters()
const { success: showSuccess, error: showError } = useToast()

const city = ref('')
const saving = ref(false)

const active = computed(() => !!filters.value?.geoCity)

onMounted(async () => {
  await load()
  city.value = filters.value?.geoCity ?? ''
})

async function handleSave() {
  saving.value = true
  try {
    await save({ geoCity: city.value.trim() || null })
    showSuccess('Фильтр сохранён')
  } catch {
    showError('Не удалось сохранить фильтр. Попробуйте ещё раз.')
  } finally {
    saving.value = false
  }
}

async function handleClear() {
  saving.value = true
  try {
    city.value = ''
    await save({ geoCity: null })
    showSuccess('Фильтр сброшен')
  } catch {
    showError('Не удалось сбросить фильтр. Попробуйте ещё раз.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 32px;
}

.section {
  padding: 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section__hint {
  font-size: 13px;
  color: var(--tg-hint);
  line-height: 1.5;
}

.field {
  position: relative;
}

.field__input {
  width: 100%;
  padding: 12px 40px 12px 14px;
  border-radius: 12px;
  border: 1.5px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s ease;
}

.field__input:focus {
  border-color: var(--tg-button);
}

.field__clear {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--tg-hint);
  display: flex;
  align-items: center;
}

.active-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--tg-button);
  font-weight: 500;
}

.actions {
  padding: 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  width: 100%;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.btn:disabled {
  opacity: 0.5;
}

.btn--primary {
  background: var(--tg-button);
  color: var(--tg-button-text);
}

.btn--danger {
  background: color-mix(in srgb, #ff3b30 12%, var(--tg-secondary-bg));
  color: #ff3b30;
}
</style>
