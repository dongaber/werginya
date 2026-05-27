export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { filterGeoCity: true, filterEquipIds: true },
  })

  return {
    geoCity: user?.filterGeoCity ?? null,
    equipmentTypeIds: user?.filterEquipIds ?? [],
  }
})
