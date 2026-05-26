<template>
  <div class="nav-wrapper">
    <nav class="nav">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="nav__item"
        active-class="nav__item--active"
      >
        <span class="nav__icon" v-html="tab.icon" />
        <span class="nav__label">{{ tab.label }}</span>
      </NuxtLink>
    </nav>

    <NuxtLink to="/create" class="nav-create" :class="{ 'nav-create--active': route.path === '/create' }">
      <span class="nav-create__icon" v-html="plusIcon" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

function isActive(tab: { to: string; activePrefix?: string }) {
  if (tab.activePrefix) return route.path.startsWith(tab.activePrefix)
  return route.path === tab.to
}

const tabs = [
  {
    to: '/',
    label: 'Заявки',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 3a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m6 13H6v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1z"/>
    </svg>`,
  },
  {
    to: '/my-requests',
    label: 'Мои заявки',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M3 13h2v-2H3zm0 4h2v-2H3zm0-8h2V7H3zm4 4h14v-2H7zm0 4h14v-2H7zM7 7v2h14V7z"/>
    </svg>`,
  },
  {
    to: '/settings',
    activePrefix: '/settings',
    label: 'Настройки',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7 7 0 0 0-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54a7.4 7.4 0 0 0-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87a.47.47 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54a7.4 7.4 0 0 0 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61zM12 15.6A3.6 3.6 0 0 1 8.4 12 3.6 3.6 0 0 1 12 8.4 3.6 3.6 0 0 1 15.6 12 3.6 3.6 0 0 1 12 15.6"/>
    </svg>`,
  },
]

const plusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
  <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6z"/>
</svg>`
</script>

<style scoped>
.nav-wrapper {
  position: fixed;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 100;
  margin-bottom: env(safe-area-inset-bottom);
}

.nav {
  flex: 1;
  height: 64px;
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--tg-secondary-bg) 85%, transparent);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
  border-radius: 50px;
  padding: 0 6px;
  box-shadow:
    0 8px 32px color-mix(in srgb, #000 20%, transparent),
    0 2px 8px color-mix(in srgb, #000 12%, transparent);
}

.nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--tg-hint);
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  padding: 8px 6px;
  border-radius: 50px;
  transition:
    color 0.5s ease,
    background 0.5s ease;
  min-width: 0;
}

.nav__item--active {
  color: var(--tg-button);
  background: color-mix(in srgb, var(--tg-hint) 18%, transparent);
}

.nav__item:active .nav__icon {
  transform: scale(0.88);
}

.nav__icon {
  display: flex;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  transition: transform 0.15s ease;
}

.nav__label {
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.nav-create {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50px;
  background: color-mix(in srgb, var(--tg-secondary-bg) 85%, transparent);
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid color-mix(in srgb, var(--tg-hint) 12%, transparent);
  box-shadow:
    0 8px 32px color-mix(in srgb, #000 20%, transparent),
    0 2px 8px color-mix(in srgb, #000 12%, transparent);
  color: var(--tg-text);
  text-decoration: none;
  flex-shrink: 0;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.nav-create:active {
  opacity: 0.7;
  transform: scale(0.92);
}

.nav-create--active {
  color: var(--tg-button);
}

.nav-create__icon {
  display: flex;
  transition: transform 0.15s ease;
}

.nav-create:active .nav-create__icon {
  transform: scale(0.88);
}
</style>
