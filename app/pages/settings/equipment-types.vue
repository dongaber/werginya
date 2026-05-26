<template>
  <div class="page">
    <div class="page__header">
      <button class="page__back" @click="router.back()">‹</button>
      <h1 class="page__title">Виды техники</h1>
      <button class="page__add" @click="openCreate">+</button>
    </div>

    <div v-if="pending" class="page__loader">
      <div class="spinner" />
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

    <!-- Form modal -->
    <Transition name="modal">
      <div v-if="modal" class="modal-backdrop" @click.self="closeModal">
        <div class="modal">
          <h2 class="modal__title">{{ editing ? 'Редактировать' : 'Добавить' }}</h2>
          <div class="modal__field">
            <label class="modal__label">Название</label>
            <input v-model="form.name" class="modal__input" placeholder="Экскаватор" />
          </div>
          <div class="modal__field">
            <label class="modal__label">Иконка (URL)</label>
            <input v-model="form.icon" class="modal__input" placeholder="https://..." />
            <img v-if="form.icon" :src="form.icon" class="modal__preview" />
          </div>
          <div class="modal__actions">
            <button class="modal__btn modal__btn--cancel" @click="closeModal">Отмена</button>
            <button class="modal__btn modal__btn--save" :disabled="saving" @click="save">
              {{ saving ? '...' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Confirm delete modal -->
    <Transition name="modal">
      <div v-if="confirmId !== null" class="modal-backdrop" @click.self="confirmId = null">
        <div class="modal">
          <h2 class="modal__title">Удалить вид техники?</h2>
          <p class="modal__text">Это действие нельзя отменить.</p>
          <div class="modal__actions">
            <button class="modal__btn modal__btn--cancel" @click="confirmId = null">Отмена</button>
            <button class="modal__btn modal__btn--delete" :disabled="saving" @click="confirmDelete">
              {{ saving ? '...' : 'Удалить' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

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

function closeModal() {
  modal.value = false
}

async function save() {
  if (!form.name.trim() || !form.icon.trim()) return
  saving.value = true
  try {
    if (editing.value) {
      await $fetch(`/api/equipment-types/${editing.value}`, {
        method: 'PUT',
        body: { name: form.name, icon: form.icon },
      })
    } else {
      await $fetch('/api/equipment-types', {
        method: 'POST',
        body: { name: form.name, icon: form.icon },
      })
    }
    await refresh()
    closeModal()
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
    await $fetch(`/api/equipment-types/${confirmId.value}`, { method: 'DELETE' })
    await refresh()
    confirmId.value = null
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 16px;
}

.page__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  background: var(--tg-bg);
  z-index: 10;
}

.page__back {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--tg-button);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.page__title {
  flex: 1;
  font-size: 20px;
  font-weight: 600;
}

.page__add {
  background: none;
  border: none;
  font-size: 28px;
  color: var(--tg-button);
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
}

.page__loader {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid color-mix(in srgb, var(--tg-button) 20%, transparent);
  border-top-color: var(--tg-button);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: color-mix(in srgb, #000 40%, transparent);
  display: flex;
  align-items: flex-end;
  z-index: 200;
  padding: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
}

.modal {
  background: var(--tg-bg);
  border-radius: 20px;
  padding: 24px;
  width: 100%;
}

.modal__title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
}

.modal__field {
  margin-bottom: 16px;
}

.modal__label {
  display: block;
  font-size: 13px;
  color: var(--tg-hint);
  margin-bottom: 6px;
}

.modal__input {
  width: 100%;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid color-mix(in srgb, var(--tg-hint) 30%, transparent);
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
  font-size: 15px;
  outline: none;
}

.modal__preview {
  width: 40px;
  height: 40px;
  object-fit: contain;
  margin-top: 8px;
}

.modal__actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.modal__btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  border: none;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
}

.modal__btn--cancel {
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
}

.modal__btn--save {
  background: var(--tg-button);
  color: var(--tg-button-text);
}

.modal__btn--save:disabled,
.modal__btn--delete:disabled {
  opacity: 0.6;
}

.modal__btn--delete {
  background: #ff3b30;
  color: #fff;
}

.modal__text {
  font-size: 14px;
  color: var(--tg-hint);
  margin-bottom: 20px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(100%);
}
</style>
