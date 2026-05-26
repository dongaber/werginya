<template>
  <div class="page">
    <AppPageHeader title="Виды техники" back>
      <template #actions>
        <button class="add-btn" @click="openCreate">+</button>
      </template>
    </AppPageHeader>

    <div v-if="pending" class="loader">
      <AppSpinner :size="32" />
    </div>

    <div v-else class="list">
      <div v-for="item in data" :key="item.id" class="list__item">
        <img :src="item.icon" :alt="item.name" class="list__icon" />
        <span class="list__name">{{ item.name }}</span>
        <div class="list__actions">
          <button class="list__btn list__btn--edit" @click="openEdit(item)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/>
            </svg>
          </button>
          <button class="list__btn list__btn--delete" @click="remove(item.id)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <AppBottomSheet v-model="modal">
      <h2 class="sheet-title">{{ editing ? 'Редактировать' : 'Добавить' }}</h2>
      <AppFormField label="Название">
        <input v-model="form.name" class="input" placeholder="Экскаватор" />
      </AppFormField>
      <AppFormField label="Иконка (URL)">
        <input v-model="form.icon" class="input" placeholder="https://..." />
        <img v-if="form.icon" :src="form.icon" class="icon-preview" />
      </AppFormField>
      <div class="sheet-actions">
        <button class="btn btn--cancel" @click="modal = false">Отмена</button>
        <button class="btn btn--save" :disabled="saving" @click="save">
          {{ saving ? '...' : 'Сохранить' }}
        </button>
      </div>
    </AppBottomSheet>

    <AppConfirmModal
      :model-value="confirmId !== null"
      title="Удалить вид техники?"
      message="Это действие нельзя отменить."
      confirm-label="Удалить"
      :loading="saving"
      @confirm="confirmDelete"
      @update:model-value="confirmId = null"
    />
  </div>
</template>

<script setup lang="ts">
const { $apiFetch } = useNuxtApp()
const { error: showError, success: showSuccess } = useToast()

const { data, pending, refresh } = await useFetch<{ id: number; name: string; icon: string }[]>(
  '/api/equipment-types'
)

const modal = ref(false)
const editing = ref<number | null>(null)
const saving = ref(false)
const form = reactive({ name: '', icon: '' })
const confirmId = ref<number | null>(null)

function openCreate() {
  editing.value = null
  form.name = ''
  form.icon = ''
  modal.value = true
}

function openEdit(item: { id: number; name: string; icon: string }) {
  editing.value = item.id
  form.name = item.name
  form.icon = item.icon
  modal.value = true
}

async function save() {
  if (!form.name.trim() || !form.icon.trim()) return
  saving.value = true
  try {
    if (editing.value) {
      await ($apiFetch as typeof $fetch)(`/api/equipment-types/${editing.value}`, {
        method: 'PUT',
        body: { name: form.name, icon: form.icon },
      })
    } else {
      await ($apiFetch as typeof $fetch)('/api/equipment-types', {
        method: 'POST',
        body: { name: form.name, icon: form.icon },
      })
    }
    await refresh()
    modal.value = false
    showSuccess('Сохранено')
  } catch {
    showError('Не удалось сохранить. Попробуйте ещё раз.')
  } finally {
    saving.value = false
  }
}

function remove(id: number) {
  confirmId.value = id
}

async function confirmDelete() {
  if (confirmId.value === null) return
  saving.value = true
  try {
    await ($apiFetch as typeof $fetch)(`/api/equipment-types/${confirmId.value}`, { method: 'DELETE' })
    await refresh()
    confirmId.value = null
    showSuccess('Удалено')
  } catch {
    showError('Не удалось удалить. Попробуйте ещё раз.')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 16px;
}

.add-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--tg-button);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.loader {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.list {
  padding: 0 16px;
}

.list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid color-mix(in srgb, var(--tg-hint) 15%, transparent);
}

.list__item:last-child {
  border-bottom: none;
}

.list__icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.list__name {
  flex: 1;
  font-size: 15px;
}

.list__actions {
  display: flex;
  gap: 8px;
}

.list__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.list__btn--edit {
  background: color-mix(in srgb, var(--tg-button) 15%, transparent);
  color: var(--tg-button);
}

.list__btn--delete {
  background: color-mix(in srgb, #ff3b30 15%, transparent);
  color: #ff3b30;
}

.sheet-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
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
}

.icon-preview {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-top: 8px;
}

.sheet-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.6;
}

.btn--cancel {
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
}

.btn--save {
  background: var(--tg-button);
  color: var(--tg-button-text);
}
</style>
