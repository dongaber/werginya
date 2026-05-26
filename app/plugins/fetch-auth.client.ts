export default defineNuxtPlugin(() => {
  const { $telegram } = useNuxtApp()
  const tg = $telegram as any

  const getHeaders = () => {
    const telegramId = tg?.initDataUnsafe?.user?.id ?? tg?.user?.id
    const initData = tg?.initData ?? ''
    const headers: Record<string, string> = {}
    if (telegramId) headers['x-telegram-id'] = String(telegramId)
    if (initData) headers['x-init-data'] = initData
    return headers
  }

  return {
    provide: {
      apiFetch: $fetch.create({
        onRequest({ options }) {
          const existing = options.headers
            ? Object.fromEntries(new Headers(options.headers as HeadersInit).entries())
            : {}
          options.headers = new Headers({ ...getHeaders(), ...existing })
        },
      }),
    },
  }
})
