import { initData } from '@tma.js/sdk'

export default defineNuxtPlugin(() => {
  const getHeaders = () => {
    const userId = initData.user()?.id
    const rawInitData = initData.raw() ?? ''
    const headers: Record<string, string> = {}
    if (userId) headers['x-telegram-id'] = String(userId)
    if (rawInitData) headers['x-init-data'] = rawInitData
    return headers
  }

  const apiFetch: typeof $fetch = $fetch.create({
    onRequest({ options }) {
      const existing = options.headers
        ? Object.fromEntries(new Headers(options.headers as HeadersInit).entries())
        : {}
      options.headers = new Headers({ ...getHeaders(), ...existing })
    },
  }) as typeof $fetch

  return {
    provide: { apiFetch },
  }
})
