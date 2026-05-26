import type WebApp from '@twa-dev/sdk'

const MOCK_USER = {
  id: 123456789,
  first_name: 'Dev',
  last_name: 'User',
  username: 'devuser',
  language_code: 'ru',
  is_premium: false,
}

const MOCK_THEME = {
  bg_color: '#ffffff' as `#${string}`,
  text_color: '#000000' as `#${string}`,
  hint_color: '#999999' as `#${string}`,
  link_color: '#2481cc' as `#${string}`,
  button_color: '#2481cc' as `#${string}`,
  button_text_color: '#ffffff' as `#${string}`,
  secondary_bg_color: '#f1f1f1' as `#${string}`,
}

const mainButtonListeners: Array<() => void> = []

const mockWebApp = {
  initData: '',
  initDataUnsafe: { user: MOCK_USER },
  colorScheme: 'light' as const,
  themeParams: MOCK_THEME,
  ready: () => console.log('[TG Mock] ready()'),
  expand: () => console.log('[TG Mock] expand()'),
  close: () => console.log('[TG Mock] close()'),
  showAlert: (msg: string, cb?: () => void) => { window.alert(`[TG] ${msg}`); cb?.() },
  showConfirm: (msg: string, cb?: (ok: boolean) => void) => cb?.(window.confirm(`[TG] ${msg}`)),
  HapticFeedback: {
    impactOccurred(type: string) { console.log(`[TG Haptic] ${type}`); return this },
    notificationOccurred(type: string) { console.log(`[TG Haptic Notify] ${type}`); return this },
    selectionChanged() { console.log('[TG Haptic] selectionChanged'); return this },
  },
  MainButton: {
    text: '',
    isVisible: false,
    setText(text: string) { this.text = text; console.log(`[TG MainButton] text: ${text}`); return this },
    show() { this.isVisible = true; console.log('[TG MainButton] show'); return this },
    hide() { this.isVisible = false; console.log('[TG MainButton] hide'); return this },
    onClick(cb: () => void) { mainButtonListeners.push(cb); return this },
    offClick(cb: () => void) { return this },
  },
} as unknown as typeof WebApp

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return

  console.log('[TG Mock] active')

  return {
    provide: { telegram: mockWebApp },
  }
})
