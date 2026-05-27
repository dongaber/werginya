export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/')) return

  const botToken = process.env.BOT_TOKEN

  if (!botToken) {
    const id = getHeader(event, 'x-telegram-id')
    if (id) event.context.telegramId = id
    return
  }

  const initData = getHeader(event, 'x-init-data')
  const telegramId = initData ? verifyInitData(initData, botToken) : null

  if (!telegramId) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  event.context.telegramId = telegramId
})
