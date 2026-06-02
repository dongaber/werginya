<template>
  <AppEnvUnsupported v-if="tmaError" />
  <template v-else>
    <AppPreloader />
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage :transition="pageTransition" />
    </NuxtLayout>
    <AppToastList />
  </template>
</template>

<script setup lang="ts">
const tmaError = useState('tmaError', () => false)
const route = useRoute()

const pageTransition = computed(() => {
  const isSettingsSub = route.path.startsWith('/settings/') && route.path !== '/settings'
  return {
    name: isSettingsSub ? 'slide-right' : 'page',
    mode: 'out-in' as const,
  }
})
</script>

<style>
:root {
  --tg-bg: var(--tg-theme-bg-color, #ffffff);
  --tg-text: var(--tg-theme-text-color, #000000);
  --tg-hint: var(--tg-theme-hint-color, #999999);
  --tg-link: var(--tg-theme-link-color, #2481cc);
  --tg-button: var(--tg-theme-button-color, #2481cc);
  --tg-button-text: var(--tg-theme-button-text-color, #ffffff);
  --tg-secondary-bg: var(--tg-theme-secondary-bg-color, #f1f1f1);

  /* Safe area aliases — use max() to cover both native CSS env and Telegram SDK vars */
  --sa-top: max(env(safe-area-inset-top, 0px), var(--tg-viewport-content-safe-area-inset-top, 0px));
  --sa-bottom: max(env(safe-area-inset-bottom, 0px), var(--tg-viewport-safe-area-inset-bottom, 0px));
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--tg-bg);
  color: var(--tg-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.slide-right-enter-from {
  opacity: 0;
  transform: translateX(48px);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}
</style>
