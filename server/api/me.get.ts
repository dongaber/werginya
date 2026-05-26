export default defineEventHandler(async (event) => {
  const { telegramId } = getQuery(event)
  if (!telegramId) throw createError({ statusCode: 400, message: 'telegramId required' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(String(telegramId)) },
    select: { id: true, isAdmin: true, subscriptionExpiresAt: true },
  })

  if (!user) return serialize({ isAdmin: false, subscriptionActive: false })

  return serialize({
    isAdmin: user.isAdmin,
    subscriptionActive: !!user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date(),
  })
})
