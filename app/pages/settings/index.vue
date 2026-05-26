<template>
  <div class="settings">
    <h1 class="settings__title">Настройки</h1>
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
const items = [
  {
    to: '/settings/subscription',
    label: 'Подписка',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11zm14 3a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-1h14z"/>
    </svg>`,
  },
  {
    to: '/settings/equipment-types',
    label: 'Виды техники',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m6 13H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/>
    </svg>`,
  },
]
</script>

<style scoped>
.settings {
  padding: 16px;
}

.settings__title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--tg-text);
}
</style>
