// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  ssr: false,
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      dadataToken: process.env.DADATA_TOKEN ?? '',
      yandexMapsKey: process.env.YANDEX_MAPS_KEY ?? '',
    },
  },
  nitro: {
    experimental: { tasks: true },
  },
  modules: ['@nuxt/eslint'],
  eslint: {
    config: {},
  },
  app: {
    head: {
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }],
      script: [],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: false,
  },
});
