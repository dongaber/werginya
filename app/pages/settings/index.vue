<template>
  <div class="settings">
    <h1 class="settings__title">Настройки</h1>

    <!-- Profile card -->
    <div class="profile">
      <div class="profile__avatar">
        {{ avatarLetter }}
      </div>
      <div class="profile__info">
        <span class="profile__name">{{ fullName }}</span>
        <span v-if="username" class="profile__username">@{{ username }}</span>
      </div>
      <NuxtLink to="/settings/subscription" class="profile__sub-badge" :class="subActive ? 'profile__sub-badge--active' : 'profile__sub-badge--inactive'">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
          <path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1h14z"/>
        </svg>
        {{ subActive ? 'Pro' : 'Нет подписки' }}
      </NuxtLink>
    </div>

    <AppSettingsGroup>
      <AppSettingsItem
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :label="item.label"
        :icon="item.icon"
      />
    </AppSettingsGroup>
  </div>
</template>

<script setup lang="ts">
const { telegram } = useNuxtApp()
const tg = telegram as any
const tgUser = tg?.initDataUnsafe?.user ?? tg?.user

const firstName = tgUser?.first_name ?? 'Пользователь'
const lastName = tgUser?.last_name ?? ''
const username = tgUser?.username ?? ''
const fullName = [firstName, lastName].filter(Boolean).join(' ')
const avatarLetter = firstName[0]?.toUpperCase() ?? '?'

const telegramId = tgUser?.id ?? 1

const { data: meData } = await useFetch<{ isAdmin: boolean; subscriptionActive: boolean }>(
  '/api/me',
  { query: { telegramId } }
)

const subActive = computed(() => meData.value?.subscriptionActive ?? false)
const isAdmin = computed(() => meData.value?.isAdmin ?? false)

const allItems = [
  {
    to: '/settings/subscription',
    label: 'Подписка',
    adminOnly: false,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1h14z"/>
    </svg>`,
  },
  {
    to: '/settings/equipment-types',
    label: 'Виды техники',
    adminOnly: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m6 13H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/>
    </svg>`,
  },
]

const items = computed(() => allItems.filter(item => !item.adminOnly || isAdmin.value))
</script>

<style scoped>
.settings {
  padding: 16px;
}

.settings__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 20px;
  color: var(--tg-text);
}

/* Profile */
.profile {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--tg-secondary-bg);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
}

.profile__avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--tg-button);
  color: var(--tg-button-text);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 700;
  flex-shrink: 0;
}

.profile__info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.profile__name {
  font-size: 16px;
  font-weight: 600;
  color: var(--tg-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile__username {
  font-size: 13px;
  color: var(--tg-hint);
}

.profile__sub-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  flex-shrink: 0;
}

.profile__sub-badge--active {
  background: color-mix(in srgb, #f59e0b 15%, transparent);
  color: #f59e0b;
}

.profile__sub-badge--inactive {
  background: color-mix(in srgb, var(--tg-hint) 15%, transparent);
  color: var(--tg-hint);
}
</style>
