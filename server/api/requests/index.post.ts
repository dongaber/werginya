function fireNotification(requestId: number) {
  runTask('notify-new-request', { payload: { requestId } }).catch(() => {})
}

export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  checkRateLimit(`create:${telegramId}`, 10, 60_000)

  const body = await readBody(event)

  if (!body?.type) throw createError({ statusCode: 400, message: 'type is required' })
  if (!body?.paymentType) throw createError({ statusCode: 400, message: 'paymentType is required' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { id: true },
  })
  if (!user) throw createError({ statusCode: 403, message: 'User not registered' })
  const userId = user.id

  const { type, paymentType, rental, transportation, delivery, contactPhone, contactTelegram, contactWhatsapp } = body
  const contacts = {
    ...(contactPhone && { contactPhone }),
    ...(contactTelegram && { contactTelegram }),
    ...(contactWhatsapp && { contactWhatsapp }),
  }

  if (type === 'RENTAL') {
    if (!rental) throw createError({ statusCode: 400, message: 'rental data required' })
    const { equipmentTypeId, address, lat, lng, startsAt, durationDays } = rental
    if (!equipmentTypeId || !address || !startsAt || !durationDays) {
      throw createError({ statusCode: 400, message: 'rental: equipmentTypeId, address, startsAt, durationDays required' })
    }
    const data = await prisma.request.create({
      data: {
        type, paymentType, userId, ...contacts,
        rental: { create: { equipmentTypeId, address, lat, lng, startsAt: new Date(startsAt), durationDays } },
      },
      include: requestInclude,
    })
    fireNotification(data.id)
    return serialize(data)
  }

  if (type === 'TRANSPORTATION') {
    if (!transportation) throw createError({ statusCode: 400, message: 'transportation data required' })
    const { equipmentTypeId, cargo, fromAddress, fromLat, fromLng, toAddress, toLat, toLng, startsAt, ratePerHour } = transportation
    if (!equipmentTypeId || !cargo || !fromAddress || !toAddress || !startsAt) {
      throw createError({ statusCode: 400, message: 'transportation: equipmentTypeId, cargo, fromAddress, toAddress, startsAt required' })
    }
    if (ratePerHour == null || typeof ratePerHour !== 'number' || isNaN(ratePerHour) || ratePerHour < 0) {
      throw createError({ statusCode: 400, message: 'transportation: ratePerHour must be a non-negative number' })
    }
    const data = await prisma.request.create({
      data: {
        type, paymentType, userId, ...contacts,
        transportation: { create: { equipmentTypeId, cargo, fromAddress, fromLat, fromLng, toAddress, toLat, toLng, startsAt: new Date(startsAt), ratePerHour } },
      },
      include: requestInclude,
    })
    fireNotification(data.id)
    return serialize(data)
  }

  if (type === 'DELIVERY') {
    if (!delivery) throw createError({ statusCode: 400, message: 'delivery data required' })
    const { cargo, toAddress, toLat, toLng, startsAt, volume } = delivery
    if (!cargo || !toAddress || !startsAt || !volume) {
      throw createError({ statusCode: 400, message: 'delivery: cargo, toAddress, startsAt, volume required' })
    }
    const data = await prisma.request.create({
      data: {
        type, paymentType, userId, ...contacts,
        delivery: { create: { cargo, toAddress, toLat, toLng, startsAt: new Date(startsAt), volume } },
      },
      include: requestInclude,
    })
    fireNotification(data.id)
    return serialize(data)
  }

  throw createError({ statusCode: 400, message: 'invalid type' })
})
