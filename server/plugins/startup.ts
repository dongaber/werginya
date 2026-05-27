export default defineNitroPlugin(() => {
  if (!process.env.BOT_TOKEN) {
    console.warn('[SECURITY] BOT_TOKEN is not set — initData verification disabled. Do NOT use in production.')
  }
})
