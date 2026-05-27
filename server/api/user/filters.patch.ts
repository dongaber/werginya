export default defineEventHandler(async (event) => {
  const telegramId = getHeader(event, 'x-telegram-id')
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const body = await readBody(event)

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
