export default defineEventHandler(async (event) => {
  const { status, type, userId, telegramId, cursor, take } = getQuery(event)

  let resolvedUserId: number | undefined
  if (telegramId) {
    const user = await prisma.user.findUnique({ where: { telegramId: BigInt(String(telegramId)) } })
    if (!user) return []
    resolvedUserId = user.id
  } else if (userId) {
    resolvedUserId = Number(userId)
  }

  const takeNum = take ? Math.min(Number(take), 50) : 20
  const cursorId = cursor ? Number(cursor) : undefined

  const data = await prisma.request.findMany({
    take: takeNum,
    ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
    where: {
      ...(status && { status: String(status) as any }),
      ...(type && { type: String(type) as any }),
      ...(resolvedUserId && { userId: resolvedUserId }),
    },
    include: requestInclude,
    orderBy: { createdAt: 'desc' },
  })

  return serialize(data)
})
