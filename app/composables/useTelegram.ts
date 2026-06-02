import type { Computed } from '@tma.js/signals'
import {
  initData,
  backButton,
  mainButton,
  hapticFeedback,
  popup,
  miniApp,
  requestContact as tmaRequestContact,
} from '@tma.js/sdk'

function useSignal<T>(signal: Computed<T>) {
  const r = shallowRef<T>(signal())
  const unsub = signal.sub((val) => {
    r.value = val
  })
  onUnmounted(unsub)
  return r
}

export function useTelegram() {
  const tgUser = useSignal(initData.user)

  const telegramId = computed<number>(() => tgUser.value?.id ?? 1)
  const firstName = computed<string>(() => tgUser.value?.first_name ?? 'Пользователь')
  const lastName = computed<string>(() => tgUser.value?.last_name ?? '')
  const username = computed<string>(() => tgUser.value?.username ?? '')
  const fullName = computed(() => [firstName.value, lastName.value].filter(Boolean).join(' '))
  const avatarLetter = computed(() => firstName.value[0]?.toUpperCase() ?? '?')

  const isDark = useSignal(miniApp.isDark)
  const colorScheme = computed(() => (isDark.value ? 'dark' : 'light'))

  const userPhone = ref<string | null>(null)

  function showMainButton(text: string, onClick: () => void) {
    try {
      if (!mainButton.isMounted()) mainButton.mount()
      mainButton.setText(text)
      mainButton.onClick(onClick)
      mainButton.show()
    } catch (e) {
      console.error('[TMA] showMainButton failed:', e)
    }
  }

  function hideMainButton() {
    mainButton.hide()
  }

  function showAlert(message: string) {
    popup.show({ message, buttons: [{ type: 'ok' }] }).catch(() => {})
  }

  function showConfirm(message: string, callback: (confirmed: boolean) => void) {
    popup
      .show({
        message,
        buttons: [
          { id: 'ok', type: 'ok' },
          { id: 'cancel', type: 'cancel' },
        ],
      })
      .then((buttonId) => callback(buttonId === 'ok'))
      .catch(() => callback(false))
  }

  function haptic(type: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
    hapticFeedback.impactOccurred(type)
  }

  function close() {
    miniApp.close()
  }

  function showBackButton(onClick: () => void) {
    backButton.show()
    backButton.onClick(onClick)
  }

  function hideBackButton(onClick?: () => void) {
    if (onClick) backButton.offClick(onClick)
    backButton.hide()
  }

  function requestContact(callback: (phone: string | null) => void) {
    try {
      tmaRequestContact()
        .then((result) => {
          const raw = result.contact.phone_number
          callback(raw.startsWith('+') ? raw : `+${raw}`)
        })
        .catch(() => callback(null))
    } catch {
      callback(null)
    }
  }

  return {
    tgUser,
    userPhone,
    telegramId,
    firstName,
    lastName,
    username,
    fullName,
    avatarLetter,
    colorScheme,
    showMainButton,
    hideMainButton,
    showAlert,
    showConfirm,
    haptic,
    close,
    showBackButton,
    hideBackButton,
    requestContact,
  }
}
