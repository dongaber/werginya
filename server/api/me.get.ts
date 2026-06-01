export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: {
      id: true,
      isAdmin: true,
      subscriptionExpiresAt: true,
      _count: { select: { contactViews: true } },
    },
  })

  if (!user) return serialize({ exists: false, isAdmin: false, subscriptionActive: false, contactViewCount: 0 })

  return serialize({
    exists: true,
    isAdmin: user.isAdmin,
    subscriptionActive: !!user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date(),
    contactViewCount: user._count.contactViews,
  })
})
