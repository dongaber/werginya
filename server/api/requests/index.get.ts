export default defineEventHandler(async (event) => {
  const { status, type, userId, telegramId, cursor, take, geoCity, equipmentTypeIds } = getQuery(event)

  let resolvedUserId: number | undefined
  if (telegramId) {
    const user = await prisma.user.findUnique({ where: { telegramId: BigInt(String(telegramId)) } })
    if (!user) return []
    resolvedUserId = user.id
  } else if (userId) {
    resolvedUserId = Number(userId)
  }

  const isPublicFeed = !resolvedUserId
  const resolvedStatus = isPublicFeed ? 'PUBLISHED' : (status ? String(status) : undefined)

  const takeNum = take ? Math.min(Number(take), 50) : 20
  const cursorId = cursor ? Number(cursor) : undefined

  const geoCityStr = geoCity ? String(geoCity).trim() : undefined
  const equipIds = equipmentTypeIds
    ? (Array.isArray(equipmentTypeIds) ? equipmentTypeIds : [equipmentTypeIds]).map(Number).filter(Boolean)
    : []

  const AND: any[] = []

  if (geoCityStr) {
    AND.push({
      OR: [
        { rental: { address: { contains: geoCityStr, mode: 'insensitive' } } },
        { transportation: { fromAddress: { contains: geoCityStr, mode: 'insensitive' } } },
        { transportation: { toAddress: { contains: geoCityStr, mode: 'insensitive' } } },
        { delivery: { toAddress: { contains: geoCityStr, mode: 'insensitive' } } },
      ],
    })
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

  return serialize(data)
})
