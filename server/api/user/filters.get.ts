export default defineEventHandler(async (event) => {
  const telegramId = event.context.telegramId
  if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })

  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
    select: { filterGeoLat: true, filterGeoLng: true, filterGeoRadiusKm: true, filterEquipIds: true },
  })

  return {
    geoLat: user?.filterGeoLat != null ? Number(user.filterGeoLat) : null,
    geoLng: user?.filterGeoLng != null ? Number(user.filterGeoLng) : null,
    geoRadiusKm: user?.filterGeoRadiusKm ?? null,
    equipmentTypeIds: user?.filterEquipIds ?? [],
  }
})
