const PLANS: Record<string, number> = {
  month_1: 1,
  month_3: 3,
  month_6: 6,
  month_12: 12,
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { telegramId, plan } = body

  if (!telegramId) throw createError({ statusCode: 400, message: 'telegramId required' })
  if (!plan || !PLANS[plan]) throw createError({ statusCode: 400, message: 'invalid plan' })

  const existing = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { subscriptionExpiresAt: true },
  })
  if (existing?.subscriptionExpiresAt && existing.subscriptionExpiresAt > new Date()) {
    throw createError({ statusCode: 409, message: 'subscription already active' })
  }

  const months = PLANS[plan]!
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + months)

  const user = await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { subscriptionExpiresAt: expiresAt },
    select: { subscriptionExpiresAt: true },
  })

  return serialize({ active: true, expiresAt: user.subscriptionExpiresAt })
})
