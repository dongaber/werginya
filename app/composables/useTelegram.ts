import type WebApp from '@twa-dev/sdk'

interface TgContact {
  phone_number: string
  first_name: string
  last_name?: string
  user_id?: number
}

// requestContact is not in @twa-dev/sdk types but exists at runtime
interface TelegramWebApp extends typeof WebApp {
  requestContact(callback: (sent: boolean, event?: { contact?: TgContact }) => void): void
  initDataUnsafe: typeof WebApp.initDataUnsafe & {
    contact?: TgContact
  }
}

export function useTelegram() {
  const { $telegram } = useNuxtApp()
  const tg = $telegram as TelegramWebApp | undefined

  const tgUser = computed(() => tg?.initDataUnsafe?.user ?? null)
  const initData = computed(() => tg?.initData ?? '')

  // phone_number exists at runtime for users who granted contact access previously
  const userPhone = computed<string | null>(() =>
    (tgUser.value as (typeof tgUser.value & { phone_number?: string }) | null)?.phone_number ?? null
  )

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

  function showBackButton(onClick: () => void) {
    tg?.BackButton.onClick(onClick)
    tg?.BackButton.show()
  }

  function hideBackButton(onClick?: () => void) {
    if (onClick) tg?.BackButton.offClick(onClick)
    tg?.BackButton.hide()
  }

  function requestContact(callback: (phone: string | null) => void) {
    if (!tg?.requestContact) { callback(null); return }
    tg.requestContact((sent, event) => {
      if (!sent) { callback(null); return }
      const raw = event?.contact?.phone_number
        ?? tg.initDataUnsafe?.contact?.phone_number
        ?? null
      const phone = raw ? (raw.startsWith('+') ? raw : `+${raw}`) : null
      callback(phone)
    })
  }

  return {
    tgUser,
    userPhone,
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
    showBackButton,
    hideBackButton,
    requestContact,
  }
}
