export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { subscriptionExpiresAt: true },
  })

  if (!user) return { active: false, expiresAt: null }

  const active = !!user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date()
  return serialize({ active, expiresAt: user.subscriptionExpiresAt })
})
