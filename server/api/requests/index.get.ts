export default defineEventHandler(async (event) => {
  const { status, type, mine, cursor, take, geoCity, equipmentTypeIds } = getQuery(event)

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
