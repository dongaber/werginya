import { mockTelegramEnv } from '@tma.js/sdk'

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return

  mockTelegramEnv({
    launchParams: {
      tgWebAppPlatform: 'tdesktop',
      tgWebAppVersion: '8.0',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
        secondary_bg_color: '#f1f1f1',
      },
      tgWebAppData: new URLSearchParams({
        user: JSON.stringify({
          id: 123456789,
          first_name: 'Dev',
          last_name: 'User',
          username: 'devuser',
          language_code: 'ru',
          is_premium: 'false',
        }),
        auth_date: String(Math.floor(Date.now() / 1000)),
        hash: 'dev_mock_hash_not_valid_for_prod',
      }),
    },
  })

  console.log('[TG Mock] active')
})
