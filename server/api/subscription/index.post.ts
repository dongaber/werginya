const PLANS: Record<string, number> = {
  month_1: 1,
  month_3: 3,
  month_6: 6,
  month_12: 12,
}

export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  const { plan } = body

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
  expiresAt.setDate(1) // anchor to 1st to avoid month-end overflow (Jan 31 + 1 month = Mar 3)
  expiresAt.setMonth(expiresAt.getMonth() + months)

  const user = await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { subscriptionExpiresAt: expiresAt },
    select: { subscriptionExpiresAt: true },
  })

  return serialize({ active: true, expiresAt: user.subscriptionExpiresAt })
})
