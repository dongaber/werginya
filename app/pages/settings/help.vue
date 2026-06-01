<template>
  <div class="page">
    <AppPageHeader title="Помощь" back />

    <!-- FAQ -->
    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Частые вопросы</h2>
        <button v-if="isAdmin" class="add-btn" @click="openCreateFaq">+</button>
      </div>
      <div v-if="faq.length" class="faq">
        <div
          v-for="item in faq"
          :key="item.id"
          class="faq__item"
          :class="{ 'faq__item--open': openIndex === item.id }"
        >
          <div class="faq__question" @click="openIndex = openIndex === item.id ? null : item.id">
            <span>{{ item.question }}</span>
            <div class="faq__question-end">
              <div v-if="isAdmin" class="faq__admin-btns" @click.stop>
                <button class="icon-btn icon-btn--edit" @click="openEditFaq(item)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/>
                  </svg>
                </button>
                <button class="icon-btn icon-btn--delete" @click="removeFaq(item.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
                  </svg>
                </button>
              </div>
              <svg class="faq__chevron" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/>
              </svg>
            </div>
          </div>
          <Transition name="faq-answer">
            <div v-if="openIndex === item.id" class="faq__answer">{{ item.answer }}</div>
          </Transition>
        </div>
      </div>
      <div v-else class="empty">Вопросов пока нет</div>
    </section>

    <!-- Contacts -->
    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Связаться с нами</h2>
        <button v-if="isAdmin" class="add-btn" @click="openCreateContact">+</button>
      </div>
      <div v-if="contacts.length" class="contacts">
        <div v-for="contact in contacts" :key="contact.id" class="contact-row">
          <a :href="contact.url" target="_blank" class="contact">
            <span class="contact__icon" :class="`contact__icon--${contact.type}`">
              <svg v-if="contact.type === 'telegram'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/>
              </svg>
              <svg v-else-if="contact.type === 'phone'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.46.57 3.58a1 1 0 0 1-.25 1.01z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4-8 5-8-5V6l8 5 8-5z"/>
              </svg>
            </span>
            <div class="contact__info">
              <span class="contact__label">{{ contact.label }}</span>
              <span class="contact__value">{{ contact.value }}</span>
            </div>
            <svg v-if="!isAdmin" class="contact__arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </a>
          <div v-if="isAdmin" class="contact__admin-btns">
            <button class="icon-btn icon-btn--edit" @click="openEditContact(contact)">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"/>
              </svg>
            </button>
            <button class="icon-btn icon-btn--delete" @click="removeContact(contact.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM19 4h-3.5l-1-1h-5l-1 1H5v2h14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty">Контактов пока нет</div>
    </section>

    <!-- FAQ modal -->
    <AppBottomSheet v-model="faqModal">
      <h2 class="sheet-title">{{ editingFaq ? 'Редактировать вопрос' : 'Новый вопрос' }}</h2>
      <AppFormField label="Вопрос">
        <input v-model="faqForm.question" class="input" placeholder="Как создать заявку?" />
      </AppFormField>
      <AppFormField label="Ответ">
        <textarea v-model="faqForm.answer" class="input input--textarea" placeholder="Нажмите кнопку + на главной..." rows="4" />
      </AppFormField>
      <div class="sheet-actions">
        <button class="btn btn--cancel" @click="faqModal = false">Отмена</button>
        <button class="btn btn--save" :disabled="saving" @click="saveFaq">
          {{ saving ? '...' : 'Сохранить' }}
        </button>
      </div>
    </AppBottomSheet>

    <!-- Contact modal -->
    <AppBottomSheet v-model="contactModal">
      <h2 class="sheet-title">{{ editingContact ? 'Редактировать контакт' : 'Новый контакт' }}</h2>
      <AppFormField label="Тип">
        <div class="type-select">
          <button
            v-for="t in contactTypes"
            :key="t.value"
            class="type-btn"
            :class="{ 'type-btn--active': contactForm.type === t.value }"
            @click="contactForm.type = t.value"
          >{{ t.label }}</button>
        </div>
      </AppFormField>
      <AppFormField label="Название">
        <input v-model="contactForm.label" class="input" placeholder="Telegram" />
      </AppFormField>
      <AppFormField label="Отображаемое значение">
        <input v-model="contactForm.value" class="input" placeholder="@support_bot" />
      </AppFormField>
      <AppFormField label="Ссылка (URL)">
        <input v-model="contactForm.url" class="input" placeholder="https://t.me/support_bot" />
      </AppFormField>
      <div class="sheet-actions">
        <button class="btn btn--cancel" @click="contactModal = false">Отмена</button>
        <button class="btn btn--save" :disabled="saving" @click="saveContact">
          {{ saving ? '...' : 'Сохранить' }}
        </button>
      </div>
    </AppBottomSheet>

    <!-- Confirm delete -->
    <AppConfirmModal
      :model-value="confirmTarget !== null"
      title="Удалить?"
      message="Это действие нельзя отменить."
      confirm-label="Удалить"
      :loading="saving"
      @confirm="confirmDelete"
      @update:model-value="confirmTarget = null"
    />
  </div>
</template>

<script setup lang="ts">
const { $apiFetch } = useNuxtApp()
const { telegramId } = useTelegram()
const { error: showError, success: showSuccess } = useToast()

const { data: meData } = await useAsyncData(
  'help-me',
  () => useNuxtApp().$apiFetch<{ isAdmin: boolean; subscriptionActive: boolean }>('/api/me')
)
const isAdmin = computed(() => meData.value?.isAdmin ?? false)

const { data, refresh } = await useAsyncData(
  'help-data',
  () => useNuxtApp().$apiFetch<{
    faq: { id: number; question: string; answer: string; order: number }[]
    contacts: { id: number; label: string; type: string; value: string; url: string; order: number }[]
  }>('/api/help')
)

const faq = computed(() => data.value?.faq ?? [])
const contacts = computed(() => data.value?.contacts ?? [])

const openIndex = ref<number | null>(null)
const saving = ref(false)

// FAQ
const faqModal = ref(false)
const editingFaq = ref<number | null>(null)
const faqForm = reactive({ question: '', answer: '' })

function openCreateFaq() {
  editingFaq.value = null
  faqForm.question = ''
  faqForm.answer = ''
  faqModal.value = true
}

function openEditFaq(item: { id: number; question: string; answer: string }) {
  editingFaq.value = item.id
  faqForm.question = item.question
  faqForm.answer = item.answer
  faqModal.value = true
}

async function saveFaq() {
  if (!faqForm.question.trim() || !faqForm.answer.trim()) return
  saving.value = true
  try {
    if (editingFaq.value) {
      await ($apiFetch as typeof $fetch)(`/api/help/faq/${editingFaq.value}`, {
        method: 'PUT',
        body: { question: faqForm.question, answer: faqForm.answer },
      })
    } else {
      await ($apiFetch as typeof $fetch)('/api/help/faq', {
        method: 'POST',
        body: { question: faqForm.question, answer: faqForm.answer, order: faq.value.length },
      })
    }
    await refresh()
    faqModal.value = false
    showSuccess('Сохранено')
  } catch (err) {
    showError(`Не удалось сохранить: ${errMsg(err)}`)
  } finally {
    saving.value = false
  }
}

// Contacts
const contactModal = ref(false)
const editingContact = ref<number | null>(null)
const contactForm = reactive({ label: '', type: 'telegram', value: '', url: '' })
const contactTypes = [
  { value: 'telegram', label: 'Telegram' },
  { value: 'phone', label: 'Телефон' },
  { value: 'email', label: 'Email' },
]

function openCreateContact() {
  editingContact.value = null
  contactForm.label = ''
  contactForm.type = 'telegram'
  contactForm.value = ''
  contactForm.url = ''
  contactModal.value = true
}

function openEditContact(item: { id: number; label: string; type: string; value: string; url: string }) {
  editingContact.value = item.id
  contactForm.label = item.label
  contactForm.type = item.type
  contactForm.value = item.value
  contactForm.url = item.url
  contactModal.value = true
}

async function saveContact() {
  if (!contactForm.label.trim() || !contactForm.value.trim() || !contactForm.url.trim()) return
  saving.value = true
  try {
    if (editingContact.value) {
      await ($apiFetch as typeof $fetch)(`/api/help/contacts/${editingContact.value}`, {
        method: 'PUT',
        body: { ...contactForm },
      })
    } else {
      await ($apiFetch as typeof $fetch)('/api/help/contacts', {
        method: 'POST',
        body: { ...contactForm, order: contacts.value.length },
      })
    }
    await refresh()
    contactModal.value = false
    showSuccess('Сохранено')
  } catch (err) {
    showError(`Не удалось сохранить: ${errMsg(err)}`)
  } finally {
    saving.value = false
  }
}

// Delete
type ConfirmTarget = { kind: 'faq'; id: number } | { kind: 'contact'; id: number }
const confirmTarget = ref<ConfirmTarget | null>(null)

function removeFaq(id: number) { confirmTarget.value = { kind: 'faq', id } }
function removeContact(id: number) { confirmTarget.value = { kind: 'contact', id } }

async function confirmDelete() {
  if (!confirmTarget.value) return
  saving.value = true
  try {
    const { kind, id } = confirmTarget.value
    await ($apiFetch as typeof $fetch)(
      kind === 'faq' ? `/api/help/faq/${id}` : `/api/help/contacts/${id}`,
      { method: 'DELETE' }
    )
    await refresh()
    confirmTarget.value = null
    showSuccess('Удалено')
  } catch (err) {
    showError(`Не удалось удалить: ${errMsg(err)}`)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page {
  padding-bottom: 24px;
}

.section {
  padding: 0 16px;
  margin-bottom: 24px;
}

.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  padding: 0 4px;
}

.section__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--tg-hint);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.add-btn {
  background: none;
  border: none;
  font-size: 26px;
  color: var(--tg-button);
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
}

.empty {
  font-size: 14px;
  color: var(--tg-hint);
  padding: 16px 4px;
}

/* FAQ */
.faq {
  background: var(--tg-secondary-bg);
  border-radius: 16px;
  overflow: hidden;
}

.faq__item {
  border-bottom: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
}

.faq__item:last-child {
  border-bottom: none;
}

.faq__question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  color: var(--tg-text);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.faq__question-end {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.faq__admin-btns {
  display: flex;
  gap: 4px;
}

.faq__chevron {
  color: var(--tg-hint);
  transition: transform 0.2s ease;
}

.faq__item--open .faq__chevron {
  transform: rotate(180deg);
}

.faq__answer {
  padding: 0 16px 14px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--tg-hint);
}

.faq-answer-enter-active,
.faq-answer-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.faq-answer-enter-from,
.faq-answer-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Contacts */
.contacts {
  background: var(--tg-secondary-bg);
  border-radius: 16px;
  overflow: hidden;
}

.contact-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
}

.contact-row:last-child {
  border-bottom: none;
}

.contact {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  min-width: 0;
}

.contact__icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact__icon--telegram {
  background: color-mix(in srgb, #2AABEE 15%, transparent);
  color: #2AABEE;
}

.contact__icon--phone {
  background: color-mix(in srgb, #22c55e 15%, transparent);
  color: #22c55e;
}

.contact__icon--email {
  background: color-mix(in srgb, var(--tg-button) 15%, transparent);
  color: var(--tg-button);
}

.contact__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.contact__label {
  font-size: 15px;
  font-weight: 500;
  color: var(--tg-text);
}

.contact__value {
  font-size: 13px;
  color: var(--tg-hint);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact__arrow {
  color: var(--tg-hint);
  flex-shrink: 0;
}

.contact__admin-btns {
  display: flex;
  gap: 6px;
  padding-right: 14px;
  flex-shrink: 0;
}

/* Icon buttons */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.icon-btn--edit {
  background: color-mix(in srgb, var(--tg-button) 15%, transparent);
  color: var(--tg-button);
}

.icon-btn--delete {
  background: color-mix(in srgb, #ff3b30 15%, transparent);
  color: #ff3b30;
}

/* Sheet */
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
  font-family: inherit;
  box-sizing: border-box;
}

.input--textarea {
  resize: none;
  line-height: 1.5;
}

.type-select {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  padding: 9px 4px;
  border-radius: 10px;
  border: 1.5px solid color-mix(in srgb, var(--tg-hint) 25%, transparent);
  background: transparent;
  color: var(--tg-hint);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.type-btn--active {
  border-color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-button) 10%, transparent);
  color: var(--tg-button);
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

.btn:disabled { opacity: 0.6; }

.btn--cancel {
  background: var(--tg-secondary-bg);
  color: var(--tg-text);
}

.btn--save {
  background: var(--tg-button);
  color: var(--tg-button-text);
}
</style>
