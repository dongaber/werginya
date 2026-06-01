<template>
  <div class="page">
    <div class="hero">
      <div class="hero__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
          <path fill="currentColor" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7m0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5" />
        </svg>
      </div>
      <h1 class="hero__title">Добро пожаловать</h1>
      <p class="hero__sub">Перед началом работы подтвердите согласие</p>
    </div>

    <div class="consents">
      <label class="consent">
        <input v-model="agreedToTerms" type="checkbox" class="consent__input" />
        <span class="consent__box" :class="{ 'consent__box--checked': agreedToTerms }">
          <svg v-if="agreedToTerms" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </span>
        <span class="consent__text">Согласен с <a class="consent__link" href="#" @click.prevent>офертой</a></span>
      </label>

      <label class="consent">
        <input v-model="agreedToPrivacy" type="checkbox" class="consent__input" />
        <span class="consent__box" :class="{ 'consent__box--checked': agreedToPrivacy }">
          <svg v-if="agreedToPrivacy" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
            <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </span>
        <span class="consent__text">Согласен на <a class="consent__link" href="#" @click.prevent>обработку персональных данных</a></span>
      </label>
    </div>

    <div class="action">
      <button class="action__btn" :disabled="!canRegister || loading" @click="register">
        <span v-if="loading"><AppSpinner :size="20" /></span>
        <span v-else>Продолжить</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const { firstName, lastName, username } = useTelegram()
const router = useRouter()

const agreedToTerms = ref(false)
const agreedToPrivacy = ref(false)
const loading = ref(false)

const canRegister = computed(() => agreedToTerms.value && agreedToPrivacy.value)

onMounted(async () => {
  try {
    const data = await $fetch<{ exists: boolean }>('/api/me')
    if (data.exists) {
      const userExists = useState('userExists')
      userExists.value = true
      await router.replace('/')
    }
  } catch {}
})

async function register() {
  if (!canRegister.value) return
  loading.value = true
  try {
    await $fetch('/api/users', {
      method: 'POST',
      body: {
        firstName: firstName.value,
        lastName: lastName.value || undefined,
        username: username.value || undefined,
        agreedToTerms: true,
        agreedToPrivacy: true,
      },
    })
    const userExists = useState('userExists')
    userExists.value = true
    await router.replace('/')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 32px 16px 24px;
  padding-bottom: max(24px, env(safe-area-inset-bottom), var(--tg-safe-area-inset-bottom, 0px));
  padding-top: calc(32px + var(--tg-content-safe-area-inset-top, 0px));
}

.hero {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  padding-bottom: 32px;
}

.hero__icon {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: color-mix(in srgb, var(--tg-button) 12%, transparent);
  color: var(--tg-button);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.hero__title {
  font-size: 26px;
  font-weight: 700;
  color: var(--tg-text);
}

.hero__sub {
  font-size: 15px;
  color: var(--tg-hint);
  max-width: 260px;
  line-height: 1.4;
}

.consents {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.consent {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--tg-secondary-bg);
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.consent__input {
  display: none;
}

.consent__box {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 2px solid color-mix(in srgb, var(--tg-hint) 40%, transparent);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.consent__box--checked {
  background: var(--tg-button);
  border-color: var(--tg-button);
  color: var(--tg-button-text);
}

.consent__text {
  font-size: 14px;
  color: var(--tg-text);
  line-height: 1.4;
}

.consent__link {
  color: var(--tg-link);
  text-decoration: none;
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
