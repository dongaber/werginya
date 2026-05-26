export default defineEventHandler(async (event) => {
  const { telegramId } = getQuery(event)
  if (!telegramId) throw createError({ statusCode: 400, message: 'telegramId required' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(String(telegramId)) },
    select: { subscriptionExpiresAt: true },
  })

  if (!user) return { active: false, expiresAt: null }

  const active = !!user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date()
  return serialize({ active, expiresAt: user.subscriptionExpiresAt })
})
