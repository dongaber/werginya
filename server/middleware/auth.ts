export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) return

  const botToken = process.env.BOT_TOKEN
  if (!botToken) return

  const initData = getHeader(event, 'x-init-data')
  if (!initData || !verifyInitData(initData, botToken)) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }
})
