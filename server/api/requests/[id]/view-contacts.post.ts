const CONTACT_VIEW_LIMIT = 5

export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const requestId = Number(getRouterParam(event, 'id'))
  if (!requestId) throw createError({ statusCode: 400, message: 'invalid id' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: {
      id: true,
      subscriptionExpiresAt: true,
      _count: { select: { contactViews: true } },
    },
  })
  if (!user) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const existing = await prisma.contactView.findUnique({
    where: { userId_requestId: { userId: user.id, requestId } },
  })

  if (!existing) {
    const subscriptionActive = !!user.subscriptionExpiresAt && user.subscriptionExpiresAt > new Date()

    if (!subscriptionActive && user._count.contactViews >= CONTACT_VIEW_LIMIT) {
      throw createError({
        statusCode: 403,
        data: { reason: 'limit_reached' },
        message: 'Contact view limit reached',
      })
    }

    await prisma.contactView.create({ data: { userId: user.id, requestId } })
  }

  const request = await prisma.request.findUnique({
    where: { id: requestId },
    select: { contactPhone: true, contactTelegram: true, contactWhatsapp: true },
  })
  if (!request) throw createError({ statusCode: 404, message: 'Not found' })

  return {
    contactPhone: request.contactPhone,
    contactTelegram: request.contactTelegram,
    contactWhatsapp: request.contactWhatsapp,
  }
})
