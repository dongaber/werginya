export default defineEventHandler(async (event) => {
  const { status, type, mine, cursor, take, geoLat, geoLng, geoRadiusKm, equipmentTypeIds } = getQuery(event)

  let resolvedUserId: number | undefined
  if (mine) {
    const telegramId = event.context.telegramId
    if (!telegramId) throw createError({ statusCode: 401, message: 'Unauthorized' })
    const user = await prisma.user.findUnique({ where: { telegramId: BigInt(telegramId) } })
    if (!user) return []
    resolvedUserId = user.id
  }

  const isPublicFeed = !resolvedUserId
  const resolvedStatus = isPublicFeed ? 'PUBLISHED' : (status ? String(status) : undefined)

  const takeNum = take ? Math.min(Number(take), 50) : 20
  const cursorId = cursor ? Number(cursor) : undefined

  const equipIds = equipmentTypeIds
    ? (Array.isArray(equipmentTypeIds) ? equipmentTypeIds : [equipmentTypeIds]).map(Number).filter(Boolean)
    : []

  const AND: any[] = []

  const lat = geoLat ? parseFloat(String(geoLat)) : null
  const lng = geoLng ? parseFloat(String(geoLng)) : null
  const radius = geoRadiusKm ? parseFloat(String(geoRadiusKm)) : null

  if (lat != null && lng != null && radius != null) {
    type GeoRow = { id: bigint }
    const rows = await prisma.$queryRaw<GeoRow[]>`
      SELECT DISTINCT r.id FROM "Request" r
      LEFT JOIN "Rental"         ren  ON ren."requestId"  = r.id
      LEFT JOIN "Transportation" tr   ON tr."requestId"   = r.id
      LEFT JOIN "Delivery"       del  ON del."requestId"  = r.id
      WHERE (
        (ren.lat  IS NOT NULL AND ren.lng  IS NOT NULL AND
          6371 * acos(LEAST(1, cos(radians(${lat})) * cos(radians(ren.lat::float))  * cos(radians(ren.lng::float)  - radians(${lng})) + sin(radians(${lat})) * sin(radians(ren.lat::float))))  <= ${radius})
        OR
        (tr."fromLat" IS NOT NULL AND tr."fromLng" IS NOT NULL AND
          6371 * acos(LEAST(1, cos(radians(${lat})) * cos(radians(tr."fromLat"::float)) * cos(radians(tr."fromLng"::float) - radians(${lng})) + sin(radians(${lat})) * sin(radians(tr."fromLat"::float)))) <= ${radius})
        OR
        (tr."toLat" IS NOT NULL AND tr."toLng" IS NOT NULL AND
          6371 * acos(LEAST(1, cos(radians(${lat})) * cos(radians(tr."toLat"::float))  * cos(radians(tr."toLng"::float)  - radians(${lng})) + sin(radians(${lat})) * sin(radians(tr."toLat"::float))))  <= ${radius})
        OR
        (del."toLat" IS NOT NULL AND del."toLng" IS NOT NULL AND
          6371 * acos(LEAST(1, cos(radians(${lat})) * cos(radians(del."toLat"::float)) * cos(radians(del."toLng"::float) - radians(${lng})) + sin(radians(${lat})) * sin(radians(del."toLat"::float)))) <= ${radius})
      )
    `
    const ids = rows.map(r => Number(r.id))
    AND.push({ id: { in: ids } })
  }

  if (equipIds.length > 0) {
    AND.push({
      OR: [
        { type: 'RENTAL', rental: { equipmentTypeId: { in: equipIds } } },
        { type: 'TRANSPORTATION', transportation: { equipmentTypeId: { in: equipIds } } },
      ],
    })
  }

  const data = await prisma.request.findMany({
    take: takeNum,
    ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
    where: {
      ...(resolvedStatus && { status: resolvedStatus as any }),
      ...(type && { type: String(type) as any }),
      ...(resolvedUserId && { userId: resolvedUserId }),
      ...(AND.length > 0 && { AND }),
    },
    include: requestInclude,
    orderBy: { createdAt: 'desc' },
  })

  // For public feed: determine which requests the current user has already unlocked
  let unlockedSet = new Set<number>()
  if (isPublicFeed && data.length > 0) {
    const telegramId = event.context.telegramId
    if (telegramId) {
      const currentUser = await prisma.user.findUnique({
        where: { telegramId: BigInt(telegramId) },
        select: { id: true },
      })
      if (currentUser) {
        const views = await prisma.contactView.findMany({
          where: { userId: currentUser.id, requestId: { in: data.map(r => r.id) } },
          select: { requestId: true },
        })
        unlockedSet = new Set(views.map(v => v.requestId))
      }
    }
  }

  const result = data.map((req) => {
    const unlocked = !isPublicFeed || unlockedSet.has(req.id)
    return {
      ...req,
      contactPhone: unlocked ? req.contactPhone : null,
      contactTelegram: unlocked ? req.contactTelegram : null,
      contactWhatsapp: unlocked ? req.contactWhatsapp : null,
      contactsUnlocked: unlocked,
    }
  })

  return serialize(result)
})
