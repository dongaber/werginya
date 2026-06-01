<template>
  <div class="page">
    <AppPageHeader title="Фильтр по гео" back />

    <div class="section">
      <p class="section__hint">
        Выберите точку на карте и задайте радиус. Будут показаны заявки с адресами в этом радиусе.
      </p>

      <AppAddressPicker
        v-model="addressText"
        placeholder="Поиск адреса для навигации..."
        :init-lat="selectedLat"
        :init-lng="selectedLng"
        @select="onMapSelect"
      />

      <div v-if="selectedLat && selectedLng" class="coords-badge">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5"/>
        </svg>
        {{ selectedLat.toFixed(4) }}, {{ selectedLng.toFixed(4) }}
      </div>
    </div>

    <div class="radius-section">
      <p class="radius-label">Радиус поиска</p>
      <div class="radius-grid">
        <button
          v-for="r in RADIUS_OPTIONS"
          :key="r"
          class="radius-btn"
          :class="{ 'radius-btn--active': selectedRadius === r }"
          @click="selectedRadius = r"
        >
          {{ r }} км
        </button>
      </div>
    </div>

    <div v-if="isActive" class="active-badge">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
        <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5"/>
      </svg>
      Активен: {{ filters?.geoRadiusKm }} км
    </div>

    <div class="actions">
      <button
        class="btn btn--primary"
        :disabled="saving || !canSave"
        @click="handleSave"
      >
        {{ saving ? 'Сохранение...' : 'Сохранить фильтр' }}
      </button>
      <button v-if="isActive" class="btn btn--danger" :disabled="saving" @click="handleClear">
        Сбросить фильтр
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const RADIUS_OPTIONS = [10, 25, 50, 100, 200]

const { filters, load, save } = useUserFilters()
const { success: showSuccess, error: showError } = useToast()

const addressText = ref('')
const selectedLat = ref<number | null>(null)
const selectedLng = ref<number | null>(null)
const selectedRadius = ref<number>(50)
const saving = ref(false)

const isActive = computed(() => filters.value?.geoLat != null && filters.value?.geoRadiusKm != null)

const canSave = computed(() =>
  selectedLat.value != null && selectedLng.value != null && selectedRadius.value > 0
)

onMounted(async () => {
  await load()
  if (filters.value?.geoLat != null) selectedLat.value = filters.value.geoLat
  if (filters.value?.geoLng != null) selectedLng.value = filters.value.geoLng
  if (filters.value?.geoRadiusKm != null) selectedRadius.value = filters.value.geoRadiusKm
})

function onMapSelect(r: { value: string; lat: number | null; lng: number | null }) {
  if (r.lat != null) selectedLat.value = r.lat
  if (r.lng != null) selectedLng.value = r.lng
}

async function handleSave() {
  if (!canSave.value) return
  saving.value = true
  try {
    await save({
      geoLat: selectedLat.value,
      geoLng: selectedLng.value,
      geoRadiusKm: selectedRadius.value,
    })
    showSuccess('Фильтр сохранён')
  } catch (err) {
    showError(`Не удалось сохранить фильтр: ${errMsg(err)}`)
  } finally {
    saving.value = false
  }
}

async function handleClear() {
  saving.value = true
  try {
    selectedLat.value = null
    selectedLng.value = null
    await save({ geoLat: null, geoLng: null, geoRadiusKm: null })
    showSuccess('Фильтр сброшен')
  } catch (err) {
    showError(`Не удалось сбросить фильтр: ${errMsg(err)}`)
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
  gap: 10px;
}

.section__hint {
  font-size: 13px;
  color: var(--tg-hint);
  line-height: 1.5;
}

.coords-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--tg-hint);
  font-family: monospace;
}

.radius-section {
  padding: 16px 16px 0;
}

.radius-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-hint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.radius-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.radius-btn {
  padding: 8px 16px;
  border-radius: 20px;
  border: 2px solid color-mix(in srgb, var(--tg-hint) 20%, transparent);
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  font-family: inherit;
}

.radius-btn--active {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 10%, var(--tg-secondary-bg));
  color: var(--tg-button);
}

.active-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--tg-button);
  font-weight: 500;
  padding: 0 16px;
  margin-top: 12px;
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
  font-family: inherit;
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
