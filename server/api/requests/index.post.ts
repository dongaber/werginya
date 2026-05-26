export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.type) throw createError({ statusCode: 400, message: 'type is required' })
  if (!body?.paymentType) throw createError({ statusCode: 400, message: 'paymentType is required' })
  if (!body?.userId) throw createError({ statusCode: 400, message: 'userId is required' })

  const { type, paymentType, userId, rental, transportation, delivery } = body

  if (type === 'RENTAL') {
    if (!rental) throw createError({ statusCode: 400, message: 'rental data required' })
    const { equipmentTypeId, address, lat, lng, startsAt, durationDays } = rental
    if (!equipmentTypeId || !address || !startsAt || !durationDays) {
      throw createError({ statusCode: 400, message: 'rental: equipmentTypeId, address, startsAt, durationDays required' })
    }
    const data = await prisma.request.create({
      data: {
        type, paymentType, userId,
        rental: { create: { equipmentTypeId, address, lat, lng, startsAt: new Date(startsAt), durationDays } },
      },
      include: requestInclude,
    })
    return serialize(data)
  }

  if (type === 'TRANSPORTATION') {
    if (!transportation) throw createError({ statusCode: 400, message: 'transportation data required' })
    const { equipmentTypeId, cargo, fromAddress, fromLat, fromLng, toAddress, toLat, toLng, startsAt, ratePerHour } = transportation
    if (!equipmentTypeId || !cargo || !fromAddress || !toAddress || !startsAt || !ratePerHour) {
      throw createError({ statusCode: 400, message: 'transportation: equipmentTypeId, cargo, fromAddress, toAddress, startsAt, ratePerHour required' })
    }
    const data = await prisma.request.create({
      data: {
        type, paymentType, userId,
        transportation: { create: { equipmentTypeId, cargo, fromAddress, fromLat, fromLng, toAddress, toLat, toLng, startsAt: new Date(startsAt), ratePerHour } },
      },
      include: requestInclude,
    })
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
        type, paymentType, userId,
        delivery: { create: { cargo, toAddress, toLat, toLng, startsAt: new Date(startsAt), volume } },
      },
      include: requestInclude,
    })
    return serialize(data)
  }

  throw createError({ statusCode: 400, message: 'invalid type' })
})
