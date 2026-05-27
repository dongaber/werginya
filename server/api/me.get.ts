export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { id: true, isAdmin: true, subscriptionExpiresAt: true },
  })

  if (!user) return serialize({ isAdmin: false, subscriptionActive: false })

  return serialize({
    isAdmin: user.isAdmin,
    subscriptionActive: !!user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date(),
  })
})
