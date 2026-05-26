import type WebApp from '@twa-dev/sdk'

export function useTelegram() {
  const { $telegram } = useNuxtApp()
  const tg = $telegram as typeof WebApp

  const tgUser = computed(() => (tg as any)?.initDataUnsafe?.user ?? (tg as any)?.user ?? null)
  const initData = computed(() => (tg as any)?.initData ?? '')

  const telegramId = computed<number>(() => tgUser.value?.id ?? 1)
  const firstName = computed<string>(() => tgUser.value?.first_name ?? 'Пользователь')
  const lastName = computed<string>(() => tgUser.value?.last_name ?? '')
  const username = computed<string>(() => tgUser.value?.username ?? '')
  const fullName = computed(() => [firstName.value, lastName.value].filter(Boolean).join(' '))
  const avatarLetter = computed(() => firstName.value[0]?.toUpperCase() ?? '?')

  const colorScheme = computed(() => tg?.colorScheme ?? 'light')
  const themeParams = computed(() => tg?.themeParams ?? {})

  function showMainButton(text: string, onClick: () => void) {
    tg?.MainButton.setText(text)
    tg?.MainButton.onClick(onClick)
    tg?.MainButton.show()
  }

  function hideMainButton() {
    tg?.MainButton.hide()
  }

  function showAlert(message: string) {
    tg?.showAlert(message)
  }

  function showConfirm(message: string, callback: (confirmed: boolean) => void) {
    tg?.showConfirm(message, callback)
  }

  function haptic(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
    tg?.HapticFeedback.impactOccurred(type)
  }

  function close() {
    tg?.close()
  }

  return {
    tg,
    tgUser,
    initData,
    telegramId,
    firstName,
    lastName,
    username,
    fullName,
    avatarLetter,
    colorScheme,
    themeParams,
    showMainButton,
    hideMainButton,
    showAlert,
    showConfirm,
    haptic,
    close,
  }
}
