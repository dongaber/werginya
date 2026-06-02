<template>
  <div class="page">
    <AppPageHeader title="Фильтр по технике" />

    <div v-if="pending" class="loader">
      <AppSpinner :size="32" />
    </div>

    <template v-else>
      <p class="hint">Выберите виды техники. Будут показаны только заявки с выбранной техникой.</p>

      <div class="list">
        <button
          v-for="eq in equipmentTypes"
          :key="eq.id"
          class="item"
          :class="{ 'item--selected': selected.includes(eq.id) }"
          @click="toggle(eq.id)"
        >
          <img :src="eq.icon" :alt="eq.name" class="item__icon" />
          <span class="item__name">{{ eq.name }}</span>
          <svg v-if="selected.includes(eq.id)" class="item__check" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </button>
      </div>

      <div v-if="selected.length" class="selected-count">
        Выбрано: {{ selected.length }}
      </div>

      <div class="actions">
        <button
          class="btn btn--primary"
          :disabled="saving || !hasChanges"
          @click="handleSave"
        >
          {{ saving ? 'Сохранение...' : 'Сохранить' }}
        </button>
        <button v-if="filters?.equipmentTypeIds?.length" class="btn btn--danger" :disabled="saving" @click="handleClear">
          Сбросить фильтр
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { showBackButton, hideBackButton } = useTelegram()
const handleBack = () => router.back()
onMounted(() => showBackButton(handleBack))
onUnmounted(() => hideBackButton(handleBack))

interface EquipmentType {
  id: number
  name: string
  icon: string
}

const { filters, load, save } = useUserFilters()
const { success: showSuccess, error: showError } = useToast()

const { data: equipmentTypes, pending } = useAsyncData(
  'filter-equipment-types',
  () => useNuxtApp().$apiFetch<EquipmentType[]>('/api/equipment-types')
)

const selected = ref<number[]>([])
const saving = ref(false)

const hasChanges = computed(() => {
  const saved = filters.value?.equipmentTypeIds ?? []
  return JSON.stringify([...selected.value].sort()) !== JSON.stringify([...saved].sort())
})

onMounted(async () => {
  await load()
  selected.value = [...(filters.value?.equipmentTypeIds ?? [])]
})

function toggle(id: number) {
  const idx = selected.value.indexOf(id)
  if (idx === -1) selected.value.push(id)
  else selected.value.splice(idx, 1)
}

async function handleSave() {
  saving.value = true
  try {
    await save({ equipmentTypeIds: selected.value })
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
    selected.value = []
    await save({ equipmentTypeIds: [] })
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

.loader {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

.hint {
  padding: 16px 16px 8px;
  font-size: 13px;
  color: var(--tg-hint);
  line-height: 1.5;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 0 16px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1.5px solid color-mix(in srgb, var(--tg-hint) 15%, transparent);
  background: var(--tg-secondary-bg);
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.item--selected {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 8%, var(--tg-secondary-bg));
}

.item__icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}

.item__name {
  flex: 1;
  font-size: 15px;
  color: var(--tg-text);
}

.item__check {
  color: var(--tg-button);
  flex-shrink: 0;
}

.selected-count {
  padding: 10px 16px 0;
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
