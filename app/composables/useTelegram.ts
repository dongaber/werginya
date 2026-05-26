import type WebApp from '@twa-dev/sdk'

export function useTelegram() {
  const { $telegram } = useNuxtApp()
  const tg = $telegram as typeof WebApp

  const user = computed(() => tg.initDataUnsafe?.user)
  const colorScheme = computed(() => tg.colorScheme)
  const themeParams = computed(() => tg.themeParams)

  function showMainButton(text: string, onClick: () => void) {
    tg.MainButton.setText(text)
    tg.MainButton.onClick(onClick)
    tg.MainButton.show()
  }

  function hideMainButton() {
    tg.MainButton.hide()
  }

  function showAlert(message: string) {
    tg.showAlert(message)
  }

  function showConfirm(message: string, callback: (confirmed: boolean) => void) {
    tg.showConfirm(message, callback)
  }

  function haptic(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
    tg.HapticFeedback.impactOccurred(type)
  }

  function close() {
    tg.close()
  }

  return {
    tg,
    user,
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
