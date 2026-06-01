export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)
  if (!body?.agreedToTerms || !body?.agreedToPrivacy) {
    throw createError({ statusCode: 400, message: 'Consent required' })
  }

  const existing = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { id: true },
  })
  if (existing) return serialize({ id: existing.id })

  const user = await prisma.user.create({
    data: {
      telegramId: BigInt(telegramId),
      firstName: body.firstName || 'User',
      lastName: body.lastName || null,
      username: body.username || null,
    },
    select: { id: true },
  })

  return serialize({ id: user.id })
})
