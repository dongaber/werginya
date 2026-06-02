import {
  init,
  backButton,
  themeParams,
  miniApp,
  viewport,
  initData,
  emitEvent,
  mockTelegramEnv,
} from '@tma.js/sdk'

export interface TmaInitOptions {
  eruda?: boolean
  mockForMacOS?: boolean
}

export function initTMA({ eruda = false, mockForMacOS = false }: TmaInitOptions = {}) {
  // Telegram for macOS doesn't respond to web_app_request_theme / safe area requests
  if (mockForMacOS) {
    mockTelegramEnv({
      onEvent(event, next) {
        if (event.name === 'web_app_request_theme') {
          emitEvent('theme_changed', { theme_params: themeParams.state() })
          return
        }
        if (event.name === 'web_app_request_safe_area') {
          emitEvent('safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 })
          return
        }
        if (event.name === 'web_app_request_content_safe_area') {
          emitEvent('content_safe_area_changed', { left: 0, top: 0, right: 0, bottom: 0 })
          return
        }
        next()
      },
    })
  }

  init()

  initData.restore()

  themeParams.mount()
  themeParams.bindCssVars()

  backButton.mount()

  miniApp.mount()

  viewport.mount().then(() => {
    viewport.bindCssVars()
    viewport.expand()
  })

  if (eruda) {
    import('eruda').then(({ default: e }) => {
      e.init({ useShadowDom: true, autoScale: true })
      e.position({ x: window.innerWidth - 50, y: 0 })
    })
  }
}
