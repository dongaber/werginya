import WebApp from '@twa-dev/sdk'

export default defineNuxtPlugin(() => {
  if (import.meta.dev) return

  WebApp.ready()
  WebApp.expand()

  return {
    provide: { telegram: WebApp },
  }
})
