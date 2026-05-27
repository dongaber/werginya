export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  checkRateLimit(`filters:${telegramId}`, 30, 60_000)

  const body = await readBody(event)

  if (body.geoCity !== undefined && body.geoCity !== null && typeof body.geoCity !== 'string') {
    throw createError({ statusCode: 400, message: 'geoCity must be a string or null' })
  }
  if (body.equipmentTypeIds !== undefined) {
    if (!Array.isArray(body.equipmentTypeIds) || body.equipmentTypeIds.some((id: unknown) => typeof id !== 'number')) {
      throw createError({ statusCode: 400, message: 'equipmentTypeIds must be an array of numbers' })
    }
  }

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { id: true },
  })
  if (!user) throw createError({ statusCode: 404, message: 'User not found' })

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(body.geoCity !== undefined && { filterGeoCity: body.geoCity || null }),
      ...(body.equipmentTypeIds !== undefined && { filterEquipIds: body.equipmentTypeIds }),
    },
  })

  return { ok: true }
})
